import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, MessageCircle, Zap, Users, TrendingUp, Shield, Send, BarChart3, Bot } from "lucide-react";
import LoadingAnimation from "./LoadingAnimation";
import { Link } from "wouter";

const TYPING_WORDS = [
  "WhatsApp Marketing",
  "Business Automation",
  "Customer Engagement",
  "Bulk Messaging",
];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [startTrialLoading, setStartTrialLoading] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({ users: 0, delivery: 0, engagement: 0 });

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
    } else {
      const speed = isDeleting ? 40 : 80;
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentWord.substring(0, displayText.length - 1)
            : currentWord.substring(0, displayText.length + 1)
        );
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedNumbers({
        users: Math.floor(10000 * progress),
        delivery: Math.floor(98 * progress),
        engagement: Math.floor(5 * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: Send, text: "Bulk WhatsApp Campaigns" },
    { icon: Bot, text: "AI Chatbot Automation" },
    { icon: BarChart3, text: "Advanced Analytics" },
    { icon: Shield, text: "Meta Official API" },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center" style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #0d3b26 40%, #0f4a2e 70%, #064e3b 100%)" }}>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #128c7e 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #25d366 0%, transparent 60%)" }} />
        {/* WhatsApp icon watermark */}
        <div className="absolute top-10 right-10 opacity-5">
          <MessageCircle size={300} color="#25d366" />
        </div>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#25d366 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Text Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.25)" }}>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#25d366" }}>
                Official Meta WhatsApp Business API
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-white">
              Grow Your Business
              <br />
              <span className="relative">
                <span className="inline-block min-h-[1.2em]" style={{ color: "#25d366" }}>
                  {displayText}
                  <span className="inline-block w-[3px] h-[0.8em] ml-1 align-middle animate-[blink_1s_step-end_infinite]" style={{ background: "#25d366" }} />
                </span>
              </span>
            </h1>

            <p className="text-lg text-green-100/70 leading-relaxed mb-8 max-w-xl">
              Connect your Meta WhatsApp Business API and send bulk messages, automate conversations, and track results — all in one powerful platform by <strong className="text-white">Waki by Aiclex</strong>.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,211,102,0.15)" }}>
                    <f.icon className="w-4 h-4" style={{ color: "#25d366" }} />
                  </div>
                  <span className="text-sm text-green-100/80 font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: "#25d366", color: "#fff", boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}
                onClick={() => setStartTrialLoading(true)}
              >
                {startTrialLoading ? (
                  <LoadingAnimation size="md" color="white" />
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-4 text-xs text-green-100/40 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: "#25d366" }} />
              No credit card required · Free plan available · Setup in 5 minutes
            </p>
          </div>

          {/* RIGHT: Stats + Preview card */}
          <div className="flex flex-col gap-6">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: `${animatedNumbers.users.toLocaleString()}+`, label: "Businesses", icon: Users },
                { value: `${animatedNumbers.delivery}%`, label: "Delivery Rate", icon: TrendingUp },
                { value: `${animatedNumbers.engagement}x`, label: "More Engagement", icon: Zap },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: "#25d366" }} />
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-green-100/50 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Phone mockup / chat preview */}
            <div className="relative rounded-3xl p-1 shadow-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="rounded-2xl overflow-hidden" style={{ background: "#0d1f16" }}>
                {/* Phone header */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#128c7e" }}>
                  <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-sm">W</div>
                  <div>
                    <div className="text-white font-semibold text-sm">Waki Business</div>
                    <div className="text-green-200 text-xs">Online</div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="px-4 py-4 space-y-3" style={{ background: "url(data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'100'%20height%3D'100'%3E%3C%2Fsvg%3E), #0a1a10" }}>
                  {/* Received */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-white" style={{ background: "#1f2e1a" }}>
                      👋 Hi! I'm interested in your product.
                    </div>
                  </div>
                  {/* Sent */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white" style={{ background: "#1a6b35" }}>
                      Hello! Thanks for reaching out 🎉<br />
                      <span className="text-green-200 text-xs">Check our latest offers 👇</span>
                    </div>
                  </div>
                  {/* Bot message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm" style={{ background: "#1a6b35", color: "#fff" }}>
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="w-3 h-3" style={{ color: "#25d366" }} />
                        <span className="text-xs" style={{ color: "#25d366" }}>AI Reply</span>
                      </div>
                      🛒 Summer Sale — 30% OFF on all plans!<br />Use code: <strong>WAKI30</strong>
                    </div>
                  </div>
                  {/* Campaign sent badge */}
                  <div className="flex justify-center">
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(37,211,102,0.15)", color: "#25d366" }}>
                      ✓ Campaign sent to 5,000 contacts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted by */}
            <div className="text-center">
              <p className="text-xs text-green-100/30 uppercase tracking-widest mb-3">Trusted by businesses in</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["E-Commerce", "Real Estate", "Healthcare", "Education", "Restaurants"].map((b, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </section>
  );
};

export default Hero;
