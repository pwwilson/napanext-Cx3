import { useEffect, useRef, useState } from 'react'

function fmt(t){
  try{ return new Date(t).toLocaleTimeString() }catch(e){return ''}
}

export default function Feed(){
  const [entries, setEntries] = useState([])
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [isFs, setIsFs] = useState(false)

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

  // Fullscreen handlers
  useEffect(()=>{
    const onFsChange = ()=> setIsFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    const onKey = (e)=>{
      if(e.key === 'Escape' && document.fullscreenElement){
        document.exitFullscreen().catch(()=>{})
      }
    }
    document.addEventListener('keydown', onKey)
    return ()=>{ document.removeEventListener('fullscreenchange', onFsChange); document.removeEventListener('keydown', onKey) }
  },[])

  const toggleFs = async ()=>{
    try{
      if(!document.fullscreenElement){
        await wrapperRef.current?.requestFullscreen()
      }else{
        await document.exitFullscreen()
      }
    }catch(e){ console.warn('fullscreen failed', e) }
  }

  return (
    <div ref={wrapperRef} className="container" style={{position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div>
          <h1 className="mono">Cx3 Feed</h1>
          <p className="card" style={{display:'inline-block',margin:0}}>Live feed — shows entries in realtime as they arrive.</p>
        </div>
      </div>

      <button aria-pressed={isFs} onClick={toggleFs} className="fs-btn" title={isFs? 'Exit fullscreen (Esc)': 'Enter fullscreen'}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9v-6h6" />
          <path d="M21 15v6h-6" />
          <path d="M21 3v6h-6" />
          <path d="M3 21v-6h6" />
        </svg>
      </button>

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
