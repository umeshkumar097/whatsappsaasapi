import React, { useState } from "react";
import { MessageSquare, Workflow, BarChart3, Users, Bot, Calendar, Send, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Send,
    title: "Bulk Messaging",
    description: "Send personalized messages to thousands of contacts instantly with smart delivery optimization and scheduling.",
    points: ["Personalized templates", "Smart scheduling", "Delivery optimization"],
  },
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Deploy a 24/7 intelligent chatbot that handles customer queries, qualifies leads, and books appointments automatically.",
    points: ["GPT-powered replies", "Multi-language support", "Handoff to human agent"],
  },
  {
    icon: BarChart3,
    title: "Campaign Analytics",
    description: "Track every message in real-time. Monitor delivery rates, open rates, click-throughs and conversions.",
    points: ["Real-time dashboard", "Click & open tracking", "Export reports"],
  },
  {
    icon: Users,
    title: "Contact Management",
    description: "Import, segment, and organize your contacts effortlessly. Create smart lists based on behavior and attributes.",
    points: ["CSV import", "Smart segmentation", "Custom tags & labels"],
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    description: "Build powerful multi-step automation flows with a visual drag-and-drop builder. No coding required.",
    points: ["Visual flow builder", "Trigger-based flows", "Conditional logic"],
  },
  {
    icon: Calendar,
    title: "Campaign Scheduler",
    description: "Schedule campaigns in advance and let Waki handle delivery at the perfect time for your audience.",
    points: ["Time-zone aware", "Drip campaigns", "Recurring schedules"],
  },
];

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #064e3b 0%, #0a2a1a 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Everything You Need to<br />
            <span style={{ color: "#25d366" }}>Scale on WhatsApp</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            From bulk messaging to AI chatbots, our platform provides all the tools to create powerful WhatsApp marketing campaigns.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                activeTab === i
                  ? { background: "#25d366", color: "#fff" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              <f.icon className="w-4 h-4" />
              {f.title}
            </button>
          ))}
        </div>

        {/* Active feature detail */}
        <div
          className="rounded-3xl p-8 sm:p-12 mb-16 grid md:grid-cols-2 gap-10 items-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(37,211,102,0.15)" }}
        >
          <div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(37,211,102,0.15)" }}>
              {React.createElement(features[activeTab].icon, { className: "w-7 h-7", style: { color: "#25d366" } })}
            </div>
            <h3 className="text-3xl font-black text-white mb-4">{features[activeTab].title}</h3>
            <p className="mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{features[activeTab].description}</p>
            <ul className="space-y-3">
              {features[activeTab].points.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#25d366" }} />
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Visual panel */}
          <div
            className="rounded-2xl p-6 min-h-[250px] flex flex-col gap-3"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>waki.in — {features[activeTab].title}</span>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#25d366" }} />
                <div className="h-2.5 rounded-full flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
            ))}
            <div className="mt-auto">
              <div className="h-2 rounded-full w-3/4 mb-1.5" style={{ background: "rgba(37,211,102,0.3)" }} />
              <div className="h-2 rounded-full w-1/2" style={{ background: "rgba(37,211,102,0.15)" }} />
            </div>
          </div>
        </div>

        {/* 3x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => setActiveTab(i)}
              className="rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: activeTab === i ? "rgba(37,211,102,0.1)" : "rgba(255,255,255,0.03)",
                border: activeTab === i ? "1px solid rgba(37,211,102,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(37,211,102,0.12)" }}>
                <f.icon className="w-5 h-5" style={{ color: "#25d366" }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.description.split(".")[0]}.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
