import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Waki by Aiclex',
  description: 'Learn about Waki by Aiclex and our mission to empower Indian businesses with WhatsApp marketing.',
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
            Empowering Indian Businesses with <span className="text-[#25d366]">WhatsApp Marketing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Waki was built by Aiclex Solutions Private Limited with a vision to make WhatsApp marketing accessible, scalable, and highly effective for every Indian business.
          </p>
          <a href="https://app.waki.in/register" className="inline-block bg-[#25d366] hover:bg-[#1da851] text-[#0a2a1a] font-bold text-lg py-4 px-8 rounded-full transition-all transform hover:scale-105">
            Get Started Free
          </a>
        </section>

        {/* Stats Section */}
        <section className="bg-white text-[#0a2a1a] py-16 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-[#25d366] mb-2">10,000+</div>
              <div className="font-semibold text-gray-600">Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#25d366] mb-2">200+</div>
              <div className="font-semibold text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#25d366] mb-2">98%</div>
              <div className="font-semibold text-gray-600">Delivery Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#25d366] mb-2">24/7</div>
              <div className="font-semibold text-gray-600">Support</div>
            </div>
          </div>
        </section>

        {/* Mission & Story Section */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#25d366]">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To democratize enterprise-grade conversational commerce by providing powerful, intuitive, and affordable tools that help small and medium businesses connect with their customers on the platform they use every day.
              </p>
            </div>
            <div className="bg-[#113a26] p-8 rounded-2xl border border-[#1b5035]">
              <h2 className="text-3xl font-bold mb-6 text-[#25d366]">Our Story</h2>
              <p className="text-gray-300 leading-relaxed">
                We realized that while large enterprises were leveraging official WhatsApp APIs to boost their sales, small businesses were left behind using basic apps. Aiclex Solutions launched Waki to bridge this gap, offering a seamless integration with Meta's Business API without the technical overhead.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-[#061c11]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-[#0a2a1a] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0a2a1a] font-bold text-2xl">R</div>
                <h3 className="text-xl font-bold mb-2">Reliability</h3>
                <p className="text-gray-400 text-sm">99.9% uptime for your critical campaigns.</p>
              </div>
              <div className="bg-[#0a2a1a] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0a2a1a] font-bold text-2xl">A</div>
                <h3 className="text-xl font-bold mb-2">Affordability</h3>
                <p className="text-gray-400 text-sm">Transparent pricing designed for growth.</p>
              </div>
              <div className="bg-[#0a2a1a] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0a2a1a] font-bold text-2xl">I</div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-400 text-sm">Constantly evolving features and tools.</p>
              </div>
              <div className="bg-[#0a2a1a] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0a2a1a] font-bold text-2xl">C</div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-gray-400 text-sm">Your success is our primary metric.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { initials: 'AS', role: 'Founder & CEO' },
              { initials: 'MK', role: 'Head of Product' },
              { initials: 'JD', role: 'Lead Engineer' }
            ].map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#25d366] to-[#128C7E] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a2a1a] mb-4 shadow-lg shadow-[#25d366]/20">
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold">{member.role}</h3>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
