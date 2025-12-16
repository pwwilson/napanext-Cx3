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
    const id = setInterval(fetchEntries, 5000)
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
    <>
      <button aria-pressed={isFs} onClick={toggleFs} className="fs-btn" title={isFs? 'Exit fullscreen (Esc)': 'Enter fullscreen'}>
        <span className="material-symbols-outlined">{isFs ? 'fullscreen_exit' : 'fullscreen'}</span>
      </button>

      <div ref={wrapperRef} className="container feed-container" style={{position:'relative'}}>
        {/* Background video (full-bleed) */}
        <video className="feed-bg-video" src="/turntable1.mp4" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="bg-dim" aria-hidden="true"></div>
        <div className="feed-header">
          <div className="card feed-title">
            <h1 className="mono">Party Feed</h1>
          </div>
        </div>

        <div ref={containerRef} className="card feed-list">
        {entries.length === 0 && <div className="feed-empty">No entries yet</div>}
        {entries.map(e => {
          const typeMap = { compliments: 'compliment', confessions: 'confession', captions: 'caption' }
          const emojiMap = { compliments: '💐', confessions: '🤫', captions: '🖼️' }
          const dispType = typeMap[e.type] || e.type
          const emoji = emojiMap[e.type] || ''
          return (
            <div key={e.id} className="feed-entry">
              <div className="feed-meta"><span className="feed-emoji" aria-hidden="true">{emoji}</span><strong className="mono">{dispType}</strong> · <small>{fmt(e.created_at)}</small></div>
              {e.type === 'captions' && (
                <img src="/event-banner.jpeg" alt="Event banner" className="feed-caption-img" />
              )}
              <div className="feed-message">{e.targetName? <span className="mono">To {e.targetName} — </span>: null}{e.message}</div>
            </div>
          )
        })}
      </div>
      <img src="/qr-code.png" alt="QR code" className="feed-qr" />
    </div>
    </>
  )
}
