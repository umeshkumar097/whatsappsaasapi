import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Link } from "lucide-react";

const COMPANY = "Aiclex Solutions Private Limited";
const APP = "Waki";
const EMAIL = "privacy@aiclex.in";
const ADDRESS = "Jaipur, Rajasthan, India — 302001";
const EFFECTIVE = "1 August 2026";

export const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sections = [
    {
      title: "1. Who We Are",
      content: `This Privacy Policy applies to ${APP}, a product operated by ${COMPANY} (CIN: [Your CIN]), a company incorporated under the Companies Act, 2013, with its registered office at ${ADDRESS}. We are an official Meta Business Partner providing WhatsApp Business API-based marketing and automation services. If you have questions, email: ${EMAIL}.`,
    },
    {
      title: "2. Information We Collect",
      content: "We collect information in the following ways:",
      items: [
        "Account Data: Name, email address, phone number, business name, and password when you register.",
        "Business Data: WhatsApp Business Account (WABA) ID, Phone Number ID, and Meta API credentials you provide.",
        "Contact Data: Contact lists (name, phone, custom fields) you upload to the platform.",
        "Campaign Data: Messages, templates, media files, and campaign configurations you create.",
        "Usage Data: Pages visited, features used, IP address, browser type, device identifiers, and log data.",
        "Payment Data: Billing name, address, and transaction references (we do not store card numbers — handled by Cashfree).",
        "Communications: Support tickets and emails you send us.",
      ],
    },
    {
      title: "3. Legal Basis for Processing (GDPR & PDPB Compliance)",
      content: "We process your personal data under the following legal bases:",
      items: [
        "Contract Performance: To provide the services you signed up for.",
        "Legitimate Interests: To improve our platform, prevent fraud, and ensure security.",
        "Legal Obligation: To comply with applicable Indian and international laws.",
        "Consent: Where we explicitly ask for your consent (e.g. marketing emails).",
      ],
    },
    {
      title: "4. How We Use Your Information",
      content: "We use your data solely to:",
      items: [
        "Provide, maintain, and improve the Waki platform.",
        "Process transactions and send billing-related communications.",
        "Send service-related notifications (security alerts, downtime notices).",
        "Respond to support requests and inquiries.",
        "Detect and prevent fraud, abuse, and security threats.",
        "Comply with legal obligations under Indian law.",
        "Send product updates (you can unsubscribe at any time).",
      ],
    },
    {
      title: "5. WhatsApp Message Data",
      content: `${APP} processes WhatsApp messages on your behalf as a data processor acting under your instruction. We do not read, analyze, or use the content of messages sent by you or your customers for any purpose other than delivery. Message delivery logs are retained for 90 days for debugging, then permanently deleted. We are compliant with Meta's Platform Policy and do not use message content for advertising or profiling.`,
    },
    {
      title: "6. Data Sharing & Disclosure",
      content: "We do not sell or rent your personal data. We share data only in limited circumstances:",
      items: [
        "Service Providers: Trusted partners (hosting, payments, analytics) under strict data processing agreements.",
        "Meta Platforms: As required to operate the WhatsApp Business API on your behalf.",
        "Legal Requirements: When required by court order, government authority, or applicable law.",
        "Business Transfer: In connection with a merger, acquisition, or sale of assets (with 30 days' notice).",
        "With Your Consent: Any other sharing requires your explicit approval.",
      ],
    },
    {
      title: "7. Data Retention",
      content: "We retain your data only as long as necessary:",
      items: [
        "Account data: Until account deletion + 30 days.",
        "Campaign and contact data: Until you delete it or request account deletion.",
        "Financial records: 7 years as required by Indian tax law (GST Act).",
        "Message logs: 90 days for debugging, then deleted.",
        "Backup copies: Deleted within 60 days of the primary deletion.",
      ],
    },
    {
      title: "8. Data Security",
      content: `${COMPANY} implements industry-standard security measures to protect your data:`,
      items: [
        "AES-256 encryption for data at rest.",
        "TLS 1.3 encryption for all data in transit.",
        "Role-based access controls — staff access is strictly limited.",
        "Regular third-party security audits and penetration testing.",
        "Multi-factor authentication enforced for all internal systems.",
      ],
    },
    {
      title: "9. Your Rights",
      content: "You have the following rights regarding your personal data:",
      items: [
        "Right to Access: Request a copy of personal data we hold about you.",
        "Right to Rectification: Correct inaccurate or incomplete data.",
        "Right to Erasure: Request deletion of your data (see our Data Deletion page).",
        "Right to Portability: Receive your data in a machine-readable format.",
        "Right to Object: Object to certain types of processing.",
        "Right to Withdraw Consent: Where processing is based on consent.",
        "To exercise these rights, email: " + EMAIL,
      ],
    },
    {
      title: "10. Data Deletion",
      content: `You may request complete deletion of your personal data at any time. Visit our Data Deletion page at waki.in/data-deletion or email ${EMAIL} with subject "Data Deletion Request". We will process requests within 30 days. Note: Some data may be retained to comply with legal obligations.`,
    },
    {
      title: "11. Cookies",
      content: "We use essential cookies for platform functionality, analytics cookies to improve our service, and preference cookies to remember your settings. You can control cookies via your browser. See our Cookie Policy for details.",
    },
    {
      title: "12. International Data Transfers",
      content: `Your data is primarily stored and processed in India. If data is transferred outside India (e.g. to Meta's servers for WhatsApp API processing), we ensure appropriate safeguards are in place including standard contractual clauses and Meta's Data Processing Terms.`,
    },
    {
      title: "13. Children's Privacy",
      content: `${APP} is not intended for use by persons under 18 years of age. We do not knowingly collect personal data from minors. If we discover we have inadvertently collected such data, we will delete it immediately. Contact ${EMAIL} if you believe a minor's data has been collected.`,
    },
    {
      title: "14. Changes to This Policy",
      content: "We may update this Privacy Policy periodically. Material changes will be communicated via email and an in-app notification at least 15 days before taking effect. The 'Effective Date' at the top of this page will always reflect the latest version.",
    },
    {
      title: "15. Grievance Officer (India)",
      content: `In accordance with the Information Technology Act, 2000 and IT (Intermediary Guidelines) Rules, 2021, the name and contact details of our Grievance Officer are: Name: Umesh Kumar | Email: grievance@aiclex.in | Address: ${ADDRESS} | Response time: Within 24 hours of receipt, resolution within 15 days.`,
    },
    {
      title: "16. Contact & Data Protection",
      content: `For all privacy-related queries, data requests, or concerns, contact: ${COMPANY} | Email: ${EMAIL} | Address: ${ADDRESS}`,
    },
  ];

  return (
    <>
      <Header />
      <main style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen pt-20">
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}>
              <Lock className="w-8 h-8" style={{ color: "#25d366" }} />
            </div>
            <h1 className="text-5xl font-black text-white mb-2">Privacy Policy</h1>
            <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Effective Date: {EFFECTIVE}</p>
            <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              {COMPANY} is committed to protecting your privacy and your rights under applicable data protection laws.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25d366" }}>
              Data Deletion requests: <a href="/data-deletion" className="font-bold underline">waki.in/data-deletion</a>
            </div>
          </div>
        </section>

        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-5">
            {sections.map((section, i) => (
              <div key={i} className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h2 className="text-base font-bold text-white mb-3">{section.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{section.content}</p>
                {section.items && (
                  <ul className="space-y-2 mt-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#25d366" }} />
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPage;
