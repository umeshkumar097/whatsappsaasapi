import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { getPageContent } from '@/lib/content'
import { CheckCircle, MessageSquare, ArrowRight, Star, Users, TrendingUp, Zap, Bot, Send, Workflow, BarChart3, Phone } from 'lucide-react'

type Props = {
  params: Promise<{ keyword: string; city: string }>
}

export async function generateStaticParams() {
  const params = []
  for (const keyword of KEYWORDS) {
    for (const city of CITIES) {
      params.push({ keyword: keyword.slug, city: city.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword: keywordSlug, city: citySlug } = await params
  const keyword = getKeywordBySlug(keywordSlug)
  const city = getCityBySlug(citySlug)
  if (!keyword || !city) return { title: 'Not Found' }

  const title = `Best ${keyword.title} in ${city.name} | Waki by Aiclex`
  const description = `Looking for ${keyword.displayName} in ${city.name}? Waki provides the most powerful ${keyword.title} for businesses in ${city.name}, ${city.state}. Start free today — no credit card required.`

  return {
    title,
    description,
    keywords: [
      `${keyword.displayName} ${city.name}`,
      `${keyword.displayName} ${city.state}`,
      `WhatsApp marketing ${city.name}`,
      `WhatsApp business ${city.name}`,
      `best WhatsApp tool ${city.name}`,
    ],
    alternates: { canonical: `https://waki.in/${keywordSlug}/${citySlug}` },
    openGraph: {
      title,
      description,
      url: `https://waki.in/${keywordSlug}/${citySlug}`,
      type: 'website',
    },
  }
}

export default async function CityKeywordPage({ params }: Props) {
  const { keyword: keywordSlug, city: citySlug } = await params
  const keyword = getKeywordBySlug(keywordSlug)
  const city = getCityBySlug(citySlug)

  if (!keyword || !city) notFound()

  const keywordIndex = KEYWORDS.findIndex(k => k.slug === keywordSlug)
  const cityIndex = CITIES.findIndex(c => c.slug === citySlug)
  const content = getPageContent(keyword!, city!, keywordIndex, cityIndex)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Waki ${keyword!.displayName}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: `${keyword!.description} Available for businesses in ${city!.name}, ${city!.state}.`,
    url: `https://waki.in/${keywordSlug}/${citySlug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free plan available' },
    provider: { '@type': 'Organization', name: 'Aiclex Solutions Private Limited', url: 'https://waki.in' },
    areaServed: { '@type': 'City', name: city!.name, containedInPlace: { '@type': 'State', name: city!.state } },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://waki.in' },
      { '@type': 'ListItem', position: 2, name: keyword!.displayName, item: `https://waki.in/${keywordSlug}` },
      { '@type': 'ListItem', position: 3, name: city!.name, item: `https://waki.in/${keywordSlug}/${citySlug}` },
    ],
  }

  const relatedKeywords = KEYWORDS.filter(k => k.slug !== keyword!.slug).slice(0, 6)
  const nearbyCities = CITIES.filter(c => c.state === city!.state && c.slug !== city!.slug).slice(0, 6)

  const GREEN = '#25d366'
  const DARK = '#0a2a1a'
  const DARK2 = '#0d3b26'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main style={{ paddingTop: '70px' }}>

        {/* Breadcrumb */}
        <nav style={{ background: '#061510', borderBottom: '1px solid rgba(37,211,102,0.1)', padding: '12px 24px' }} aria-label="Breadcrumb">
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
            <Link href="/" style={{ color: GREEN, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{keyword!.displayName}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'white', fontWeight: 600 }}>{city!.name}</span>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ background: `linear-gradient(135deg, #061510 0%, ${DARK} 50%, #064e3b 100%)`, padding: '80px 24px 60px', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '100px', padding: '6px 18px', marginBottom: '28px' }}>
              <MessageSquare style={{ width: '14px', height: '14px', color: GREEN }} />
              <span style={{ color: GREEN, fontSize: '13px', fontWeight: 600 }}>Trusted by {content.stats.businesses} businesses in {city!.state}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.5px' }}>
              Best {keyword!.title} in{' '}
              <span style={{ color: GREEN }}>{city!.name}</span>
            </h1>

            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.72)', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.75 }}>
              {content.heroText}
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              <a href="https://app.waki.in/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: GREEN, color: '#fff', padding: '14px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '17px', textDecoration: 'none', boxShadow: '0 4px 24px rgba(37,211,102,0.4)' }}>
                Start Free in {city!.name} <ArrowRight style={{ width: '18px', height: '18px' }} />
              </a>
              <a href="https://app.waki.in/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                Sign In
              </a>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No credit card required · Free plan available · Setup in 5 minutes</p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: DARK2, padding: '56px 24px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { value: content.stats.businesses, label: `Businesses Using Waki in ${city!.state}`, Icon: Users },
              { value: content.stats.deliveryRate, label: 'WhatsApp Message Delivery Rate', Icon: TrendingUp },
              { value: content.stats.engagement, label: 'More Engagement vs Email', Icon: Zap },
            ].map(({ value, label, Icon }, i) => (
              <div key={i} style={{ padding: '28px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(37,211,102,0.12)' }}>
                <Icon style={{ width: '32px', height: '32px', color: GREEN, margin: '0 auto 14px' }} />
                <div style={{ fontSize: '40px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ background: DARK, padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: 'white', marginBottom: '56px' }}>
              Why {city!.name} Businesses Choose <span style={{ color: GREEN }}>Waki</span> for {keyword!.displayName}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                { Icon: Send, title: 'Bulk Messaging', desc: `Send personalized WhatsApp messages to all your ${city!.name} customers at once with smart scheduling and delivery optimization.` },
                { Icon: Bot, title: 'AI Chatbot 24/7', desc: `Deploy an intelligent AI chatbot that handles customer queries from ${city!.name} automatically, day and night.` },
                { Icon: BarChart3, title: 'Real-Time Analytics', desc: `Track delivery rates, open rates, and campaign ROI for every message sent to your ${city!.name} customer base.` },
                { Icon: Users, title: 'Contact Management', desc: `Import, organize, and segment your ${city!.name} contacts for targeted, personalized WhatsApp campaigns.` },
                { Icon: Workflow, title: 'Automation Flows', desc: `Build multi-step WhatsApp automation workflows for your ${city!.name} business without any coding.` },
                { Icon: Phone, title: 'Shared Team Inbox', desc: `Manage all incoming WhatsApp conversations from ${city!.name} customers in one shared team inbox.` },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(37,211,102,0.08)', borderRadius: '16px', padding: '28px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37,211,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <Icon style={{ width: '26px', height: '26px', color: GREEN }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: DARK2, padding: '80px 24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'white', marginBottom: '48px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.faqs.map((faq, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '24px 28px', border: '1px solid rgba(37,211,102,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '10px', display: 'flex', gap: '12px' }}>
                    <span style={{ color: GREEN, flexShrink: 0, fontWeight: 800 }}>Q{i + 1}.</span>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginLeft: '28px' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section style={{ background: DARK, padding: '80px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800, color: 'white', marginBottom: '40px' }}>
              What Our {city!.name} Customers Say
            </h2>
            <div style={{ background: 'rgba(37,211,102,0.06)', borderRadius: '24px', padding: '44px 40px', border: '1px solid rgba(37,211,102,0.2)' }}>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} style={{ width: '20px', height: '20px', fill: GREEN, color: GREEN }} />)}
              </div>
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, marginBottom: '28px', fontStyle: 'italic' }}>
                &ldquo;{content.testimonial.text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #128c7e, #25d366)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                  {content.testimonial.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>{content.testimonial.name}</div>
                  <div style={{ color: GREEN, fontSize: '13px', marginTop: '2px' }}>{content.testimonial.role} — {content.testimonial.company}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2px' }}>{city!.name}, {city!.state}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section style={{ background: '#061510', padding: '60px 24px', borderTop: '1px solid rgba(37,211,102,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {nearbyCities.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                  {keyword!.displayName} in Other {city!.state} Cities
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {nearbyCities.map(c => (
                    <Link key={c.slug} href={`/${keyword!.slug}/${c.slug}`}
                      style={{ padding: '7px 18px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}>
                      {keyword!.displayName} in {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                Related WhatsApp Services in {city!.name}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {relatedKeywords.map(k => (
                  <Link key={k.slug} href={`/${k.slug}/${city!.slug}`}
                    style={{ padding: '7px 18px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {k.displayName} in {city!.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ background: 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
              Ready to Start {keyword!.displayName} in {city!.name}?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '36px', lineHeight: 1.6 }}>
              Join thousands of {city!.name} businesses already using Waki. Free plan available — no credit card required.
            </p>
            <a href="https://app.waki.in/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', color: '#128c7e', padding: '16px 44px', borderRadius: '14px', fontWeight: 800, fontSize: '18px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}>
              Get Started Free <ArrowRight style={{ width: '20px', height: '20px' }} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
