import React from "react";
import { ArrowRight, BookOpen, CheckCircle, MessageCircle, Send, Bot, BarChart3, Users } from "lucide-react";
import { Link } from "wouter";

const tips = [
  { icon: MessageCircle, title: "Use Rich Media", description: "Messages with images, videos or PDFs get 3x higher engagement than plain text. Always use your brand visuals." },
  { icon: Users, title: "Segment Your Audience", description: "Don't blast everyone. Segment contacts by location, purchase history or behavior for targeted, relevant messages." },
  { icon: Send, title: "Timing is Everything", description: "Send between 10 AM–12 PM or 6 PM–8 PM IST for highest open rates. Avoid Mondays and late nights." },
  { icon: Bot, title: "Automate Follow-ups", description: "Set up automated sequences. If someone doesn't reply in 24 hours, send a follow-up with a different angle." },
  { icon: BarChart3, title: "Track & Optimize", description: "Monitor delivery rate, open rate and reply rate. A/B test your messages to find what works best for your audience." },
  { icon: CheckCircle, title: "Get Opt-in Consent", description: "Always get explicit consent before messaging. Use opt-in forms, QR codes or WhatsApp click-to-chat links." },
];

const WhatsAppGuide = () => (
  <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
          WhatsApp Marketing Guide
        </div>
        <h1 className="text-5xl font-black text-white mb-4">The Complete Guide to <span style={{ color: "#25d366" }}>WhatsApp Marketing</span></h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          Everything you need to know to run successful WhatsApp campaigns for your business.
        </p>
      </div>

      {/* Intro card */}
      <div className="rounded-2xl p-8 mb-8" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
        <BookOpen className="w-8 h-8 mb-4" style={{ color: "#25d366" }} />
        <h2 className="text-2xl font-black text-white mb-3">Why WhatsApp Marketing?</h2>
        <p className="leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
          WhatsApp has 500 million+ users in India alone with a 98% message open rate — compared to just 20% for email. It's the most direct, personal channel to reach your customers. With the official Meta Business API, you can send bulk messages, automate conversations, and track results — all while staying compliant.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[["98%", "Open Rate"], ["500M+", "Indian Users"], ["5x", "vs Email ROI"]].map(([v, l], i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="text-2xl font-black text-white">{v}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {tips.map((tip, i) => (
          <div key={i} className="p-6 rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,211,102,0.12)" }}>
              <tip.icon className="w-5 h-5" style={{ color: "#25d366" }} />
            </div>
            <h3 className="font-bold text-white mb-2">{tip.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center rounded-3xl p-10" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
        <h2 className="text-2xl font-black text-white mb-3">Start Your First Campaign Today</h2>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Apply everything you've learned — free plan available, no credit card required.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1" style={{ background: "#25d366", color: "#fff" }}>
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </section>
);

export default WhatsAppGuide;
