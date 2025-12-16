import { useState, useEffect } from 'react'

export default function PasswordGate({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    // Check if already unlocked in this session
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('cx3_unlocked')
      if (unlocked === 'true') {
        setIsUnlocked(true)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Password: cx32024 (or set via NEXT_PUBLIC_APP_PASSWORD env var)
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || 'cx32024'
    
    if (password === correctPassword) {
      setIsUnlocked(true)
      sessionStorage.setItem('cx3_unlocked', 'true')
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="mono" style={{ marginBottom: '12px' }}>Cx3</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
          This event is password-protected. Enter the password to continue.
        </p>
        
        <form onSubmit={handleSubmit}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            style={{ marginBottom: '16px' }}
          />
          
          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '16px' }}>
              Incorrect password. Try again.
            </p>
          )}
          
          <button type="submit" className="btn">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
