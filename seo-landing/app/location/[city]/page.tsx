import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KEYWORDS } from '@/lib/keywords'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { ArrowRight, MapPin } from 'lucide-react'

type Props = { params: Promise<{ city: string }> }

export async function generateStaticParams() {
  return CITIES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return { title: 'Not Found' }
  return {
    title: `WhatsApp Marketing Services in ${city.name} | Waki by Aiclex`,
    description: `Join thousands of businesses in ${city.name} using Waki for WhatsApp marketing. Explore our 50+ services tailored for ${city.name}.`,
    alternates: { canonical: `https://waki.in/location/${citySlug}` },
  }
}

export default async function CityIndexPage({ params }: Props) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const GREEN = '#25d366'
  const DARK = '#0a2a1a'
  const DARK2 = '#0d3b26'
  
  const tierLabel = city.tier === 'metro' ? "Major Metro City" : city.tier === 'tier2' ? "Tier 2 City" : "Tier 3 City"
  const businessesCount = city.tier === 'metro' ? "50K+" : city.tier === 'tier2' ? "15K+" : "5K+"

  const sameStateCities = CITIES.filter(c => c.state === city.state && c.slug !== city.slug)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://waki.in' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://waki.in/locations' },
      { '@type': 'ListItem', position: 3, name: city.name, item: `https://waki.in/location/${citySlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main style={{ paddingTop: '70px', background: DARK, minHeight: '100vh' }}>
        
        <nav style={{ background: '#061510', borderBottom: '1px solid rgba(37,211,102,0.1)', padding: '12px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '14px' }}>
            <Link href="/" style={{ color: GREEN, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <Link href="/locations" style={{ color: GREEN, textDecoration: 'none' }}>Locations</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'white' }}>{city.name}</span>
          </div>
        </nav>

        <section style={{ background: 'linear-gradient(135deg, #061510, #064e3b)', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: GREEN }} />
              <span style={{ color: GREEN, fontSize: '13px', fontWeight: 600 }}>{tierLabel} — {city.state}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              WhatsApp Marketing Services in <span style={{ color: GREEN }}>{city.name}</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              {city.population.toLocaleString()} population, businesses in {city.name} use Waki for WhatsApp marketing. Explore services tailored for your growth.
            </p>
            <a href="https://app.waki.in/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: GREEN, color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
              Start Growing <ArrowRight style={{ width: '18px', height: '18px' }} />
            </a>
          </div>
        </section>

        <section style={{ padding: '30px 24px', background: '#061510', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: GREEN, fontSize: '24px', fontWeight: 800 }}>{businessesCount}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase' }}>Businesses Using Waki</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 800 }}>{city.state}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase' }}>State</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 800, textTransform: 'capitalize' }}>{city.tier}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase' }}>City Tier</div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 24px', background: DARK }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '32px', textAlign: 'center' }}>
              All WhatsApp Services Available in {city.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {KEYWORDS.map(keyword => (
                <Link key={keyword.slug} href={`/${keyword.slug}/${city.slug}`}
                  style={{ display: 'block', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,211,102,0.1)', color: GREEN, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                    {keyword.industry}
                  </div>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{keyword.displayName}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.5, marginBottom: '16px' }}>
                    {keyword.description.substring(0, 80)}...
                  </p>
                  <div style={{ color: GREEN, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Explore Service <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {sameStateCities.length > 0 && (
          <section style={{ background: DARK2, padding: '48px 24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Other Cities in {city.state}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {sameStateCities.map(c => (
                  <Link key={c.slug} href={`/location/${c.slug}`}
                    style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        
        <section style={{ background: 'linear-gradient(135deg, #064e3b, #061510)', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Ready to grow in {city.name}?</h2>
          <a href="https://app.waki.in/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: GREEN, color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
            Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
          </a>
        </section>

      </main>
      <Footer />
    </>
  )
}
