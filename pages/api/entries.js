import fs from 'fs'
import path from 'path'

const DATA = path.resolve(process.cwd(), 'data', 'entries.json')

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
      return res.status(201).json(entry)
    }catch(e){
      console.error(e)
      return res.status(500).json({ error: 'server error' })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
