import React from "react";
import { ArrowRight, BookOpen, Star, Building2, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const cases = [
  {
    emoji: "🛒",
    industry: "E-Commerce",
    company: "ShopEasy India",
    result: "40% increase in sales",
    metric: "+40%",
    metricLabel: "Revenue Growth",
    description: "ShopEasy used Waki to send personalized abandoned cart messages and flash sale alerts to 50,000 customers. Open rate jumped to 94%.",
    tags: ["Bulk Campaigns", "Automation", "Analytics"],
  },
  {
    emoji: "🎓",
    industry: "Education",
    company: "EduLearn Academy",
    result: "2x student engagement",
    metric: "2x",
    metricLabel: "Engagement",
    description: "EduLearn automated student onboarding, fee reminders and exam alerts using Waki's chatbot. Support tickets dropped by 70%.",
    tags: ["Chatbot", "Automation", "CRM"],
  },
  {
    emoji: "🏥",
    industry: "Healthcare",
    company: "MediCare Clinics",
    result: "60% fewer no-shows",
    metric: "-60%",
    metricLabel: "No-Shows",
    description: "MediCare sends appointment reminders and lab report alerts via WhatsApp. Patient satisfaction score improved from 3.2 to 4.8 stars.",
    tags: ["Reminders", "Bulk SMS", "Analytics"],
  },
];

const CaseStudies = () => {
  return (
    <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            Case Studies
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Real Results from <span style={{ color: "#25d366" }}>Real Businesses</span></h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>See how businesses like yours are growing with Waki's WhatsApp marketing platform.</p>
        </div>

        <div className="space-y-6 mb-16">
          {cases.map((c, i) => (
            <div key={i} className="rounded-2xl p-8 grid md:grid-cols-3 gap-8 items-center transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <div className="font-black text-white text-lg">{c.company}</div>
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#25d366" }}>{c.industry}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>{c.description}</p>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(37,211,102,0.1)", color: "#25d366", border: "1px solid rgba(37,211,102,0.2)" }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="text-center p-6 rounded-xl" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.15)" }}>
                <div className="text-5xl font-black mb-1" style={{ color: "#25d366" }}>{c.metric}</div>
                <div className="text-sm font-semibold text-white mb-1">{c.metricLabel}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{c.result}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center rounded-3xl p-12" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
          <h2 className="text-3xl font-black text-white mb-4">Ready to Be Our Next Success Story?</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>Join 10,000+ businesses already growing with Waki.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1" style={{ background: "#25d366", color: "#fff", boxShadow: "0 8px 25px rgba(37,211,102,0.35)" }}>
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
