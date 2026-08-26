import Link from 'next/link'
import { Twitter, Linkedin, Github, Mail, MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#061510', color: 'white', borderTop: '1px solid rgba(37,211,102,0.3)', padding: '60px 24px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '20px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Waki</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#25d366', letterSpacing: '0.1em', textTransform: 'uppercase' }}>by Aiclex</span>
              </div>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>India's most powerful WhatsApp Marketing Platform</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><Linkedin size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><Github size={20} /></a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><Mail size={20} /></a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Product</h4>
            <Link href="/#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Bulk Messaging</Link>
            <Link href="/#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>AI Chatbot</Link>
            <Link href="/#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Analytics</Link>
            <Link href="/#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Automation</Link>
            <Link href="/#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Team Inbox</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Company</h4>
            <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>About</Link>
            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Contact</Link>
            <Link href="/careers" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Careers</Link>
            <Link href="/press-kit" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Press</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Resources</h4>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Blog</Link>
            <Link href="/guides" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Guides</Link>
            <Link href="/locations" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>All Locations</Link>
            <Link href="/services" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>All Services</Link>
            <a href="https://app.waki.in/api-docs" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>API Docs</a>
            <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>About Us</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Legal</h4>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Terms</Link>
            <Link href="/cookie-policy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Cookie Policy</Link>
            <Link href="/data-deletion" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Data Deletion</Link>
          </div>

        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>&copy; 2025 Waki by Aiclex Solutions Private Limited. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
