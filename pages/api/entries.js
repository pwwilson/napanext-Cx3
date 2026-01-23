import { createClient } from 'redis'

const ENTRIES_KEY = 'entries'
let redisClient = null

async function getRedis(){
  if(redisClient && redisClient.isOpen) return redisClient
  const url = process.env.NAPA__REDIS_URL || process.env.NAPA_REDIS_URL || process.env.REDIS_URL || process.env.KV_URL
  if(!url){
    throw new Error('NAPA__REDIS_URL/NAPA_REDIS_URL/REDIS_URL/KV_URL is not configured')
  }
  console.log('Connecting to Redis...')
  const client = createClient({ 
    url,
    socket: {
      connectTimeout: 5000,
      keepAlive: 5000,
    }
  })
  client.on('error', (err)=> console.error('Redis error:', err))
  await client.connect()
  redisClient = client
  return redisClient
}

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
    const res = await fetch(webhookUrl, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    })
    if(!res.ok) console.warn('Slack post failed:', res.status, await res.text())
    else console.log('Slack post sent successfully')
  }catch(e){ console.error('Slack post error:', e.message, e.stack) }
}

async function read(){
  try{
    const client = await getRedis()
    const list = await client.lRange(ENTRIES_KEY, 0, -1)
    const parsed = (list || []).map(item => {
      try{ return JSON.parse(item) }catch(_e){ return null }
    }).filter(Boolean)
    console.log('Redis read:', parsed.length, 'entries')
    return parsed
  }catch(e){ 
    console.error('Redis read error:', e.message, e.stack)
    return [] 
  }
}

async function addEntry(entry){
  try{
    const client = await getRedis()
    await client.lPush(ENTRIES_KEY, JSON.stringify(entry))
    console.log('Redis write success for entry:', entry.id)
  }catch(e){
    console.error('Redis write error:', e.message, e.stack)
    throw e
  }
}

export default async function handler(req, res){
  try {
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
        const entry = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
          type,
          targetName: targetName || null,
          message: String(message).slice(0,1000),
          created_at: new Date().toISOString()
        }
        console.log('POST: writing entry to KV...')
        await addEntry(entry)
        console.log('POST: entry written successfully')
        
        // post to Slack async (don't wait for response)
        console.log('POST: sending to Slack...')
        if(process.env.SLACK_WEBHOOK_URL) {
          postToSlack(entry).catch(e => console.error('Slack post error:', e))
        } else {
          console.log('POST: skipping Slack (no webhook configured)')
        }
        
        console.log('POST: responding with 201')
        return res.status(201).json(entry)
      }catch(e){
        console.error('POST: error:', e.message, e.stack)
        return res.status(500).json({ error: 'server error', details: e.message })
      }
    }

    res.setHeader('Allow', 'GET,POST')
    res.status(405).end('Method Not Allowed')
  } catch(e) {
    console.error('HANDLER ERROR:', e.message, e.stack)
    return res.status(500).json({ error: 'handler error', details: e.message })
  }
}
