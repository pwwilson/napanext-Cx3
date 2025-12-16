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
        <h3>Thank you for attending!</h3>
        <p>We're looking forward to seeing you at the next Napa Next Event 1/22 at the Napa Valley Car Club!</p>
      </div>
    </div>
  )
}
