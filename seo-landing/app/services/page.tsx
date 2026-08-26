import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KEYWORDS } from '@/lib/keywords'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'WhatsApp Marketing Services by Waki | Complete List',
  description: 'Explore the complete list of WhatsApp marketing services offered by Waki across India.',
  alternates: { canonical: 'https://waki.in/services' },
}

export default function ServicesIndexPage() {
  const GREEN = '#25d366'
  const DARK = '#0a2a1a'
  const DARK2 = '#0d3b26'

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: KEYWORDS.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://waki.in/${k.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Header />
      <main style={{ paddingTop: '70px', background: DARK, minHeight: '100vh' }}>
        
        <section style={{ background: 'linear-gradient(135deg, #061510, #064e3b)', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              Complete WhatsApp Marketing <span style={{ color: GREEN }}>Services</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Discover out-of-the-box WhatsApp services designed for growth in India.
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px', background: DARK }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {KEYWORDS.map(keyword => (
                <Link key={keyword.slug} href={`/${keyword.slug}`}
                  style={{ display: 'block', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,211,102,0.1)', color: GREEN, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                    {keyword.industry}
                  </div>
                  <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{keyword.displayName}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                    {keyword.description}
                  </p>
                  <div style={{ color: GREEN, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View All Cities <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: DARK2, padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Find Services in Your City</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>We are available in 200+ cities across India.</p>
          <Link href="/locations" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
            Browse Locations <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
