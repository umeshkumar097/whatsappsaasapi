import { City } from './cities';
import { Keyword } from './keywords';

type PageContent = {
  heroText: string;
  stats: { businesses: string; deliveryRate: string; engagement: string };
  faqs: Array<{ q: string; a: string }>;
  testimonial: { name: string; company: string; role: string; text: string };
  useCaseTip: string;
};

export function getPageContent(keyword: Keyword, city: City, keywordIndex: number, cityIndex: number): PageContent {
  let stats;
  if (city.tier === 'metro') {
    stats = { businesses: '50,000+', deliveryRate: '98.5%', engagement: '8x' };
  } else if (city.tier === 'tier2') {
    stats = { businesses: '15,000+', deliveryRate: '97.8%', engagement: '6x' };
  } else {
    stats = { businesses: '5,000+', deliveryRate: '97.2%', engagement: '5x' };
  }

  const templates = [
    `${city.name} is one of ${city.state}'s most dynamic business hubs, with thousands of businesses looking for smarter ways to connect with customers. Waki's ${keyword.displayName} platform is purpose-built for businesses in ${city.name} — offering bulk messaging, AI chatbots, and real-time analytics. Whether you run a local store or a large enterprise in ${city.name}, Waki helps you reach more customers, faster and at lower cost than any other channel.`,
    `Looking for the best ${keyword.displayName} solution in ${city.name}? Waki is trusted by thousands of businesses across ${city.state} to automate WhatsApp communication, send bulk messages, and drive measurable growth. Our platform is designed for ${city.name}'s thriving market — easy to set up in minutes, powerful enough to scale to millions of messages. Start free today and see why ${city.name} businesses love Waki.`,
    `${city.name} businesses are growing faster than ever — and WhatsApp is their most powerful communication channel. With Waki's ${keyword.displayName} platform, you can reach your entire ${city.name} customer base instantly, automate responses 24/7, and get detailed analytics on every campaign. Join the thousands of businesses in ${city.state} who already rely on Waki for their WhatsApp marketing needs.`
  ];
  const heroText = templates[(cityIndex + keywordIndex) % 3];

  const faqPool = [
    { q: `How does Waki's ${keyword.displayName} work in ${city.name}?`, a: `Waki connects to Meta's official WhatsApp Business API to let businesses in ${city.name} send messages at scale. You import your contacts, create templates, and send campaigns with real-time tracking.` },
    { q: `Is Waki's ${keyword.displayName} platform legal in ${city.name}?`, a: `Yes, Waki uses the official Meta WhatsApp Business API which is fully compliant with WhatsApp's policies. We only enable messaging to opted-in contacts, making it 100% legal for businesses in ${city.name}.` },
    { q: `How much does WhatsApp marketing cost in ${city.name}?`, a: `Waki offers a free plan to start. Paid plans start from ₹699/month, making it affordable for small businesses in ${city.name} all the way to large enterprises.` },
    { q: `Can I try Waki's ${keyword.displayName} for free in ${city.name}?`, a: `Yes! Waki offers a free plan with no credit card required. Businesses in ${city.name} can start sending WhatsApp messages immediately after signing up.` },
    { q: `How many messages can I send with Waki in ${city.name}?`, a: `With Waki's paid plans, ${city.name} businesses can send unlimited messages. Even on the free plan, you get enough credits to test the platform thoroughly.` },
    { q: `Does Waki support Hindi and regional languages for ${city.name} customers?`, a: `Yes, Waki supports Unicode messaging, so you can send messages in Hindi, Tamil, Bengali, Telugu, and all regional languages — perfect for ${city.name}'s diverse customer base.` },
    { q: `How quickly can I set up ${keyword.displayName} for my ${city.name} business?`, a: `Most ${city.name} businesses are up and running within 24 hours. Our setup wizard guides you through API connection, template approval, and your first campaign.` },
    { q: `What makes Waki better than other ${keyword.displayName} tools in ${city.name}?`, a: `Waki is built specifically for Indian businesses. We offer INR pricing, GST invoices, local payment options, and 24/7 support — making us the preferred choice for ${city.name} businesses.` },
    { q: `Can I automate customer support for my ${city.name} business with Waki?`, a: `Absolutely. Waki's AI chatbot handles common customer queries from ${city.name} customers automatically, routing complex issues to your human team.` },
    { q: `Is there a free trial for Waki's ${keyword.displayName} in ${city.name}?`, a: `Yes, Waki offers a permanent free plan for ${city.name} businesses. You can upgrade anytime as your business grows.` }
  ];

  const faqs = [];
  for (let i = 0; i < 5; i++) {
    faqs.push(faqPool[(cityIndex * 7 + keywordIndex + i * 3) % 10]);
  }

  const testimonialPool = [
    { name: 'Rajesh Kumar', company: 'ShopEasy', role: 'CEO', text: `Waki's ${keyword.displayName} platform increased our WhatsApp campaign ROI by 40%. Our ${city.name} customers respond within minutes. The automation features alone saved us 20 hours per week.` },
    { name: 'Priya Sharma', company: 'EduConnect', role: 'Marketing Head', text: `Since using Waki for ${keyword.displayName} in ${city.name}, our student engagement doubled. The chatbot handles 80% of admission queries automatically, and our team can focus on high-value interactions.` },
    { name: 'Amit Singh', company: 'HealthFirst Clinics', role: 'Founder', text: `Waki's appointment reminder feature reduced our no-shows by 60% across all our ${city.name} centers. The ${keyword.displayName} tools are exactly what healthcare businesses need.` },
    { name: 'Neha Patel', company: 'TravelMate', role: 'Operations Head', text: `We use Waki to send booking confirmations, itineraries, and offers to our ${city.name} travelers. Our customer satisfaction score went from 3.8 to 4.7 stars after switching to Waki.` },
    { name: 'Suresh Reddy', company: 'FreshMart', role: 'Director', text: `As a retail chain in ${city.name}, WhatsApp marketing was always on our wishlist. Waki made it simple. We now send daily deals to 50,000+ customers via ${keyword.displayName} and see 3x better results than email.` },
    { name: 'Kavitha Nair', company: 'FinServe Solutions', role: 'Growth Manager', text: `Waki's ${keyword.displayName} platform is a game-changer for our ${city.name} clients. We've reduced customer query response time from 4 hours to under 5 minutes using the AI chatbot.` }
  ];

  const testimonial = testimonialPool[(cityIndex + keywordIndex) % 6];
  const useCaseTip = `For ${city.name} businesses, ${keyword.displayName} works best when you personalize messages with the customer's name and purchase history. Waki's smart segmentation makes this easy.`;

  return { heroText, stats, faqs, testimonial, useCaseTip };
}
