import Link from 'next/link'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:0}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/logo.svg" alt="Cx3" className="logo" />
          <div style={{display:'flex',flexDirection:'column'}}>
            <span className="mono" style={{fontSize:18}}>Cx3</span>
            <small style={{color:'var(--muted)',fontSize:12}}>Compliments · Confessions · Captions</small>
          </div>
        </Link>

        <nav style={{fontSize:14, display:'flex', gap:12}}>
          <Link href="/display">Live</Link>
          <Link href="/feed">Feed</Link>
        </nav>
      </div>
    </header>
  )
}
