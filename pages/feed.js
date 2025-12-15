import { useEffect, useRef, useState } from 'react'

function fmt(t){
  try{ return new Date(t).toLocaleTimeString() }catch(e){return ''}
}

export default function Feed(){
  const [entries, setEntries] = useState([])
  const containerRef = useRef(null)

  useEffect(()=>{
    let mounted = true
    const fetchEntries = async () =>{
      try{
        const res = await fetch('/api/entries')
        const data = await res.json()
        // API returns newest-first; show oldest-first in feed
        const asc = (data || []).slice().reverse()
        if(mounted) setEntries(asc)
      }catch(e){console.error(e)}
    }
    fetchEntries()
    const id = setInterval(fetchEntries, 1500)
    return ()=>{ mounted=false; clearInterval(id) }
  },[])

  useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    // auto-scroll to bottom when new entries arrive
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  },[entries])

  return (
    <div className="container">
      <h1 className="mono">Cx3 Feed</h1>
      <p className="card">Live feed — shows entries in realtime as they arrive.</p>

      <div ref={containerRef} className="card feed-list">
        {entries.length === 0 && <div className="feed-empty">No entries yet</div>}
        {entries.map(e => (
          <div key={e.id} className="feed-entry">
            <div className="feed-meta"><strong className="mono">{e.type}</strong> · <small>{fmt(e.created_at)}</small></div>
            <div className="feed-message">{e.targetName? <span className="mono">To {e.targetName} — </span>: null}{e.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
