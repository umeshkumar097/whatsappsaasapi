import React from "react";
import { Cookie, Shield, ToggleLeft, Info } from "lucide-react";

const sections = [
  {
    icon: Info,
    title: "What Are Cookies?",
    body: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in, and understand how you use our platform so we can improve it.",
  },
  {
    icon: Cookie,
    title: "Cookies We Use",
    body: "We use the following types of cookies:",
    items: [
      "Essential Cookies — Required for the platform to function. Cannot be disabled.",
      "Analytics Cookies — Help us understand how users navigate Waki (e.g., Google Analytics).",
      "Preference Cookies — Remember your language, theme and other settings.",
      "Marketing Cookies — Used to show relevant ads (only with your consent).",
    ],
  },
  {
    icon: Shield,
    title: "Third-Party Cookies",
    body: "Some features use third-party services that may set their own cookies. These include Google Analytics for usage statistics, Cashfree for payment processing, and Meta Pixel for advertising performance measurement.",
  },
  {
    icon: ToggleLeft,
    title: "Managing Your Cookies",
    body: "You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. However, disabling essential cookies may prevent some parts of Waki from working correctly.",
    items: [
      "Chrome: Settings → Privacy & Security → Cookies",
      "Firefox: Options → Privacy & Security → Cookies",
      "Safari: Preferences → Privacy → Cookies",
      "Edge: Settings → Privacy & Security → Cookies",
    ],
  },
  {
    icon: Info,
    title: "Updates to This Policy",
    body: "We may update this Cookie Policy from time to time. Any changes will be posted here with an updated date. Continued use of Waki after changes means you accept the updated policy.",
  },
  {
    icon: Shield,
    title: "Contact Us",
    body: "Questions about cookies? Contact us at privacy@aiclex.in — Aiclex Technologies, Jaipur, Rajasthan, India.",
  },
];

const CookiePolicy = () => (
  <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}>
          <Cookie className="w-8 h-8" style={{ color: "#25d366" }} />
        </div>
        <h1 className="text-5xl font-black text-white mb-4">Cookie Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Last updated: August 2026</p>
        <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>How Waki by Aiclex Technologies uses cookies and similar technologies.</p>
      </div>

      <div className="space-y-5">
        {sections.map((s, i) => (
          <div key={i} className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 mb-3">
              <s.icon className="w-5 h-5 flex-shrink-0" style={{ color: "#25d366" }} />
              <h2 className="text-lg font-bold text-white">{s.title}</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{s.body}</p>
            {s.items && (
              <ul className="mt-3 space-y-2">
                {s.items.map((item, j) => (
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
    </div>
  </section>
);

export default CookiePolicy;
