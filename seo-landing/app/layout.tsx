import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Waki — WhatsApp Marketing Platform by Aiclex',
    template: '%s | Waki by Aiclex',
  },
  description: "Waki is India's leading WhatsApp marketing platform. Send bulk messages, build AI chatbots, automate campaigns, and grow your business with Meta's official WhatsApp Business API.",
  keywords: ['WhatsApp marketing', 'bulk WhatsApp messaging', 'WhatsApp Business API', 'WhatsApp chatbot', 'WhatsApp automation India'],
  authors: [{ name: 'Aiclex Solutions Private Limited' }],
  creator: 'Waki by Aiclex',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://waki.in',
    siteName: 'Waki by Aiclex',
    title: 'Waki — WhatsApp Marketing Platform',
    description: "India's leading WhatsApp marketing platform. Bulk messaging, AI chatbot, automation, and analytics.",
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#0a2a1a', color: 'white' }}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G4D9PHCH35"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G4D9PHCH35');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}

