import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header(){
  const router = useRouter()
  const queryString = router.query.key ? `?key=${router.query.key}` : ''
  
  return (
    <header className="site-header">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:0}}>
        <Link href={`/${queryString}`} style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/logo.svg" alt="Cx3" className="logo" />
          <div style={{display:'flex',flexDirection:'column'}}>
            <span className="mono" style={{fontSize:18}}>Napa Next LLC at The Napa Valley Car Club</span>
            <small style={{color:'var(--muted)',fontSize:12}}>Compliments · Confessions · Captions</small>
          </div>
        </Link>

        {/* <nav style={{fontSize:14, display:'flex', gap:12}}>
          <Link href="/display">Live</Link>
        </nav> */}
      </div>
    </header>
  )
}
