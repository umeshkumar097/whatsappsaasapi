import { Check, Zap } from 'lucide-react'

export default function CTA() {
  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #128c7e 0%, #064e3b 50%, #25d366 100%)', 
      padding: '100px 24px', 
      position: 'relative', 
      overflow: 'hidden',
      color: 'white',
      textAlign: 'center'
    }}>
      {/* Decorative Bubbles */}
      <div className="hide-mobile" style={{ position: 'absolute', top: '15%', left: '10%', background: 'white', color: '#064e3b', padding: '12px 20px', borderRadius: '20px 20px 20px 0', fontSize: '14px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(-5deg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Check size={14} color="#064e3b" /> Delivered to 10,000 contacts
      </div>
      <div className="hide-mobile" style={{ position: 'absolute', bottom: '20%', left: '15%', background: '#0a2a1a', color: 'white', padding: '12px 20px', borderRadius: '20px 20px 0 20px', fontSize: '14px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(5deg)' }}>
        98% Open Rate
      </div>
      <div className="hide-mobile" style={{ position: 'absolute', top: '25%', right: '12%', background: '#128c7e', color: 'white', padding: '12px 20px', borderRadius: '20px 20px 0 20px', fontSize: '14px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(8deg)' }}>
        6x Engagement
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
          <Zap size={15} /> Get Started Today — It&apos;s Free
        </div>
        <h2 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>
          Start Sending WhatsApp Messages Today
        </h2>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
          Join 10,000+ businesses. Free plan available — no credit card required.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://app.waki.in/signup" style={{ 
            padding: '16px 32px', 
            background: 'white', 
            color: '#064e3b', 
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 800, 
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}>
            Get Started Free →
          </a>
          <a href="/#how-it-works" style={{ 
            padding: '16px 32px', 
            background: 'transparent', 
            color: 'white', 
            border: '2px solid white',
            borderRadius: '8px', 
            fontSize: '18px', 
            fontWeight: 700, 
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}>
            See How It Works
          </a>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  )
}
