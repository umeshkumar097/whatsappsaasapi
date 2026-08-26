'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Menu, X, ArrowRight } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Use Cases', href: '/#use-cases' },
    { name: 'Pricing', href: '/#pricing' },
  ]

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: isScrolled ? 'rgba(6,21,10,0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(37,211,102,0.1)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Waki</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#25d366', letterSpacing: '0.1em', textTransform: 'uppercase' }}>by Aiclex</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#25d366')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >{link.name}</a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden-mobile">
          <a href="https://app.waki.in/login" style={{ padding: '9px 20px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>Sign In</a>
          <a href="https://app.waki.in/signup" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '8px', background: '#25d366', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, boxShadow: '0 2px 12px rgba(37,211,102,0.3)' }}>
            Get Started Free <ArrowRight style={{ width: '14px', height: '14px' }} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }} className="show-mobile">
          {isMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ background: '#061510', borderTop: '1px solid rgba(37,211,102,0.1)', padding: '16px 24px 24px' }}>
          {navLinks.map(link => (
            <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)}
              style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 0', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {link.name}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <a href="https://app.waki.in/login" style={{ padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>Sign In</a>
            <a href="https://app.waki.in/signup" style={{ padding: '12px', borderRadius: '8px', background: '#25d366', color: 'white', textDecoration: 'none', textAlign: 'center', fontWeight: 700 }}>Get Started Free</a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </header>
  )
}
