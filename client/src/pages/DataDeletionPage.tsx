import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, CheckCircle, Mail, Clock, Shield, AlertCircle } from "lucide-react";

const COMPANY = "Aiclex Solutions Private Limited";
const APP = "Waki";
const EMAIL = "privacy@aiclex.in";

export const DataDeletionPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const steps = [
    { icon: Mail, step: "01", title: "Send Deletion Request", desc: `Email us at ${EMAIL} with the subject line "Data Deletion Request". Include the email address or phone number associated with your Waki account.` },
    { icon: Clock, step: "02", title: "Verification (1–2 days)", desc: "We will verify your identity and account ownership within 1–2 business days and send a confirmation email acknowledging your request." },
    { icon: Trash2, step: "03", title: "Data Deleted (30 days)", desc: "All your personal data, campaign history, contact lists, and account information will be permanently deleted within 30 days of confirmation." },
    { icon: CheckCircle, step: "04", title: "Deletion Confirmed", desc: "You will receive a final confirmation email once all your data has been fully erased from our systems and backups." },
  ];

  const dataDeleted = [
    "Account information (name, email, phone number)",
    "Business profile and WhatsApp Business API credentials",
    "All contact lists and segments you uploaded",
    "Campaign history, messages sent, and analytics data",
    "Chatbot configurations and automation workflows",
    "Billing information and transaction history",
    "Support tickets and correspondence",
    "All activity logs associated with your account",
  ];

  const dataRetained = [
    "Data required by law or regulatory compliance (e.g. GST invoices — retained for 7 years as per Indian law)",
    "Anonymized, aggregated data that cannot be linked back to you",
    "Data involved in ongoing legal disputes or investigations",
  ];

  return (
    <>
      <Header />
      <main style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen pt-20">

        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}>
              <Trash2 className="w-8 h-8" style={{ color: "#25d366" }} />
            </div>
            <h1 className="text-5xl font-black text-white mb-4">Data Deletion Request</h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Last updated: August 2026</p>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              {COMPANY} respects your right to erasure. You can request complete deletion of your personal data from {APP} at any time.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

          {/* Facebook / Meta login users */}
          <div className="rounded-2xl p-7" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "#25d366" }} />
              <div>
                <h2 className="text-lg font-bold text-white mb-2">For Meta / Facebook Login Users</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  If you signed up for {APP} using Facebook Login, you can also revoke {APP}'s access to your Facebook data directly through Facebook:
                </p>
                <ol className="mt-3 space-y-2">
                  {[
                    "Go to Facebook Settings → Apps and Websites",
                    `Find "${APP}" in the list of connected apps`,
                    'Click "Remove" to revoke access',
                    `Then email ${EMAIL} to request deletion of any remaining data we hold`,
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-xs font-black mt-0.5 w-4 flex-shrink-0" style={{ color: "#25d366" }}>{i + 1}.</span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-2xl font-black text-white mb-6">How to Request Data Deletion</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {steps.map((s, i) => (
                <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,211,102,0.12)" }}>
                      <s.icon className="w-5 h-5" style={{ color: "#25d366" }} />
                    </div>
                    <span className="text-2xl font-black" style={{ color: "rgba(37,211,102,0.4)" }}>{s.step}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What gets deleted */}
          <div className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="w-5 h-5" style={{ color: "#25d366" }} />
              <h2 className="text-xl font-bold text-white">What Data Will Be Deleted</h2>
            </div>
            <ul className="space-y-2.5">
              {dataDeleted.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#25d366" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What is retained */}
          <div className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertCircle className="w-5 h-5" style={{ color: "#f59e0b" }} />
              <h2 className="text-xl font-bold text-white">Data We May Retain</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
              In limited circumstances, we are legally required to retain certain data even after a deletion request:
            </p>
            <ul className="space-y-2.5">
              {dataRetained.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact box */}
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
            <Mail className="w-10 h-10 mx-auto mb-4" style={{ color: "#25d366" }} />
            <h2 className="text-2xl font-black text-white mb-3">Submit Your Deletion Request</h2>
            <p className="mb-6 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              Email us with your registered email address, name, and the reason for deletion (optional). We will process your request within 30 days.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=Data Deletion Request&body=Name: %0ARegistered Email: %0APhone (if applicable): %0ARequest: I would like to request complete deletion of my personal data from Waki.`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1"
              style={{ background: "#25d366", color: "#fff", boxShadow: "0 8px 25px rgba(37,211,102,0.35)" }}
            >
              <Mail className="w-5 h-5" /> Send Deletion Request
            </a>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Or email directly: <strong className="text-white">{EMAIL}</strong>
            </p>
            <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {COMPANY} · Jaipur, Rajasthan, India — 302001
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default DataDeletionPage;
