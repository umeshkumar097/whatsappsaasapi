import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const COMPANY = "Aiclex Solutions Private Limited";
const APP = "Waki";
const EMAIL = "legal@aiclex.in";
const ADDRESS = "Jaipur, Rajasthan, India — 302001";
const EFFECTIVE = "1 August 2026";

export const TermsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sections = [
    {
      title: "1. Parties & Acceptance",
      content: `These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Customer") and ${COMPANY} (CIN: [Your CIN]), the operator of ${APP} ("Platform"). By registering, accessing, or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Platform.`,
    },
    {
      title: "2. Description of Services",
      content: `${APP} is a WhatsApp Business API-based marketing and automation platform. Services include:`,
      items: [
        "Bulk WhatsApp message campaigns via the official Meta WhatsApp Business API.",
        "AI-powered chatbot creation and automation workflows.",
        "Contact management, segmentation, and CRM integration.",
        "Campaign analytics, delivery tracking, and reporting.",
        "API access for developers and third-party integrations.",
        "Multi-number and multi-agent inbox management.",
      ],
    },
    {
      title: "3. Meta / WhatsApp Business API Compliance",
      content: "You acknowledge and agree that:",
      items: [
        "Your use of the Platform is subject to Meta's WhatsApp Business Policy, Commerce Policy, and Terms of Service.",
        "You are solely responsible for obtaining opt-in consent from all contacts before sending messages.",
        "You must not send prohibited content including spam, illegal content, hate speech, adult content, or content that violates Meta's policies.",
        `${COMPANY} is an official Meta Business Partner but is not affiliated with or endorsed by Meta Platforms, Inc. beyond this partnership.`,
        "Violation of Meta's policies may result in your WhatsApp number being suspended or permanently banned by Meta, and we bear no liability for such actions.",
        "You must comply with the Telecom Commercial Communications Customer Preference Regulations (TCCCP) issued by TRAI.",
      ],
    },
    {
      title: "4. User Account Obligations",
      content: "When creating and using your account, you agree to:",
      items: [
        "Provide accurate, current, and complete information during registration.",
        "Maintain the security of your login credentials and not share them with unauthorized persons.",
        "Notify us immediately at " + EMAIL + " of any unauthorized access or security breach.",
        "Accept responsibility for all activity conducted under your account.",
        "Use the Platform only for lawful business purposes.",
      ],
    },
    {
      title: "5. Prohibited Uses",
      content: "You expressly agree NOT to use the Platform for:",
      items: [
        "Sending unsolicited bulk messages (spam) or messages to persons who have not opted in.",
        "Phishing, fraud, impersonation, or any deceptive practice.",
        "Sending content that is illegal, defamatory, obscene, threatening, or discriminatory.",
        "Violating any applicable law including IT Act 2000, TRAI regulations, or consumer protection laws.",
        "Reverse engineering, decompiling, or attempting to extract source code from the Platform.",
        "Reselling or sublicensing Platform access to third parties without written permission.",
        "Overloading, disrupting, or attempting to gain unauthorized access to our infrastructure.",
        "Using the Platform to send political campaign messages without required disclosures.",
      ],
    },
    {
      title: "6. Payment, Billing & Refund Policy",
      content: "By subscribing to a paid plan:",
      items: [
        "You authorize us to charge your payment method for the subscription fee on the due date.",
        "All fees are in Indian Rupees (INR) unless stated otherwise and are inclusive of applicable GST.",
        "Subscription fees are non-refundable except as required by applicable law.",
        "We reserve the right to modify pricing with 30 days' written notice via email.",
        "Failure to pay may result in service suspension. Accounts inactive for 90 days after suspension may be terminated.",
        "Disputes about billing must be raised within 30 days of the charge at " + EMAIL + ".",
      ],
    },
    {
      title: "7. Intellectual Property",
      content: `All intellectual property rights in the Platform, including software, design, trademarks, logos, and documentation, are owned by or licensed to ${COMPANY}. You are granted a limited, non-exclusive, non-transferable license to use the Platform solely for your internal business purposes during your subscription. You retain ownership of your content (contacts, campaigns, templates) uploaded to the Platform.`,
    },
    {
      title: "8. Data Privacy & Processing",
      content: `${COMPANY} processes personal data as described in our Privacy Policy. By using the Platform, you act as the data controller for the contact data you upload, and we act as your data processor. You warrant that you have all necessary consents and legal bases to share contact data with us and to send messages to those contacts.`,
    },
    {
      title: "9. Service Availability & SLA",
      content: "We strive for 99.5% monthly uptime for the Platform. However:",
      items: [
        "We do not guarantee uninterrupted service and may perform scheduled maintenance (with advance notice).",
        "WhatsApp API availability is subject to Meta's infrastructure and is outside our control.",
        "We are not liable for any downtime caused by third-party services, including Meta, cloud providers, or internet outages.",
        "Planned maintenance will be communicated at least 24 hours in advance.",
      ],
    },
    {
      title: "10. Limitation of Liability",
      content: `To the maximum extent permitted by applicable law, ${COMPANY}'s total liability to you for any claims arising from these Terms or use of the Platform shall not exceed the amount paid by you in the 3 months preceding the claim. We are not liable for: (a) indirect, incidental, or consequential damages; (b) loss of profits or revenue; (c) loss of data; (d) damages resulting from Meta's actions including account suspension; (e) third-party service failures.`,
    },
    {
      title: "11. Indemnification",
      content: `You agree to indemnify, defend, and hold harmless ${COMPANY}, its directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of Meta's policies; (d) your violation of any applicable law; (e) content you send through the Platform.`,
    },
    {
      title: "12. Termination",
      content: "Either party may terminate these Terms:",
      items: [
        "You may cancel your subscription at any time from your account settings or by emailing " + EMAIL + ".",
        "We may suspend or terminate your account immediately if you violate these Terms, Meta's policies, or any applicable law.",
        "We may discontinue the Platform with 30 days' notice.",
        "Upon termination, your right to use the Platform ceases immediately. You may export your data within 14 days of termination, after which it will be deleted.",
      ],
    },
    {
      title: "13. Governing Law & Dispute Resolution",
      content: `These Terms are governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Jaipur, Rajasthan. The courts at Jaipur shall have exclusive jurisdiction for interim relief.`,
    },
    {
      title: "14. Amendments",
      content: "We may update these Terms from time to time. Material changes will be communicated via email and in-app notification at least 15 days before they take effect. Your continued use of the Platform after the effective date constitutes acceptance of the updated Terms.",
    },
    {
      title: "15. Contact Information",
      content: `${COMPANY} | Email: ${EMAIL} | Address: ${ADDRESS} | For legal notices, please send via registered post to our registered address.`,
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
              <FileText className="w-8 h-8" style={{ color: "#25d366" }} />
            </div>
            <h1 className="text-5xl font-black text-white mb-2">Terms of Service</h1>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Effective Date: {EFFECTIVE} | {COMPANY}</p>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              Please read these Terms carefully. By using {APP}, you agree to be legally bound by them.
            </p>
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

export default TermsPage;
