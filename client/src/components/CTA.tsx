import React from "react";
import { ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { Link } from "wouter";

const CTA = () => {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #064e3b 50%, #0d3b26 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
        {/* Floating WhatsApp icons */}
        <MessageCircle className="absolute top-10 left-10 opacity-5 w-32 h-32 text-green-400" />
        <MessageCircle className="absolute bottom-10 right-10 opacity-5 w-48 h-48 text-green-400" />
        <MessageCircle className="absolute top-1/2 -left-10 opacity-5 w-24 h-24 text-green-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 60%)" }} />
      </div>

      <div className="max-w-4xl mx-auto relative text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Join 10,000+ businesses already using Waki
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Start Sending WhatsApp<br />
          <span style={{ color: "#25d366" }}>Messages Today</span>
        </h2>

        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          Free plan available — no credit card required. Setup takes less than 5 minutes and your first campaign is on us.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {["Free plan available", "No credit card needed", "Official Meta API", "Setup in 5 minutes"].map((perk, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#25d366" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{perk}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "#25d366", color: "#fff", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }}
          >
            Talk to Sales
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
