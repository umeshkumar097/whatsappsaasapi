import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "WhatsApp Marketing Guides — Waki",
  description: "Step-by-step guides for WhatsApp Business API setup, Meta Business Verification, and growing your business with WhatsApp marketing.",
  alternates: { canonical: "https://waki.in/guides" },
}

const guides = [
  {
    slug: "meta-business-verification",
    title: "How to Complete Meta Business Verification",
    desc: "Step-by-step guide to verify your Meta Business Account for WhatsApp API access in India. Accepted documents, rejection reasons, and what to expect.",
    time: "5 min read",
    badge: "Essential",
  },
]

export default function GuidesIndex() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "70px", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#fff", backgroundColor: "#0a2a1a" }}>
        <section style={{ background: "linear-gradient(135deg, #0a2a1a, #064e3b, #0a2a1a)", padding: "64px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, marginBottom: "16px" }}>
            WhatsApp <span style={{ color: "#25d366" }}>Marketing Guides</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", maxWidth: "560px", margin: "0 auto" }}>
            Step-by-step guides to set up WhatsApp Business API, get Meta verified, and grow your business on WhatsApp.
          </p>
        </section>

        <section style={{ padding: "64px 24px", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "24px" }}>
            {guides.map((g) => (
              <Link key={g.slug} href={"/guides/" + g.slug} style={{ textDecoration: "none" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "16px", padding: "32px", display: "flex", gap: "24px", cursor: "pointer", transition: "border-color 0.2s" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ background: "rgba(37,211,102,0.2)", color: "#25d366", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>{g.badge}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{g.time}</span>
                    </div>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{g.title}</h2>
                    <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{g.desc}</p>
                    <div style={{ marginTop: "16px", color: "#25d366", fontWeight: 600, fontSize: "14px" }}>Read Guide &rarr;</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "linear-gradient(135deg, #128c7e, #25d366)", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#071a0f", marginBottom: "16px" }}>Start Sending WhatsApp Messages Today</h2>
          <Link href="https://app.waki.in" style={{ background: "#071a0f", color: "#25d366", padding: "16px 36px", borderRadius: "12px", fontWeight: 800, fontSize: "18px", textDecoration: "none", display: "inline-block" }}>Get Started Free &rarr;</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
