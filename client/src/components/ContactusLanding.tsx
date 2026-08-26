import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from "lucide-react";

const ContactusLanding = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: "Email Us", value: "support@aiclex.in", sub: "We reply within 24 hours" },
    { icon: Phone, label: "Call Us", value: "+91 98765 43210", sub: "Mon–Sat, 9 AM – 7 PM IST" },
    { icon: MapPin, label: "Office", value: "Jaipur, Rajasthan", sub: "India — 302001" },
    { icon: Clock, label: "Response Time", value: "< 24 Hours", sub: "For all support queries" },
  ];

  return (
    <section style={{ background: "linear-gradient(180deg, #0a2a1a 0%, #061510 100%)" }} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)" }} />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)", color: "#25d366" }}>
            Contact Us
          </div>
          <h1 className="text-5xl font-black text-white mb-4">We'd Love to <span style={{ color: "#25d366" }}>Hear From You</span></h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            Have a question or ready to get started? Our team is here to help you grow with WhatsApp marketing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Contact info */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(37,211,102,0.12)" }}>
                    <item.icon className="w-5 h-5" style={{ color: "#25d366" }} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#25d366" }}>{item.label}</div>
                  <div className="font-semibold text-white text-sm">{item.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* WhatsApp direct */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)" }}>
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6" style={{ color: "#25d366" }} />
                <span className="font-bold text-white">Chat with us on WhatsApp</span>
              </div>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Get instant answers from our support team directly on WhatsApp.</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "#25d366", color: "#fff" }}
              >
                <MessageCircle className="w-4 h-4" /> Open WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <CheckCircle className="w-16 h-16 mb-4" style={{ color: "#25d366" }} />
                <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.55)" }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-black text-white mb-6">Send us a Message</h2>
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Rajesh Kumar" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "rajesh@example.com" },
                  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                  { key: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(37,211,102,0.5)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your business and what you need..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(37,211,102,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 disabled:opacity-70"
                  style={{ background: "#25d366", color: "#fff", boxShadow: "0 6px 20px rgba(37,211,102,0.3)" }}
                >
                  {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactusLanding;
