import React from "react";
import { ArrowRight } from "lucide-react";

const useCases = [
  {
    emoji: "🛒",
    industry: "E-Commerce",
    color: "#25d366",
    points: ["Order & delivery updates", "Abandoned cart recovery", "Flash sale broadcasts"],
  },
  {
    emoji: "🏠",
    industry: "Real Estate",
    color: "#34d399",
    points: ["New property alerts", "Lead follow-up automation", "Site visit reminders"],
  },
  {
    emoji: "🏥",
    industry: "Healthcare",
    color: "#6ee7b7",
    points: ["Appointment reminders", "Lab report delivery", "Health tips & wellness"],
  },
  {
    emoji: "🎓",
    industry: "Education",
    color: "#25d366",
    points: ["Course updates & results", "Fee payment reminders", "Exam schedule alerts"],
  },
  {
    emoji: "🍽️",
    industry: "Restaurants",
    color: "#34d399",
    points: ["Daily specials & menu", "Reservation confirmations", "Customer feedback loops"],
  },
];

const UseCases = () => {
  return (
    <section
      id="use-cases"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d3b26 0%, #064e3b 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.2), transparent)" }} />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            Use Cases
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Built for Every
            <span style={{ color: "#25d366" }}> Industry</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            Waki adapts to your business. Thousands of companies across industries use Waki every day.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Emoji + industry */}
              <div className="flex items-center gap-3 mb-5">
                <div className="text-4xl">{uc.emoji}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{uc.industry}</h3>
                  <div className="h-0.5 w-8 rounded-full mt-1" style={{ background: uc.color }} />
                </div>
              </div>

              {/* Points */}
              <ul className="space-y-2.5 mb-6">
                {uc.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: uc.color }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{p}</span>
                  </li>
                ))}
              </ul>

              <button className="flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: uc.color }}>
                Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}

          {/* "Your industry?" card */}
          <div
            className="rounded-2xl p-7 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1"
            style={{ background: "rgba(37,211,102,0.06)", border: "1px dashed rgba(37,211,102,0.3)" }}
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-bold text-white mb-2">Your Industry?</h3>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Waki works for any business that communicates with customers on WhatsApp.
            </p>
            <a
              href="/signup"
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: "#25d366", color: "#fff" }}
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
