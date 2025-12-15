import { useEffect, useState } from 'react'

function groupBy(list, key){
  return list.reduce((acc,item)=>{ (acc[item.type] ||= []).push(item); return acc }, {})
}

export default function Display(){
  const [entries, setEntries] = useState([])

  useEffect(()=>{
    let mounted = true
    const f = async () =>{
      try{
        const res = await fetch('/api/entries')
        const data = await res.json()
        if(mounted) setEntries(data)
      }catch(e){console.error(e)}
    }
    f()
    const id = setInterval(f, 2500)
    return ()=>{ mounted=false; clearInterval(id) }
  },[])

  const byType = groupBy(entries, 'type')

  return (
    <div style={{padding:20}}>
      <h1 className="mono">Cx3 Live</h1>
      <div className="columns">
        <div className="col card">
          <h3>Compliments</h3>
          {(byType.compliments || []).map(e=> <div key={e.id} className="card">{e.targetName?`To ${e.targetName} — `:''}{e.message}</div>)}
        </div>

        <div className="col card">
          <h3>Confessions</h3>
          <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
            {(byType.confessions || []).map(e=> <div key={e.id} className="card">{e.message}</div>)}
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3>Captions (latest 5)</h3>
        {(byType.captions || []).slice(0,5).map(e=> <div key={e.id} className="card">{e.message}</div>)}
      </div>
    </div>
  )
}
