import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Waki by Aiclex',
  description: 'Privacy Policy for Waki by Aiclex - WhatsApp marketing platform.',
};

function PolicyLayout({ children, activeSection }: { children: React.ReactNode, activeSection?: string }) {
  const sections = [
    { id: 'information-we-collect', label: 'Information We Collect' },
    { id: 'how-we-use-information', label: 'How We Use Your Information' },
    { id: 'data-sharing', label: 'Data Sharing & Third Parties' },
    { id: 'data-retention', label: 'Data Retention' },
    { id: 'user-rights', label: 'User Rights' },
    { id: 'cookies-policy', label: 'Cookies Policy' },
    { id: 'security-measures', label: 'Security Measures' },
    { id: 'childrens-privacy', label: 'Children\'s Privacy' },
    { id: 'changes-to-policy', label: 'Changes to Policy' },
    { id: 'contact-information', label: 'Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-2">
            <h3 className="text-xl font-bold mb-4 text-[#25d366]">Privacy Policy</h3>
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
          <h1 className="text-4xl font-extrabold mb-8 text-[#0a2a1a]">Privacy Policy</h1>
          <div className="prose prose-green max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <PolicyLayout>
      <p className="mb-6">
        Aiclex Solutions Private Limited ("Company", "we", "us", or "our") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website https://waki.in and our application https://app.waki.in (our "Service") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
      </p>

      <h2 id="information-we-collect" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">1. Information We Collect</h2>
      <p>We collect several types of information from and about users of our Service, including:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Personal Data:</strong> We may collect personal information such as your name, email address, phone number, company name, and job title when you register for an account or contact us.</li>
        <li><strong>Usage Data:</strong> Information about how you access and use the Service, including your IP address, browser type, operating system, referral URLs, device information, and pages viewed.</li>
        <li><strong>WhatsApp Message Data:</strong> As a WhatsApp marketing platform, we process message content, contact lists, templates, and campaign metadata on your behalf to provide the Service.</li>
        <li><strong>Payment Information:</strong> If you purchase a subscription, we collect payment details. Note that payment processing is handled by our third-party provider (Cashfree), and we do not store full credit card numbers.</li>
      </ul>

      <h2 id="how-we-use-information" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">2. How We Use Your Information</h2>
      <p>We use the information we collect about you or that you provide to us, including any personal information:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>To present our Service and its contents to you.</li>
        <li>To provide you with the WhatsApp API services, including sending campaigns and managing contacts.</li>
        <li>To carry out our obligations and enforce our rights arising from any billing and collection.</li>
        <li>To notify you about changes to our Service, marketing updates, and promotional offers.</li>
        <li>To improve our website, products, and services through analytics.</li>
        <li>To fulfill any other purpose for which you provide it.</li>
      </ul>

      <h2 id="data-sharing" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">3. Data Sharing & Third Parties</h2>
      <p>We may disclose aggregated information about our users without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Meta / WhatsApp API:</strong> We share necessary data with Meta to facilitate the WhatsApp Business API services you request.</li>
        <li><strong>Cashfree Payments:</strong> For processing subscription payments securely.</li>
        <li><strong>Hosting & Infrastructure:</strong> To contractors, service providers, and other third parties we use to support our business (e.g., cloud hosting).</li>
        <li><strong>Legal Compliance:</strong> To comply with any court order, law, or legal process, including responding to any government or regulatory request.</li>
      </ul>

      <h2 id="data-retention" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">4. Data Retention</h2>
      <p>We will retain your Personal Information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Information to the extent necessary to comply with our legal obligations (for example, we are required to retain billing records for up to 7 years per Indian law), resolve disputes, and enforce our legal agreements and policies. Message logs and campaign data are retained as per your account settings and active subscription status.</p>

      <h2 id="user-rights" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">5. User Rights</h2>
      <p>Depending on your location, you may have the following rights regarding your personal data:</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Access:</strong> Request access to the personal data we hold about you.</li>
        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
        <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
        <li><strong>Portability:</strong> Request the transfer of your personal data to another party.</li>
      </ul>
      <p>To exercise these rights, please contact us at support@waki.in.</p>

      <h2 id="cookies-policy" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">6. Cookies Policy Summary</h2>
      <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. For full details, please review our comprehensive Cookie Policy.</p>

      <h2 id="security-measures" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">7. Security Measures</h2>
      <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We use commercially acceptable organizational and technical measures to protect your Personal Data, including encryption in transit and at rest, secure access controls, and regular security audits.</p>

      <h2 id="childrens-privacy" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">8. Children's Privacy</h2>
      <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.</p>

      <h2 id="changes-to-policy" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">9. Changes to Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.</p>

      <h2 id="contact-information" className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">10. Contact Information</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <ul className="list-none pl-0 mt-2">
        <li><strong>Company:</strong> Aiclex Solutions Private Limited</li>
        <li><strong>Email:</strong> support@waki.in</li>
        <li><strong>Address:</strong> India</li>
      </ul>
    </PolicyLayout>
  );
}
