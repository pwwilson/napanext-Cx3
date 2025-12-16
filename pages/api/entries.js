import fs from 'fs'
import path from 'path'

const DATA = path.resolve(process.cwd(), 'data', 'entries.json')

// Post new entry to Slack
async function postToSlack(entry){
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if(!webhookUrl) return // skip if no webhook configured
  
  try{
    const typeEmoji = { compliments: '💐', confessions: '🤫', captions: '🖼️' }
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
    await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }catch(e){ console.warn('Slack post failed:', e.message) }
}

async function read(){
  try{
    const raw = await fs.promises.readFile(DATA, 'utf8')
    return JSON.parse(raw || '[]')
  }catch(e){ return [] }
}

async function write(list){
  await fs.promises.mkdir(path.dirname(DATA), { recursive: true })
  await fs.promises.writeFile(DATA, JSON.stringify(list, null, 2), 'utf8')
}

export default async function handler(req, res){
  if(req.method === 'GET'){
    const list = await read()
    // newest first
    list.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
    return res.status(200).json(list)
  }

  if(req.method === 'POST'){
    try{
      const { type, targetName, message } = req.body
      if(!type || !message) return res.status(400).json({ error: 'type and message required' })

      const allowed = ['compliments','confessions','captions']
      if(!allowed.includes(type)) return res.status(400).json({ error: 'invalid type' })

      const list = await read()
      const entry = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        type,
        targetName: targetName || null,
        message: String(message).slice(0,1000),
        created_at: new Date().toISOString()
      }
      list.unshift(entry)
      await write(list)
      // post to Slack async (don't wait for response)
      postToSlack(entry).catch(e => console.error('Slack post error:', e))
      return res.status(201).json(entry)
    }catch(e){
      console.error(e)
      return res.status(500).json({ error: 'server error' })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
