import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Waki by Aiclex',
  description: 'Terms of Service for Waki by Aiclex - WhatsApp marketing platform.',
};

function PolicyLayout({ children }: { children: React.ReactNode }) {
  const sections = [
    { id: 'acceptance', label: 'Acceptance of Terms' },
    { id: 'service-desc', label: 'Description of Service' },
    { id: 'account', label: 'Account Registration' },
    { id: 'acceptable-use', label: 'Acceptable Use Policy' },
    { id: 'prohibited', label: 'Prohibited Activities' },
    { id: 'billing', label: 'Subscription & Billing' },
    { id: 'ip', label: 'Intellectual Property' },
    { id: 'liability', label: 'Limitation of Liability' },
    { id: 'indemnification', label: 'Indemnification' },
    { id: 'governing-law', label: 'Governing Law' },
    { id: 'disputes', label: 'Dispute Resolution' },
    { id: 'whatsapp-compliance', label: 'WhatsApp API Compliance' },
    { id: 'termination', label: 'Termination' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-2">
            <h3 className="text-xl font-bold mb-4 text-[#25d366]">Terms of Service</h3>
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
          <h1 className="text-4xl font-extrabold mb-8 text-[#0a2a1a]">Terms of Service</h1>
          <div className="prose prose-green max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TermsOfService() {
  return (
    <PolicyLayout>
      <p className="mb-6">
        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the https://waki.in website and the https://app.waki.in application (the "Service") operated by Aiclex Solutions Private Limited ("us", "we", or "our").
      </p>

      <h2 id="acceptance" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">1. Acceptance of Terms</h2>
      <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

      <h2 id="service-desc" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">2. Description of Service</h2>
      <p>Waki is a WhatsApp marketing platform utilizing the Meta Business API. It allows businesses to manage contacts, send promotional and transactional messages, and automate customer support. The Service is provided "as is" and we reserve the right to modify or discontinue any feature at our discretion.</p>

      <h2 id="account" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">3. Account Registration & Security</h2>
      <p>You must provide accurate and complete information when creating an account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

      <h2 id="acceptable-use" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">4. Acceptable Use Policy</h2>
      <p>You agree not to use the Service to spam, harass, or send unsolicited communications. All usage must strictly comply with WhatsApp's Business and Commerce Policies.</p>

      <h2 id="prohibited" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">5. Prohibited Activities</h2>
      <p>When using Waki, you shall not:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Send bulk unsolicited messages (spam).</li>
        <li>Create fake, fraudulent, or duplicate accounts.</li>
        <li>Transmit illegal, harmful, threatening, abusive, or defamatory content.</li>
        <li>Attempt to interfere with or compromise the system integrity or security.</li>
      </ul>

      <h2 id="billing" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">6. Subscription & Billing</h2>
      <p>Waki offers various subscription plans. By selecting a subscription plan, you agree to pay Aiclex Solutions Private Limited the monthly or annual subscription fees indicated. Payments will be charged on a pre-pay basis on the day you sign up. Subscriptions auto-renew unless cancelled before the renewal date. All fees are non-refundable unless otherwise required by law.</p>

      <h2 id="ip" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">7. Intellectual Property</h2>
      <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Aiclex Solutions Private Limited and its licensors. The Service is protected by copyright, trademark, and other laws of India and foreign countries.</p>

      <h2 id="liability" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">8. Limitation of Liability</h2>
      <p>In no event shall Aiclex Solutions Private Limited, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

      <h2 id="indemnification" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">9. Indemnification</h2>
      <p>You agree to defend, indemnify and hold harmless Aiclex Solutions Private Limited and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses resulting from your use of the Service or violation of these Terms.</p>

      <h2 id="governing-law" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">10. Governing Law</h2>
      <p>These Terms shall be governed and construed in accordance with the laws of India, specifically the jurisdiction of courts in Karnataka, without regard to its conflict of law provisions.</p>

      <h2 id="disputes" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">11. Dispute Resolution</h2>
      <p>Any dispute arising out of or in connection with these Terms shall be settled by binding arbitration in Karnataka, India, under the Arbitration and Conciliation Act, 1996.</p>

      <h2 id="whatsapp-compliance" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">12. WhatsApp API Compliance</h2>
      <p>Users must strictly follow Meta's WhatsApp Business Messaging Policies. Any violation of Meta's terms may result in immediate suspension or termination of your Waki account without a refund.</p>

      <h2 id="termination" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">13. Termination</h2>
      <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>

      <h2 id="contact" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">14. Contact</h2>
      <p>If you have any questions about these Terms, please contact us at support@waki.in.</p>
    </PolicyLayout>
  );
}
