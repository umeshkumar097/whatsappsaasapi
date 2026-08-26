import React from "react";
import { ArrowRight, CheckCircle, AlertCircle, Zap, Shield, Star } from "lucide-react";
import { Link } from "wouter";

const practices = [
  { icon: CheckCircle, color: "#25d366", title: "Always Get Opt-in Consent", body: "Never send messages to people who haven't opted in. Use click-to-chat links, QR codes, or website forms to collect consent. This keeps you compliant with Meta policy and reduces block rates.", label: "DO THIS" },
  { icon: AlertCircle, color: "#f59e0b", title: "Don't Buy Contact Lists", body: "Purchased contact lists lead to high block rates, reduced message quality scores, and potential account suspension. Only message people who know your brand.", label: "AVOID THIS" },
  { icon: Zap, color: "#25d366", title: "Personalize Every Message", body: "Use the recipient's first name, reference their last purchase or interaction. Personalized messages get 6x higher reply rates than generic broadcasts.", label: "PRO TIP" },
  { icon: Shield, color: "#25d366", title: "Monitor Your Quality Score", body: "WhatsApp assigns a quality score to your number. High block rates lower it. Watch your score in the Meta Business Manager and adjust messaging frequency accordingly.", label: "IMPORTANT" },
  { icon: Star, color: "#25d366", title: "Use Approved Templates", body: "All outbound messages must use Meta-approved templates. Write clear, value-driven templates. Avoid promotional-only language — lead with value first.", label: "MUST DO" },
  { icon: CheckCircle, color: "#25d366", title: "Respect Opt-out Requests", body: "Immediately honor unsubscribe requests. Add a clear opt-out instruction in every campaign message (e.g. 'Reply STOP to unsubscribe'). This is both ethical and required by law.", label: "REQUIRED" },
];

const BestPractices = () => (
  <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
          Best Practices
        </div>
        <h1 className="text-5xl font-black text-white mb-4">WhatsApp Marketing <span style={{ color: "#25d366" }}>Best Practices</span></h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          Follow these guidelines to run compliant, high-performing WhatsApp campaigns that your customers will love.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {practices.map((p, i) => (
          <div key={i} className="p-6 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <p.icon className="w-5 h-5" style={{ color: p.color }} />
              <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md" style={{ background: `${p.color}20`, color: p.color }}>{p.label}</span>
            </div>
            <h3 className="font-bold text-white mb-2">{p.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="text-center rounded-3xl p-10" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
        <h2 className="text-2xl font-black text-white mb-3">Ready to Follow Best Practices from Day 1?</h2>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Waki builds compliance into every feature — so you can focus on growing your business.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1" style={{ background: "#25d366", color: "#fff" }}>
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </section>
);

export default BestPractices;
