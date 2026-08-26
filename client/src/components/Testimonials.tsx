import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "CEO",
    company: "ShopEasy India",
    initials: "RK",
    color: "#25d366",
    rating: 5,
    text: "Waki helped us increase our e-commerce sales by 40% through targeted WhatsApp campaigns. The automation is absolutely incredible — our team saves 10+ hours every week!",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Head",
    company: "EduLearn Academy",
    initials: "PS",
    color: "#34d399",
    rating: 5,
    text: "Our student engagement doubled after deploying Waki. The AI chatbot now handles 80% of admission queries automatically. Best investment we made this year.",
  },
  {
    name: "Amit Singh",
    role: "Founder",
    company: "MediCare Clinics",
    initials: "AS",
    color: "#6ee7b7",
    rating: 5,
    text: "Appointment reminders via WhatsApp reduced our no-shows by 60%. Patients love the personal touch and our staff spends less time on manual follow-ups. Highly recommended!",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #064e3b 0%, #0a2a1a 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.2), transparent)" }} />
        <div className="absolute -top-20 left-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            Customer Stories
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Loved by
            <span style={{ color: "#25d366" }}> 10,000+ Businesses</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Real results from real customers who use Waki every day to grow their business.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" style={{ color: "#25d366" }} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1 mb-6 italic" style={{ color: "rgba(255,255,255,0.65)" }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, #128c7e, ${t.color})` }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "10,000+", label: "Active Businesses" },
            { value: "98%", label: "Delivery Rate" },
            { value: "4.9★", label: "Average Rating" },
            { value: "50M+", label: "Messages Sent" },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center py-6 rounded-2xl"
              style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.12)" }}
            >
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
