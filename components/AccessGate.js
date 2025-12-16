import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AccessGate({ children }) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Access key (can be customized via env var)
    const validKey = process.env.NEXT_PUBLIC_ACCESS_KEY || 'cx3party2024'
    
    // Check sessionStorage first
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('cx3_access')
      if (stored === 'granted') {
        setHasAccess(true)
        return
      }
    }

    // Check URL query param
    const { key } = router.query
    if (key === validKey) {
      setHasAccess(true)
      sessionStorage.setItem('cx3_access', 'granted')
    } else if (Object.keys(router.query).length > 0) {
      // Only show denied if query is loaded and key is wrong/missing
      setHasAccess(false)
    }
  }, [router.query])

  if (!hasAccess && Object.keys(router.query).length > 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 className="mono" style={{ marginBottom: '12px' }}>🔒</h1>
          <p style={{ color: 'var(--muted)' }}>
            Access denied. This page is for event attendees only.
          </p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null // Loading state
  }

  return <>{children}</>
}
