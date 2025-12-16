import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AccessGate({ children }) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [denied, setDenied] = useState(false)

  const hasCookieAccess = () => {
    if (typeof document === 'undefined') return false
    return document.cookie.split(';').some((c) => c.trim().startsWith('cx3_access=granted'))
  }

  useEffect(() => {
    // Don't gate the /feed page
    if (router.pathname === '/feed') {
      setHasAccess(true)
      return
    }

    // Wait for router to be ready before checking query params
    if (!router.isReady) return

    // Access key (can be customized via env var)
    const validKey = process.env.NEXT_PUBLIC_ACCESS_KEY || 'cx3party2024'
    
    // Check cookie (set by middleware) first
    if (hasCookieAccess()) {
      setHasAccess(true)
      return
    }

    // Check sessionStorage for legacy grant
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
      document.cookie = 'cx3_access=granted; path=/; max-age=43200; SameSite=Lax'
    } else {
      // No valid key - deny access
      setDenied(true)
    }
  }, [router.isReady, router.query, router.pathname])

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
        <img src="/sad-robot.png" alt="Access Denied" style={{ width: '240px', height: 'auto', objectFit: 'contain', marginBottom: '32px' }} />
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
