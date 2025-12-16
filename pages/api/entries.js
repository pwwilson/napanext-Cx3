import { kv } from '@vercel/kv'

const ENTRIES_KEY = 'entries'

// Post new entry to Slack
async function postToSlack(entry){
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if(!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured')
    return
  }
  
  try{
    const typeEmoji = { compliments: '🚀', confessions: '🤫', captions: '🖼️' }
    const emoji = typeEmoji[entry.type] || '📝'
    const text = `${emoji} *${entry.type}*${entry.targetName ? ` → ${entry.targetName}` : ''}`
    const payload = {
      text: text,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: text }
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `> ${entry.message}` }
        },
        {
          type: 'context',
          elements: [{ type: 'mrkdwn', text: `_${new Date(entry.created_at).toLocaleTimeString()}_` }]
        }
      ]
    }
    const res = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if(!res.ok) console.warn('Slack post failed:', res.status, await res.text())
    else console.log('Slack post sent successfully')
  }catch(e){ console.error('Slack post error:', e.message, e.stack) }
}

async function read(){
  try{
    // Get all entries from KV
    const list = await kv.lrange(ENTRIES_KEY, 0, -1)
    return list || []
  }catch(e){ 
    console.error('KV read error:', e)
    return [] 
  }
}

async function write(list){
  try{
    // Clear and write all entries to KV
    await kv.del(ENTRIES_KEY)
    if(list.length > 0) {
      await kv.lpush(ENTRIES_KEY, ...list)
    }
  }catch(e){
    console.error('KV write error:', e)
  }
}

export default async function handler(req, res){
  console.log(`[${new Date().toISOString()}] ${req.method} /api/entries`)
  
  if(req.method === 'GET'){
    console.log('GET: fetching entries...')
    const list = await read()
    console.log(`GET: returning ${list.length} entries`)
    // newest first
    list.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
    return res.status(200).json(list)
  }

  if(req.method === 'POST'){
    try{
      console.log('POST: received body:', JSON.stringify(req.body))
      const { type, targetName, message } = req.body
      if(!type || !message) {
        console.error('POST: missing type or message')
        return res.status(400).json({ error: 'type and message required' })
      }

      const allowed = ['compliments','confessions','captions']
      if(!allowed.includes(type)) {
        console.error(`POST: invalid type "${type}"`)
        return res.status(400).json({ error: 'invalid type' })
      }

      console.log(`POST: creating ${type} entry`)
      const list = await read()
      const entry = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        type,
        targetName: targetName || null,
        message: String(message).slice(0,1000),
        created_at: new Date().toISOString()
      }
      console.log('POST: writing entry to file...')
      list.unshift(entry)
      await write(list)
      console.log('POST: entry written successfully')
      
      // post to Slack async (don't wait for response)
      console.log('POST: sending to Slack...')
      postToSlack(entry).catch(e => console.error('Slack post error:', e))
      
      console.log('POST: responding with 201')
      return res.status(201).json(entry)
    }catch(e){
      console.error('POST: error:', e.message, e.stack)
      return res.status(500).json({ error: 'server error' })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
