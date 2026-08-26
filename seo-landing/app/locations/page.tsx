import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KEYWORDS } from '@/lib/keywords'
import { CITIES } from '@/lib/cities'
import { ArrowRight, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'WhatsApp Marketing Services Across India | Waki',
  description: 'Find WhatsApp marketing services in 200+ Indian cities.',
  alternates: { canonical: 'https://waki.in/locations' },
}

export default function LocationsIndexPage() {
  const GREEN = '#25d366'
  const DARK = '#0a2a1a'
  const DARK2 = '#0d3b26'

  // Group by state
  const citiesByState = CITIES.reduce((acc, city) => {
    if (!acc[city.state]) acc[city.state] = []
    acc[city.state].push(city)
    return acc
  }, {} as Record<string, typeof CITIES>)

  const sortedStates = Object.keys(citiesByState).sort()

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CITIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://waki.in/location/${c.slug}`,
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
              WhatsApp Marketing Available <span style={{ color: GREEN }}>Across India</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Find your city below to explore localized WhatsApp marketing solutions.
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px', background: DARK }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {sortedStates.map(state => (
              <div key={state} style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
                  {state}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {citiesByState[state].sort((a,b) => a.name.localeCompare(b.name)).map(city => (
                    <Link key={city.slug} href={`/location/${city.slug}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'rgba(255,255,255,0.9)', fontSize: '15px', transition: 'all 0.2s' }}>
                      <span>{city.name}</span>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', background: city.tier === 'metro' ? 'rgba(37,211,102,0.15)' : 'rgba(255,255,255,0.08)', color: city.tier === 'metro' ? GREEN : 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                        {city.tier}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: DARK2, padding: '60px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '24px' }}>Explore by Service</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {KEYWORDS.map(k => (
                <Link key={k.slug} href={`/${k.slug}`}
                  style={{ padding: '8px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {k.displayName}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '32px' }}>
              <Link href="/services" style={{ color: GREEN, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                View All Services <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
