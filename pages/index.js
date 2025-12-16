import Link from 'next/link'

export default function Home(){
  return (
    <div className="container">
      <h1 className="mono">Cx3</h1>
      <p className="card">Compliments · Confessions · Captions</p>

      <div className="card">
        <h2>Get started</h2>
        <ul>
          <li><Link href="/compliments">/compliment</Link></li>
          <li><Link href="/confessions">/confession</Link></li>
          <li><Link href="/captions">/caption</Link></li>
          <li><Link href="/display">/display (big-screen)</Link></li>
        </ul>
      </div>

      <div className="card">
        <h3>Deploy</h3>
        <p>Deploy to Vercel or Cloudflare Pages. For quick local testing run <code>npm run dev</code>.</p>
      </div>
    </div>
  )
}
