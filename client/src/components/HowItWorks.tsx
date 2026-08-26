import React from "react";
import { Link2, Upload, Megaphone, BarChart2, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Connect Your API",
    description: "Link your Meta WhatsApp Business API in minutes. We guide you step by step through the entire setup process.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Import Contacts",
    description: "Upload your contacts via CSV or sync directly from your CRM. Segment them with tags for targeted messaging.",
  },
  {
    number: "03",
    icon: Megaphone,
    title: "Create Campaign",
    description: "Design your message with rich media — images, videos, PDFs and interactive buttons. Use AI to write it faster.",
  },
  {
    number: "04",
    icon: BarChart2,
    title: "Send & Analyze",
    description: "Launch your campaign and track delivery, opens, clicks and replies in real-time on your analytics dashboard.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #0d3b26 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.2), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.2), transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Up and Running in
            <span style={{ color: "#25d366" }}> 4 Simple Steps</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            From zero to your first WhatsApp campaign in under 10 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px z-0" style={{ background: "repeating-linear-gradient(90deg, #25d366 0, #25d366 8px, transparent 8px, transparent 20px)" }} />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              {/* Number + Icon */}
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: "linear-gradient(135deg, #128c7e, #25d366)", boxShadow: "0 8px 30px rgba(37,211,102,0.3)" }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: "#0d3b26", border: "1.5px solid #25d366", color: "#25d366" }}
                >
                  {step.number.replace("0", "")}
                </div>
              </div>

              <div
                className="rounded-2xl p-6 w-full"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(37,211,102,0.12)" }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl" style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)" }}>
            <CheckCircle className="w-5 h-5" style={{ color: "#25d366" }} />
            <span className="text-sm font-medium text-white">No technical knowledge required — we handle the complexity</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
