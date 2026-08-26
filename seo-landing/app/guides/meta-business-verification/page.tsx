import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "How to Complete Meta Business Verification for WhatsApp API | Waki",
  description: "Complete step-by-step guide to Meta Business Verification for WhatsApp Business API in India. Documents needed, common mistakes, and what happens after approval.",
  keywords: ["Meta business verification India", "Facebook business verification guide", "WhatsApp API verification steps", "WhatsApp business API India"],
  openGraph: {
    title: "Meta Business Verification Guide — Waki",
    description: "Step-by-step guide to verify your Meta Business Account and unlock WhatsApp Business API in India.",
    url: "https://waki.in/guides/meta-business-verification",
    type: "article",
  },
  alternates: { canonical: "https://waki.in/guides/meta-business-verification" },
}

const steps = [
  { num: "01", title: "Go to Meta Business Manager", detail: "Open business.facebook.com and log in with your Facebook account that owns your Business Manager.", tip: "Use a desktop browser for the best experience." },
  { num: "02", title: "Open Settings → Business Info", detail: "In the left sidebar click Settings, then Business Info. Scroll down to find the Business Verification section with a blue Start Verification button.", tip: "If you do not see the button, you may not have admin access." },
  { num: "03", title: "Enter Your Legal Business Details", detail: "Fill in your legal business name exactly as it appears on government-issued documents. Enter your registered address, business phone number, and website URL.", tip: "Name must match 100% with your document — even minor differences cause rejection." },
  { num: "04", title: "Choose Verification Method", detail: "Meta offers: Phone call, SMS, Email to business domain, or Document upload. For most Indian businesses, Document Upload is the most reliable.", tip: "Domain email like info@yourbusiness.com is fastest if available." },
  { num: "05", title: "Upload Supporting Documents", detail: "Upload 1-2 official documents: GST Certificate, Udyam/MSME Registration, Utility Bill (last 3 months), Bank Statement, or Company Registration Certificate.", tip: "Upload clear, high-resolution documents in PDF or JPG format." },
  { num: "06", title: "Submit Verification Request", detail: "Review all information, then click Submit. Meta will review your documents and email you the result. This typically takes 2-5 business days.", tip: "Track status anytime in Settings → Business Info." },
  { num: "07", title: "After Approval — Go Live on Waki", detail: "Once Meta verifies your business, your Waki channel automatically upgrades from Sandbox to Live. You can now send messages to all numbers without restrictions.", tip: "Waki auto-detects verification and triggers Go Live — no manual action needed!" },
]

const docs = [
  { name: "GST Certificate", desc: "Most widely accepted — shows legal business name and address", badge: "Recommended" },
  { name: "Udyam / MSME Registration", desc: "Government MSME portal registration certificate", badge: "Recommended" },
  { name: "Utility Bill", desc: "Electricity or phone bill (within last 3 months) showing business address", badge: "Common" },
  { name: "Bank Statement", desc: "Business bank account statement showing name and address", badge: "Common" },
  { name: "Company Registration", desc: "MCA Certificate of Incorporation for Pvt Ltd or LLP", badge: "Enterprises" },
]

const rejections = [
  { reason: "Business name mismatch", fix: "Ensure your name in Meta matches document exactly including Pvt Ltd, LLP etc." },
  { reason: "Address mismatch", fix: "The address in Meta must match the address on your document perfectly." },
  { reason: "Low-quality document", fix: "Upload clear, high-resolution documents in PDF or JPG format." },
  { reason: "Website missing business details", fix: "Your website should show your business name, address, and phone number." },
]

const faqs = [
  { q: "Is Meta Business Verification free?", a: "Yes, completely free. There are no fees to submit documents or get verified." },
  { q: "How long does it take in India?", a: "Typically 2-5 business days. Up to 7 days in some cases." },
  { q: "Can I send WhatsApp messages before verification?", a: "Yes but limited to test numbers in Sandbox mode. After verification you can message any opted-in number." },
  { q: "What if my verification gets rejected?", a: "Meta will tell you why. Fix the issue and resubmit after 24 hours." },
  { q: "Does Waki help with Meta Business Verification?", a: "Yes! Contact our support team via chat inside your Waki dashboard for guidance." },
]

const schemaData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to Complete Meta Business Verification for WhatsApp API",
      "description": "Step-by-step guide to verify your Meta Business Account for WhatsApp Business API access in India.",
      "step": steps.map((s, i) => ({ "@type": "HowToStep", "position": i + 1, "name": s.title, "text": s.detail })),
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
  ],
})

export default function MetaVerificationGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
      <Header />
      <main style={{ minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#fff", backgroundColor: "#0a2a1a" }}>
        <section style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #064e3b 50%, #0a2a1a 100%)", padding: "80px 24px 60px", textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <span style={{ display: "inline-block", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: "24px", padding: "6px 16px", marginBottom: "24px", color: "#25d366", fontSize: "14px", fontWeight: 600 }}>Step-by-Step Guide</span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.2, marginBottom: "20px" }}>
              How to Complete{" "}<span style={{ color: "#25d366" }}>Meta Business Verification</span>{" "}for WhatsApp API
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "640px", margin: "0 auto 32px" }}>
              Get your Business Manager verified by Meta to unlock WhatsApp Business API, remove messaging limits, and go live on Waki automatically.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
              <span>2-5 business days</span><span>•</span><span>Free process</span><span>•</span><span>India specific</span>
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 800, marginBottom: "40px" }}>Why Is Meta Business Verification Required?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { title: "Remove Messaging Limits", desc: "Unverified accounts can only message test numbers. After verification, message any opted-in customer." },
              { title: "Sandbox to Live on Waki", desc: "Your Waki channel automatically switches from Sandbox to Live after Meta verification." },
              { title: "Build Customer Trust", desc: "Verified businesses get a green checkmark on WhatsApp, boosting trust and open rates." },
            ].map((c, i) => (
              <div key={i} style={{ background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "16px", padding: "28px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px", color: "#25d366" }}>{c.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "rgba(37,211,102,0.03)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 800, marginBottom: "48px" }}>Complete Step-by-Step Process</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(37,211,102,0.12)", borderRadius: "16px", padding: "28px" }}>
                  <div style={{ minWidth: "56px", height: "56px", background: "linear-gradient(135deg, #128c7e, #25d366)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", color: "#071a0f", flexShrink: 0 }}>{step.num}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>{step.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>{step.detail}</p>
                    <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#25d366" }}><strong>Tip:</strong> {step.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 800, marginBottom: "40px" }}>Accepted Documents in India</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {docs.map((doc, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "14px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{doc.name}</h3>
                  <span style={{ background: doc.badge === "Recommended" ? "rgba(37,211,102,0.2)" : "rgba(255,255,255,0.08)", color: doc.badge === "Recommended" ? "#25d366" : "rgba(255,255,255,0.6)", fontSize: "11px", padding: "3px 8px", borderRadius: "20px", marginLeft: "8px", whiteSpace: "nowrap" }}>{doc.badge}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{doc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "rgba(255,100,100,0.03)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 800, marginBottom: "40px" }}>Common Reasons for Rejection</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
              {rejections.map((r, i) => (
                <div key={i} style={{ background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: "14px", padding: "24px", display: "flex", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ff8080", marginBottom: "8px" }}>{r.reason}</h3>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}><strong>Fix:</strong> {r.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "rgba(37,211,102,0.03)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: 800, marginBottom: "40px" }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, i) => (
                <details key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: "14px", padding: "20px 24px" }}>
                  <summary style={{ fontWeight: 700, fontSize: "16px", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between" }}>
                    {faq.q}<span style={{ color: "#25d366" }}>+</span>
                  </summary>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginTop: "16px", marginBottom: 0 }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #128c7e, #25d366)", textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#071a0f", marginBottom: "16px" }}>Ready to Go Live on WhatsApp?</h2>
          <p style={{ fontSize: "18px", color: "rgba(0,0,0,0.75)", marginBottom: "36px" }}>Connect your WhatsApp on Waki. After Meta verification, everything goes live automatically.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="https://app.waki.in" style={{ background: "#071a0f", color: "#25d366", padding: "16px 36px", borderRadius: "12px", fontWeight: 800, fontSize: "18px", textDecoration: "none", display: "inline-block" }}>Get Started Free on Waki &rarr;</Link>
            <Link href="/guides" style={{ background: "rgba(0,0,0,0.15)", color: "#071a0f", padding: "16px 36px", borderRadius: "12px", fontWeight: 700, fontSize: "18px", textDecoration: "none", display: "inline-block" }}>&larr; All Guides</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
