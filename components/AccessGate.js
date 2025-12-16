import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AccessGate({ children }) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [denied, setDenied] = useState(false)

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
      // Query is loaded and key is wrong/missing
      setDenied(true)
    }
  }, [router.query])

  if (denied) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <img src="/sad-robot.png" alt="Access Denied" style={{ width: '120px', height: '120px', marginBottom: '24px' }} />
        <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--white)', textAlign: 'center' }}>
          Query Code Needed - Access Denied
        </p>
      </div>
    )
  }

  if (!hasAccess) {
    return null // Loading state
  }

  return <>{children}</>
}
