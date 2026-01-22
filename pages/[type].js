import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const TYPE_META = {
  compliments: {
    title: 'Compliments',
    subtitle: 'Send someone in the room a secret compliment',
    description: 'Brighten someone\'s day anonymously. Your kind words will appear on the big screen - but your identity stays secret.',
    fields: ['targetName','message'],
    submit: 'Send compliment'
  },
  confessions: {
    title: 'Confessions (tech-related?)',
    subtitle: 'Your confession is anonymous, but on the big screen',
    description: <>We all have secrets. Yours will be displayed for the room - but no one will know it came from you. Keep it harmless <span style={{fontSize: '14px'}}>(and tech-related if you choose)</span>.</>,
    fields: ['message'],
    submit: 'Submit confession'
  },
  captions: {
    title: 'Caption This',
    subtitle: 'Caption the photo on the screen',
    description: 'What would you like to see NNED do Next?',
    fields: ['message'],
    submit: 'Submit caption'
  }
}

export default function TypePage(){
  const router = useRouter()
  const { type } = router.query
  const meta = TYPE_META[type] || {}
  const [targetName, setTargetName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [popup, setPopup] = useState({ show: false, msg: '', kind: '' })
  const popupTimer = useRef(null)

  const showPopup = (msg, kind = 'info', timeout = 3000) => {
    if(popupTimer.current) { clearTimeout(popupTimer.current); popupTimer.current = null }
    setPopup({ show: true, msg, kind })
    if(timeout) popupTimer.current = setTimeout(()=> setPopup({ show:false, msg:'', kind:'' }), timeout)
  }

  useEffect(()=>{
    return ()=>{ if(popupTimer.current){ clearTimeout(popupTimer.current); popupTimer.current = null } }
  },[])

  if(!type) return <div className="container">Loading…</div>

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    showPopup('Sending…', 'info', 0)
    const body = { type, message }
    if(type === 'compliments') body.targetName = targetName

    try {
      const res = await fetch('/api/entries', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(body) })
      if(res.ok){ 
        setStatus('sent'); setMessage(''); setTargetName('');
        showPopup('Sent - thanks!', 'success', 3000)
      } else { 
        const errData = await res.json().catch(()=>({}))
        setStatus('error');
        showPopup(errData.error ? `Error: ${errData.error}` : 'Could not send - try again', 'error', 5000)
      }
    } catch(e) {
      setStatus('error')
      showPopup('Network error - check connection', 'error', 5000)
    }
  }

  return (
    <div className="container">
      <h1 className="mono">{meta.title || 'Cx3'}</h1>
      <p className="card">{meta.subtitle}</p>
      {meta.description && (
        <p style={{color:'var(--muted)',fontSize:18,lineHeight:1.5,marginBottom:16}}>{meta.description}</p>
      )}
      {type === 'captions' && (
        <img src="/event-banner.jpeg" alt="Event banner" className="page-banner" />
      )}

      <form className="card" onSubmit={handleSubmit}>
        {meta.fields?.includes('targetName') && (
          <>
            <label>Who is this for? (optional)</label>
            <input value={targetName} onChange={(e)=>setTargetName(e.target.value)} placeholder="Name or nickname" />
          </>
        )}

        <label>Message</label>
        <textarea rows={5} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder={type==='captions'?'Your caption':'Write your message...'} />
        <button type="submit">{meta.submit || 'Send'}</button>
        {popup.show && (
          <div role="status" aria-live="polite" className={`response-popup response-popup--${popup.kind}`}>
            {popup.msg}
          </div>
        )}
      </form>
    </div>
  )
}
