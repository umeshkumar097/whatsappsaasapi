'use client'
import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function PricingClient({ plans }: { plans: any[] | null }) {
  const [isAnnual, setIsAnnual] = useState(false)

  if (!plans || plans.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Contact us for pricing</h3>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>We are currently updating our plans. Please reach out to our team.</p>
        <a href="mailto:support@waki.in" style={{ padding: '12px 24px', background: '#25d366', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Email Sales</a>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontWeight: !isAnnual ? 600 : 400, color: !isAnnual ? '#111' : '#6b7280' }}>Monthly</span>
        <button 
          onClick={() => setIsAnnual(!isAnnual)}
          style={{ width: '60px', height: '32px', borderRadius: '16px', background: isAnnual ? '#25d366' : '#e5e7eb', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', position: 'absolute', top: '4px', left: isAnnual ? '32px' : '4px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
        </button>
        <span style={{ fontWeight: isAnnual ? 600 : 400, color: isAnnual ? '#111' : '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Annual <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>Save 20%</span>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {plans.map((plan, i) => {
          const isMiddle = i === Math.floor(plans.length / 2)
          const price = isAnnual 
            ? (plan.annualPrice ?? (plan.monthlyPrice * 10)) 
            : plan.monthlyPrice
            
          return (
            <div key={plan.id} style={{
              background: 'white',
              borderRadius: '24px',
              border: `2px solid ${isMiddle ? '#25d366' : '#e5e7eb'}`,
              padding: '40px 32px',
              position: 'relative',
              boxShadow: isMiddle ? '0 20px 40px rgba(37,211,102,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
              transform: isMiddle ? 'scale(1.05)' : 'none',
              zIndex: isMiddle ? 10 : 1,
            }}>
              {isMiddle && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#25d366', color: 'white', padding: '4px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', minHeight: '40px' }}>{plan.description}</p>
              
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#111' }}>₹{price}</span>
                <span style={{ color: '#6b7280' }}>/{isAnnual ? 'yr' : 'mo'}</span>
              </div>

              <a href="https://app.waki.in/signup" style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px',
                borderRadius: '8px',
                background: plan.isFree ? 'white' : (plan.buttonColor || '#25d366'),
                color: plan.isFree ? '#111' : 'white',
                border: plan.isFree ? '2px solid #e5e7eb' : 'none',
                fontWeight: 700,
                textDecoration: 'none',
                marginBottom: '32px',
                transition: 'all 0.2s',
              }}>
                {plan.isFree ? 'Get Started Free' : 'Get Started'}
              </a>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.features?.map((f: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {f.included ? (
                      <Check size={20} color="#25d366" style={{ flexShrink: 0 }} />
                    ) : (
                      <X size={20} color="#9ca3af" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '14px', color: f.included ? '#374151' : '#9ca3af' }}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      <div style={{ marginTop: '60px', background: '#f8fafc', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Need an Enterprise Custom Solution?</h4>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>Contact our sales team for custom volume pricing and dedicated support.</p>
        <a href="mailto:sales@waki.in" style={{ color: '#25d366', fontWeight: 600, textDecoration: 'none' }}>Contact Sales &rarr;</a>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] > div {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
