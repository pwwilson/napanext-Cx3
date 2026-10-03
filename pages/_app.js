import '../styles/globals.css'
import Header from '../components/Header'
import AccessGate from '../components/AccessGate'
import { useRouter } from 'next/router'
import { Analytics } from '@vercel/analytics/next'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const showHeader = router?.pathname !== '/feed'

  return (
    <>
      <AccessGate>
        {showHeader && <Header />}
        <Component {...pageProps} />
      </AccessGate>
      <Analytics />
    </>
  )
}
