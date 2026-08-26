import React from "react";
import { ArrowRight, Briefcase, Heart, Zap, Globe, Users } from "lucide-react";

const openRoles = [
  { title: "Full Stack Developer", type: "Full-time", location: "Jaipur / Remote", tags: ["React", "Node.js", "PostgreSQL"] },
  { title: "WhatsApp API Integration Engineer", type: "Full-time", location: "Jaipur / Remote", tags: ["Meta API", "Node.js", "Webhooks"] },
  { title: "Product Marketing Manager", type: "Full-time", location: "Jaipur", tags: ["SaaS", "Growth", "Content"] },
  { title: "Customer Success Executive", type: "Full-time", location: "Jaipur / Remote", tags: ["Support", "Onboarding", "Hindi/English"] },
];

const perks = [
  { icon: Zap, title: "Fast Growth", desc: "Work on a product used by 10,000+ businesses. Your work has real, immediate impact." },
  { icon: Heart, title: "Health Benefits", desc: "Comprehensive health insurance for you and your family." },
  { icon: Globe, title: "Remote Friendly", desc: "Work from anywhere in India. We care about output, not hours." },
  { icon: Users, title: "Great Team", desc: "Work alongside talented, passionate people who love what they build." },
];

const Careers = () => (
  <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
          Careers
        </div>
        <h1 className="text-5xl font-black text-white mb-4">Build the Future of <span style={{ color: "#25d366" }}>WhatsApp Marketing</span></h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          We're a small, ambitious team building India's most powerful WhatsApp platform. Come grow with us.
        </p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {perks.map((p, i) => (
          <div key={i} className="p-5 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(37,211,102,0.12)" }}>
              <p.icon className="w-5 h-5" style={{ color: "#25d366" }} />
            </div>
            <div className="font-bold text-white text-sm mb-1">{p.title}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Open roles */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6" style={{ color: "#25d366" }} /> Open Positions
        </h2>
        <div className="space-y-4">
          {openRoles.map((role, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">{role.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  <span>{role.type}</span>
                  <span>·</span>
                  <span>{role.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {role.tags.map((tag, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(37,211,102,0.1)", color: "#25d366", border: "1px solid rgba(37,211,102,0.2)" }}>{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href="mailto:careers@aiclex.in"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: "#25d366", color: "#fff" }}
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* General application */}
      <div className="text-center rounded-3xl p-10" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)" }}>
        <h2 className="text-2xl font-black text-white mb-3">Don't See Your Role?</h2>
        <p className="mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>We're always looking for exceptional talent. Send us your CV and tell us how you'd contribute to Waki.</p>
        <a href="mailto:careers@aiclex.in" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1" style={{ background: "#25d366", color: "#fff" }}>
          Send Open Application <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  </section>
);

export default Careers;
