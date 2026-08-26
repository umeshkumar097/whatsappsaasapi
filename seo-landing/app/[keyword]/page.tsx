import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords'
import { CITIES } from '@/lib/cities'
import { ArrowRight, MapPin, Search } from 'lucide-react'

type Props = { params: Promise<{ keyword: string }> }

export async function generateStaticParams() {
  return KEYWORDS.map(k => ({ keyword: k.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword: keywordSlug } = await params
  const keyword = getKeywordBySlug(keywordSlug)
  if (!keyword) return { title: 'Not Found' }
  return {
    title: `${keyword.title} in India | Waki by Aiclex`,
    description: `Find the best ${keyword.displayName} solution for your city in India. Waki serves 200+ cities across India. Select your city to learn more.`,
    alternates: { canonical: `https://waki.in/${keywordSlug}` },
  }
}

export default async function KeywordIndexPage({ params }: Props) {
  const { keyword: keywordSlug } = await params
  const keyword = getKeywordBySlug(keywordSlug)
  if (!keyword) notFound()

  // Group cities by tier
  const metros = CITIES.filter(c => c.tier === 'metro')
  const tier2 = CITIES.filter(c => c.tier === 'tier2')
  const tier3 = CITIES.filter(c => c.tier === 'tier3')

  const GREEN = '#25d366'
  const DARK = '#0a2a1a'
  const DARK2 = '#0d3b26'

  // JSON-LD breadcrumb
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://waki.in' },
      { '@type': 'ListItem', position: 2, name: keyword!.displayName, item: `https://waki.in/${keywordSlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main style={{ paddingTop: '70px', background: DARK, minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <nav style={{ background: '#061510', borderBottom: '1px solid rgba(37,211,102,0.1)', padding: '12px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', fontSize: '14px' }}>
            <Link href="/" style={{ color: GREEN, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'white' }}>{keyword!.displayName}</span>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #061510, #064e3b)', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: GREEN }} />
              <span style={{ color: GREEN, fontSize: '13px', fontWeight: 600 }}>Available in 200+ Cities Across India</span>
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              {keyword!.title} in <span style={{ color: GREEN }}>India</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              {keyword!.description} Waki serves businesses across 200+ Indian cities. Select your city below.
            </p>
            <a href="https://app.waki.in/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: GREEN, color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
              Get Started Free <ArrowRight style={{ width: '18px', height: '18px' }} />
            </a>
          </div>
        </section>

        {/* Metro Cities */}
        <section style={{ padding: '60px 24px', background: DARK }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Metro Cities
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Top metro cities with highest business density</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '48px' }}>
              {metros.map(city => (
                <Link key={city.slug} href={`/${keyword!.slug}/${city.slug}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', textDecoration: 'none', color: 'white', fontWeight: 600, fontSize: '15px', transition: 'all 0.2s' }}>
                  <span>{city.name}</span>
                  <ArrowRight style={{ width: '14px', height: '14px', color: GREEN }} />
                </Link>
              ))}
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Tier 2 Cities</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Growing cities with emerging business ecosystems</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '48px' }}>
              {tier2.map(city => (
                <Link key={city.slug} href={`/${keyword!.slug}/${city.slug}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '14px', transition: 'all 0.2s' }}>
                  <span>{city.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{city.state.slice(0,2)}</span>
                </Link>
              ))}
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Tier 3 Cities</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Emerging cities with fast-growing businesses</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
              {tier3.map(city => (
                <Link key={city.slug} href={`/${keyword!.slug}/${city.slug}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  <span>{city.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{city.state.slice(0,2)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related Keywords */}
        <section style={{ background: DARK2, padding: '48px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Related WhatsApp Services</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {KEYWORDS.filter(k => k.slug !== keyword!.slug).slice(0, 12).map(k => (
                <Link key={k.slug} href={`/${k.slug}`}
                  style={{ padding: '7px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {k.displayName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
