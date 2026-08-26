import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import UseCases from '@/components/UseCases'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Waki — #1 WhatsApp Marketing Platform in India',
  description: "Send bulk WhatsApp messages, build AI chatbots, automate campaigns, and grow your business with Waki — India's most trusted WhatsApp Marketing Platform by Aiclex.",
  alternates: { canonical: 'https://waki.in' },
  openGraph: {
    title: 'Waki — #1 WhatsApp Marketing Platform in India',
    description: "India's leading WhatsApp Marketing Platform. Free plan available.",
    url: 'https://waki.in',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
