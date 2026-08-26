'use client'
import { useState } from 'react'
import { Send, Bot, BarChart3, Users, Workflow, Calendar, Check } from 'lucide-react'

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Send,
      title: 'Bulk Messaging',
      desc: 'Send to thousands instantly with smart scheduling',
      points: ['Personalized templates', 'Smart scheduling', 'Delivery optimization']
    },
    {
      icon: Bot,
      title: 'AI Chatbot',
      desc: '24/7 automated replies with GPT-powered responses',
      points: ['GPT-powered', 'Multi-language', 'Human handoff']
    },
    {
      icon: BarChart3,
      title: 'Campaign Analytics',
      desc: 'Real-time delivery, open and click tracking',
      points: ['Real-time dashboard', 'Click tracking', 'Export reports']
    },
    {
      icon: Users,
      title: 'Contact Management',
      desc: 'Import, segment and tag your contacts',
      points: ['CSV import', 'Smart segments', 'Custom tags']
    },
    {
      icon: Workflow,
      title: 'Automation Workflows',
      desc: 'Visual drag-drop flow builder',
      points: ['Visual builder', 'Trigger-based', 'Conditional logic']
    },
    {
      icon: Calendar,
      title: 'Campaign Scheduler',
      desc: 'Schedule campaigns for the perfect time',
      points: ['Time-zone aware', 'Drip campaigns', 'Recurring']
    }
  ]

  return (
    <section id="features" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #0a2a1a 100%)', padding: '100px 24px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Everything You Need to Scale on WhatsApp</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Powerful features designed to help you reach more customers and drive higher conversions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map((feature, i) => (
            <div 
              key={i}
              onClick={() => setActiveFeature(i)}
              style={{
                background: activeFeature === i ? 'rgba(37,211,102,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeFeature === i ? '#25d366' : 'rgba(255,255,255,0.1)'}`,
                padding: '32px',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: activeFeature === i ? 'translateY(-5px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeFeature !== i) {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFeature !== i) {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }
              }}
            >
              <div style={{ width: '48px', height: '48px', background: 'rgba(37,211,102,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <feature.icon size={24} color="#25d366" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '20px', lineHeight: 1.5 }}>{feature.desc}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {feature.points.map((point, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#25d366', borderRadius: '50%', padding: '2px' }}>
                      <Check size={12} color="white" />
                    </div>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
