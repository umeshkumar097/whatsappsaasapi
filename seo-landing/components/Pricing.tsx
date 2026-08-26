import PricingClient from './PricingClient'
import { Sparkles } from 'lucide-react'

async function fetchPlans() {
  try {
    const res = await fetch('https://app.waki.in/api/admin/plans', {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (e) {
    return null
  }
}

export default async function Pricing() {
  const plans = await fetchPlans()
  return (
    <section id="pricing" style={{ background: 'white', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#15803d', padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>
            <Sparkles size={16} /> Simple, Transparent Pricing
          </div>
          <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#111', marginBottom: '16px', lineHeight: 1.2 }}>Choose Your <span style={{ background: 'linear-gradient(135deg, #128c7e, #25d366)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Perfect Plan</span></h2>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>Start free, upgrade when you're ready. No hidden fees. Cancel anytime.</p>
        </div>
        <PricingClient plans={plans} />
      </div>
    </section>
  )
}
