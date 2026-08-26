import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      text: 'Waki increased our WhatsApp campaign ROI by 40%. Our customers respond within minutes. The automation features saved us 20+ hours per week.',
      avatar: 'RK',
      bgColor: '#064e3b',
      name: 'Rajesh Kumar',
      role: 'CEO',
      company: 'ShopEasy',
      city: 'Mumbai'
    },
    {
      text: 'Student engagement doubled after using Waki. The AI chatbot handles 80% of admission queries automatically. Absolutely game-changing for education.',
      avatar: 'PS',
      bgColor: '#0d9488',
      name: 'Priya Sharma',
      role: 'Marketing Head',
      company: 'EduConnect',
      city: 'Bangalore'
    },
    {
      text: 'Appointment reminders via WhatsApp reduced no-shows by 60% at our clinics. Waki is the best investment we made for patient communication.',
      avatar: 'AS',
      bgColor: '#0f766e',
      name: 'Amit Singh',
      role: 'Founder',
      company: 'HealthFirst Clinics',
      city: 'Delhi'
    }
  ]

  return (
    <section id="testimonials" style={{ background: '#0d3b26', padding: '100px 24px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Loved by 10,000+ Businesses Across India</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Join thousands of businesses already growing with WhatsApp marketing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="test-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="#25d366" color="#25d366" />)}
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: '32px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{t.name}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{t.role}, {t.company}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .test-card:hover {
          border-color: #25d366 !important;
          transform: translateY(-5px);
        }
      `}</style>
    </section>
  )
}
