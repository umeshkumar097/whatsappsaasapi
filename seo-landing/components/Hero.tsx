'use client'
import { useState, useEffect } from 'react'
import { Send, Bot, BarChart3, Users, Workflow, MessageSquare, CheckCircle2 } from 'lucide-react'
import Head from 'next/head'

export default function Hero() {
  const words = ['with WhatsApp Marketing', 'with AI Chatbot', 'with Bulk Messaging', 'with Automation']
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <>
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Waki",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          })
        }}
      />
    </Head>
    <section style={{ 
      background: 'linear-gradient(135deg, #061510 0%, #0a2a1a 50%, #064e3b 100%)', 
      paddingTop: '120px', 
      paddingBottom: '80px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Content */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.1)', color: '#25d366', padding: '6px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, marginBottom: '24px', border: '1px solid rgba(37,211,102,0.2)' }}>
            <CheckCircle2 size={16} color="#25d366" /> Official Meta WhatsApp Business API
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
            Grow Your Business <br/>
            <span style={{ color: '#25d366', display: 'inline-block', minHeight: '60px' }}>
              {words[currentWord]}<span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '40px' }}>
            Waki by Aiclex is the ultimate platform to scale your customer engagement using the official Meta WhatsApp Business API. Send campaigns, automate replies, and drive sales effortlessly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: Send, text: 'Bulk Messaging' },
              { icon: Bot, text: 'AI Chatbot' },
              { icon: BarChart3, text: 'Real-Time Analytics' },
              { icon: Users, text: 'Contact Management' },
              { icon: Workflow, text: 'Automation Flows' },
              { icon: MessageSquare, text: 'Team Inbox' },
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(37,211,102,0.1)', padding: '6px', borderRadius: '6px' }}>
                  <feature.icon size={16} color="#25d366" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{feature.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <a href="https://app.waki.in/signup" style={{ padding: '14px 28px', borderRadius: '8px', background: '#25d366', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 14px rgba(37,211,102,0.4)', transition: 'transform 0.2s' }}>
              Get Started Free →
            </a>
            <a href="https://app.waki.in/login" style={{ padding: '14px 28px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}>
              Sign In
            </a>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>
            No credit card required · Free plan available · Setup in 5 minutes
          </p>
        </div>

        {/* Right Content */}
        <div style={{ position: 'relative' }}>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { title: '10,000+', subtitle: 'Businesses' },
              { title: '98%', subtitle: 'Delivery Rate' },
              { title: '6x', subtitle: 'More Engagement' }
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', flex: 1, minWidth: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#25d366' }}>{stat.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{stat.subtitle}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0a1014', borderRadius: '24px', padding: '16px', border: '4px solid #1f2c34', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ background: '#202c33', padding: '12px 16px', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #111b21' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>W</div>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Waki Business</div>
                <div style={{ color: '#8696a0', fontSize: '12px' }}>online</div>
              </div>
            </div>
            <div style={{ background: '#0b141a', padding: '20px 16px', minHeight: '250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#202c33', padding: '8px 12px', borderRadius: '0 8px 8px 8px', color: 'white', fontSize: '14px', maxWidth: '80%', alignSelf: 'flex-start' }}>
                Hi! Welcome to Waki. How can we help you scale today?
              </div>
              <div style={{ background: '#005c4b', padding: '8px 12px', borderRadius: '8px 0 8px 8px', color: 'white', fontSize: '14px', maxWidth: '80%', alignSelf: 'flex-end' }}>
                I want to automate my customer support.
              </div>
              <div style={{ background: '#202c33', padding: '8px 12px', borderRadius: '0 8px 8px 8px', color: 'white', fontSize: '14px', maxWidth: '80%', alignSelf: 'flex-start' }}>
                Perfect! Our AI Chatbot can handle 80% of queries instantly. Would you like a demo?
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Trusted by Industries</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['E-Commerce', 'Real Estate', 'Healthcare', 'Education', 'Restaurants'].map((trust, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  {trust}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </section>
    </>
  )
}
