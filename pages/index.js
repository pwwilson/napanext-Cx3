import Link from 'next/link'

export default function Home(){
  return (
    <div className="container">
      <h1 className="mono">Cx3</h1>
      <p className="card">Compliments · Confessions · Captions</p>

      <div className="card">
        <h2>Get started</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/compliments" style={{
            display: 'block',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: 'var(--accent)',
            color: 'var(--white)',
            borderRadius: '8px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }} onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            💐 Post a Compliment
          </Link>
          <Link href="/confessions" style={{
            display: 'block',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: 'var(--accent)',
            color: 'var(--white)',
            borderRadius: '8px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }} onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            🤫 Share a Confession
          </Link>
          <Link href="/captions" style={{
            display: 'block',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: 'var(--accent)',
            color: 'var(--white)',
            borderRadius: '8px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }} onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            🖼️ Caption This
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>Thank you for attending!</h3>
        <p>We're looking forward to also seeing you at the next Napa Next event 1/22 at the Napa Valley Car Club! 🏎️</p>
      </div>
    </div>
  )
}
