import { Link, Users, MessageSquare, BarChart3 } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Link,
      title: 'Connect Your API',
      desc: 'Link your Meta WhatsApp Business API in minutes with our guided setup wizard.',
      num: 1
    },
    {
      icon: Users,
      title: 'Import Contacts',
      desc: 'Upload your contacts via CSV or sync directly from your CRM system.',
      num: 2
    },
    {
      icon: MessageSquare,
      title: 'Create Campaign',
      desc: 'Design beautiful message templates with images, buttons, and quick replies.',
      num: 3
    },
    {
      icon: BarChart3,
      title: 'Send & Analyze',
      desc: 'Launch your campaign and track delivery, opens, and replies in real-time.',
      num: 4
    }
  ]

  return (
    <section id="how-it-works" style={{ background: '#0d3b26', padding: '100px 24px', color: 'white', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Get Started in 4 Simple Steps</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            From setup to sending your first campaign, it only takes a few minutes.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          <div className="line-connector" style={{ position: 'absolute', top: '24px', left: '12%', right: '12%', height: '2px', borderTop: '2px dashed rgba(37,211,102,0.3)', zIndex: 0 }}></div>
          
          {steps.map((step, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#25d366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '24px', boxShadow: '0 0 0 8px #0d3b26' }}>
                {step.num}
              </div>
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <step.icon size={32} color="#25d366" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .line-connector { display: none !important; }
        }
      `}</style>
    </section>
  )
}
