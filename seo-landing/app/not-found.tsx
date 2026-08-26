import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0a2a1a',
      color: 'white',
      textAlign: 'center',
      padding: '24px'
    }}>
      <h1 style={{ fontSize: '120px', fontWeight: 900, color: '#25d366', lineHeight: 1, marginBottom: '24px' }}>404</h1>
      <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>Page Not Found</h2>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', marginBottom: '40px' }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{
        padding: '16px 32px',
        background: '#25d366',
        color: 'white',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(37,211,102,0.4)'
      }}>
        Go Home
      </Link>
    </div>
  )
}
