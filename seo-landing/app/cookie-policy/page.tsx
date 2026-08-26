import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Waki by Aiclex',
  description: 'Cookie Policy for Waki by Aiclex.',
};

function PolicyLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    { id: 'what-are-cookies', label: 'What are Cookies' },
    { id: 'types-we-use', label: 'Types of Cookies We Use' },
    { id: 'specific-cookies', label: 'Specific Cookies Table' },
    { id: 'how-to-control', label: 'How to Control Cookies' },
    { id: 'third-party', label: 'Third-Party Cookies' },
    { id: 'consent', label: 'Cookie Consent' },
    { id: 'updates', label: 'Updates to Policy' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-2">
            <h3 className="text-xl font-bold mb-4 text-[#25d366]">Cookie Policy</h3>
            <p className="text-sm text-gray-400 mb-6">Last updated: August 2025</p>
            <nav className="flex flex-col space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-gray-300 hover:text-[#25d366] transition-colors text-sm py-1"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        
        <div className="flex-grow bg-white text-gray-800 p-8 md:p-12 rounded-2xl shadow-xl max-w-[800px]">
          <h1 className="text-4xl font-extrabold mb-8 text-[#0a2a1a]">Cookie Policy</h1>
          <div className="prose prose-green max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <PolicyLayout>
      <h2 id="what-are-cookies" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">1. What are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information and assist with service personalization.
      </p>

      <h2 id="types-we-use" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">2. Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Essential Cookies:</strong> Necessary for the website to function properly. They enable core functionality like security, network management, and account access.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
        <li><strong>Marketing Cookies:</strong> Used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
        <li><strong>Preference Cookies:</strong> Enable a website to remember information that changes the way the website behaves or looks, like your preferred language or region.</li>
      </ul>

      <h2 id="specific-cookies" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">3. Specific Cookies Table</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Purpose</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-mono text-sm">session_id</td>
              <td className="border p-2">Authentication</td>
              <td className="border p-2">Session</td>
              <td className="border p-2">Essential</td>
            </tr>
            <tr>
              <td className="border p-2 font-mono text-sm">_vercel_analytics</td>
              <td className="border p-2">Performance</td>
              <td className="border p-2">1 year</td>
              <td className="border p-2">Analytics</td>
            </tr>
            <tr>
              <td className="border p-2 font-mono text-sm">cf_clearance</td>
              <td className="border p-2">Security</td>
              <td className="border p-2">1 year</td>
              <td className="border p-2">Essential</td>
            </tr>
            <tr>
              <td className="border p-2 font-mono text-sm">waki_pref</td>
              <td className="border p-2">User preferences</td>
              <td className="border p-2">1 year</td>
              <td className="border p-2">Preference</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="how-to-control" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">4. How to Control Cookies</h2>
      <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
        <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
        <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
      </ul>

      <h2 id="third-party" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">5. Third-Party Cookies</h2>
      <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. This includes Google Analytics and Meta Pixel.</p>

      <h2 id="consent" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">6. Cookie Consent</h2>
      <p>By using our website, you consent to the use of cookies in accordance with this Cookie Policy. You will be prompted to manage your cookie preferences upon your first visit.</p>

      <h2 id="updates" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">7. Updates to Policy</h2>
      <p>We may update our Cookie Policy from time to time. Changes will be posted on this page along with an updated revision date.</p>

      <h2 id="contact" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">8. Contact</h2>
      <p>If you have any questions about our use of cookies, please contact us at support@waki.in.</p>
    </PolicyLayout>
  );
}
