import { Check, ShoppingBag, Building2, HeartPulse, GraduationCap, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Industry = { icon: LucideIcon; name: string; cases: string[] }

export default function UseCases() {
  const industries: Industry[] = [
    { icon: ShoppingBag, name: 'E-Commerce', cases: ['Order confirmation & tracking', 'Abandoned cart recovery', 'Flash sale promotions'] },
    { icon: Building2, name: 'Real Estate', cases: ['Property listing alerts', 'Site visit scheduling', 'Lead follow-up automation'] },
    { icon: HeartPulse, name: 'Healthcare', cases: ['Appointment reminders', 'Lab report delivery', 'Health tips & follow-ups'] },
    { icon: GraduationCap, name: 'Education', cases: ['Course updates & reminders', 'Fee payment alerts', 'Exam schedule notifications'] },
    { icon: Utensils, name: 'Restaurants', cases: ['Daily specials & menus', 'Reservation confirmations', 'Customer feedback collection'] },
  ]

  return (
    <section id="use-cases" style={{ background: '#0a2a1a', padding: '100px 24px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Built for Every Industry</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Discover how different businesses use Waki to drive engagement and sales.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {industries.map((ind, i) => (
            <div key={i} className="use-case-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ind.icon size={26} color="#25d366" />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>{ind.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ind.cases.map((c, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Check size={18} color="#25d366" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="https://app.waki.in/signup" style={{ display: 'inline-block', padding: '16px 32px', borderRadius: '8px', background: '#25d366', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 700 }}>
            Explore All Industries
          </a>
        </div>
      </div>
      <style>{`
        .use-case-card:hover { border-color: #25d366 !important; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(37,211,102,0.1); }
      `}</style>
    </section>
  )
}

