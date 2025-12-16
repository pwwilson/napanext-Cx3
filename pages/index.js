import Link from 'next/link'

const buttonStyle = {
  display: 'block',
  padding: '16px 20px',
  fontSize: '16px',
  fontWeight: '600',
  textAlign: 'center',
  backgroundColor: '#1a2847',
  color: 'var(--white)',
  borderRadius: '8px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
}

export default function Home(){
  return (
    <div className="container">
      <h1 className="mono" style={{ fontSize: '28px', lineHeight: '1.3', marginBottom: '8px' }}>
        Share Your Thoughts
      </h1>
      <p className="card" style={{ marginBottom: '24px' }}>Celebrate with compliments, confessions, and creative captions - all displayed live on the big screen.</p>

      <div className="card">
        <h2>Get started</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/compliments" style={buttonStyle}
            onMouseOver={(e) => e.target.style.opacity = '0.85'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            🚀 Post a Compliment
          </Link>
          <Link href="/confessions" style={buttonStyle}
            onMouseOver={(e) => e.target.style.opacity = '0.85'} onMouseOut={(e) => e.target.style.opacity = '1'}>
            🤫 Share a Confession
          </Link>
          <Link href="/captions" style={buttonStyle}
            onMouseOver={(e) => e.target.style.opacity = '0.85'} onMouseOut={(e) => e.target.style.opacity = '1'}>
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
