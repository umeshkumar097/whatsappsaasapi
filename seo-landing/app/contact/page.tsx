'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, MapPin, CheckCircle, Globe } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    { q: 'How long does it take to get WhatsApp API approval?', a: 'Typically, business verification and API approval takes between 1-3 business days.' },
    { q: 'Can I use my existing WhatsApp number?', a: 'You must use a number that is not currently active on WhatsApp Personal or Business apps. You can delete the account on your app and then use the number.' },
    { q: 'Do you offer custom pricing for large volumes?', a: 'Yes, please select "Partnership / High Volume" in the contact form to discuss enterprise pricing.' },
    { q: 'Is there a limit on how many messages I can send?', a: 'Meta assigns messaging tiers. You typically start at 1,000 or 250 conversations per 24 hours, which automatically scales as you send quality messages.' },
    { q: 'What happens if my Meta account is banned?', a: 'You must ensure strict compliance with Meta policies. If banned, you will need to appeal directly with Meta support.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow w-full py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">We'd love to hear from you. Get in touch with the Waki team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Info */}
          <div className="space-y-8">
            <div className="bg-[#113a26] p-8 rounded-2xl border border-[#1b5035]">
              <h3 className="text-2xl font-bold mb-6 text-[#25d366]">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0a2a1a] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <Mail size={22} color="#25d366" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Us</h4>
                    <p className="text-gray-400">For support, sales, and general inquiries.</p>
                    <a href="mailto:support@waki.in" className="text-[#25d366] hover:underline font-medium">support@waki.in</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0a2a1a] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <MessageSquare size={22} color="#25d366" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp Chat</h4>
                    <p className="text-gray-400">Get instant responses from our team.</p>
                    <a href="https://wa.me/910000000000" className="text-[#25d366] hover:underline font-medium">Click to chat</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0a2a1a] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <MapPin size={22} color="#25d366" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Location</h4>
                    <p className="text-gray-400">Aiclex Solutions Private Limited</p>
                    <p className="text-gray-400">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#113a26] h-64 rounded-2xl border border-[#1b5035] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="text-center relative z-10">
                <div className="flex justify-center mb-3">
                  <Globe size={48} color="#25d366" />
                </div>
                <span className="font-bold text-xl text-[#25d366]">India</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-[#0a2a1a]">Send a Message</h3>
            
            {submitted ? (
              <div className="bg-green-100 border-l-4 border-[#25d366] text-green-700 p-6 rounded-lg text-center h-full flex flex-col justify-center items-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={56} color="#16a34a" /></div>
                <h4 className="text-xl font-bold mb-2">Thank you!</h4>
                <p>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-gray-500 underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all">
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership / High Volume</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent transition-all"></textarea>
                </div>

                <button type="submit" className="w-full bg-[#25d366] hover:bg-[#1da851] text-[#0a2a1a] font-bold text-lg py-4 rounded-lg transition-colors shadow-md">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#113a26] border border-[#1b5035] rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <span className="text-[#25d366] text-xl font-bold">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-gray-300">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
