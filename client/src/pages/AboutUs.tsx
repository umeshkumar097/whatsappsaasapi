import React from "react";
import { MessageCircle, Users, Target, Zap, Heart, Globe, Award, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const stats = [
  { value: "10,000+", label: "Businesses Served" },
  { value: "50M+", label: "Messages Sent" },
  { value: "98%", label: "Delivery Rate" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", description: "We believe in honest, secure communication. Every feature is built with your data's safety in mind." },
  { icon: Zap, title: "Speed & Reliability", description: "Our infrastructure handles millions of messages daily with 99.9% uptime and instant delivery." },
  { icon: Heart, title: "Customer First", description: "Every decision we make starts with our customers. Your success is our north star." },
  { icon: Globe, title: "Built for India", description: "Designed specifically for Indian businesses — supporting regional use cases, languages, and payment needs." },
  { icon: TrendingUp, title: "Continuous Innovation", description: "We ship new features every week, driven by customer feedback and market needs." },
  { icon: Award, title: "Official Meta Partner", description: "We are an official Meta Business Partner — ensuring you always have a compliant, verified API connection." },
];

const team = [
  { name: "Umesh Kumar", role: "Founder & CEO", initials: "UK", color: "#25d366" },
  { name: "Priya Agarwal", role: "Head of Product", initials: "PA", color: "#34d399" },
  { name: "Rohan Singh", role: "Lead Engineer", initials: "RS", color: "#6ee7b7" },
];

const AboutUs: React.FC = () => {
  return (
    <>
      <Header />
      <main style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen pt-20">

        {/* Hero */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
          </div>
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
              About Us
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
              We're Building the Future of<br />
              <span style={{ color: "#25d366" }}>WhatsApp Marketing</span>
            </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              Waki by Aiclex Technologies is India's most powerful WhatsApp Business API platform — helping 10,000+ businesses automate conversations, run bulk campaigns, and grow with the world's most-used messaging app.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center py-8 rounded-2xl" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.15)" }}>
                <div className="text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
                Our Mission
              </div>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                Democratizing WhatsApp Marketing for Every Business
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                We started Waki because we saw a massive gap — powerful WhatsApp tools existed only for big enterprises. Small businesses were left out. We changed that.
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
                Today, Waki gives any business — from a street shop to a growing startup — the same powerful tools that Fortune 500 companies use, at a fraction of the cost.
              </p>
              {["Bring Your Own API — no extra fees", "Free plan for small businesses", "Setup in under 10 minutes"].map((p, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#25d366" }} />
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{p}</span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl p-8 flex flex-col gap-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(37,211,102,0.15)" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #128c7e, #25d366)" }}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-black text-white">Waki by Aiclex</div>
                  <div className="text-xs" style={{ color: "#25d366" }}>Founded 2024 · Jaipur, India</div>
                </div>
              </div>
              {[
                { icon: Target, label: "Vision", text: "To be the #1 WhatsApp marketing platform in South Asia" },
                { icon: Heart, label: "Mission", text: "Make powerful messaging tools accessible to every business" },
                { icon: Users, label: "Team", text: "A passionate team of engineers, marketers, and designers" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <item.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#25d366" }} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#25d366" }}>{item.label}</div>
                    <div className="text-sm text-white">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
                Our Values
              </div>
              <h2 className="text-4xl font-black text-white">What We Stand For</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v, i) => (
                <div key={i} className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,211,102,0.12)" }}>
                    <v.icon className="w-5 h-5" style={{ color: "#25d366" }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
              The Team
            </div>
            <h2 className="text-4xl font-black text-white mb-14">Meet the People Behind Waki</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div key={i} className="p-8 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4" style={{ background: `linear-gradient(135deg, #128c7e, ${member.color})` }}>
                    {member.initials}
                  </div>
                  <div className="font-bold text-white text-lg">{member.name}</div>
                  <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center rounded-3xl p-12" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
            <h2 className="text-3xl font-black text-white mb-4">Ready to Grow with Waki?</h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>Join 10,000+ businesses already using Waki to automate and scale their WhatsApp marketing.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1" style={{ background: "#25d366", color: "#fff", boxShadow: "0 8px 25px rgba(37,211,102,0.35)" }}>
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
