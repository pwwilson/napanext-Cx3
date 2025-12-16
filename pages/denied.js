export default function Denied() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
      <img src="/sad-robot.png" alt="Access Denied" style={{ width: '220px', height: 'auto', objectFit: 'contain' }} />
      <h1 className="mono">Query Code Required</h1>
      <p className="card" style={{ maxWidth: '480px' }}>
        This page needs the event access code in the URL. If you have the code, add it to the link and try again.
      </p>
    </div>
  )
}
