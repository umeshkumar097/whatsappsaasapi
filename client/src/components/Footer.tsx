import React from "react";
import { Link } from "wouter";
import { MessageSquare, Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react";

const Footer: React.FC = () => {
  const links = {
    product: [
      { name: "Bulk Messaging", href: "/#features" },
      { name: "AI Chatbot", href: "/#features" },
      { name: "Analytics", href: "/#features" },
      { name: "Automation", href: "/#features" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "WhatsApp Guide", href: "/whatsapp-guide" },
      { name: "Case Studies", href: "/case-studies" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Data Deletion", href: "/data-deletion" },
    ],
  };

  return (
    <footer style={{ background: "#061510" }} className="text-white relative">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #25d366, transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #128c7e 0%, #25d366 100%)" }}>
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-white">Waki</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#25d366" }}>by Aiclex</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              The most powerful WhatsApp marketing platform for growing businesses. Send smarter, automate faster, grow bigger.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#25d366" }}>Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
                <button
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "#25d366", color: "#fff" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5">
              {[
                { icon: Twitter, href: "https://twitter.com", label: "Twitter", hoverColor: "#1d9bf0" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", hoverColor: "#0a66c2" },
                { icon: Github, href: "https://github.com/umeshkumar097", label: "GitHub", hoverColor: "#fff" },
                { icon: Mail, href: "mailto:info@aiclex.in", label: "Email", hoverColor: "#25d366" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <s.icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#25d366" }}>Product</h3>
            <ul className="space-y-3">
              {links.product.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm transition-all duration-200 hover:translate-x-1 inline-block" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#25d366" }}>Company</h3>
            <ul className="space-y-3">
              {links.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm transition-all duration-200 hover:translate-x-1 inline-block" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#25d366" }}>Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm transition-all duration-200 hover:translate-x-1 inline-block" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#25d366" }}>Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm transition-all duration-200 hover:translate-x-1 inline-block" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Aiclex Solutions Private Limited. All rights reserved. Waki is a product of Aiclex Solutions Pvt. Ltd.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span>Made with</span>
            <span style={{ color: "#25d366" }}>♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
