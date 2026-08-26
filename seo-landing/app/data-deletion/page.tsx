'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DataDeletion() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a2a1a] text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        <div className="flex-grow bg-white text-gray-800 p-8 md:p-12 rounded-2xl shadow-xl max-w-[800px] mx-auto w-full">
          <h1 className="text-4xl font-extrabold mb-8 text-[#0a2a1a]">Data Deletion Request</h1>
          
          <div className="prose prose-green max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">Introduction</h2>
            <p>
              In compliance with Meta's requirements for WhatsApp Business API applications and applicable privacy laws, Waki by Aiclex provides users with the ability to request the deletion of their personal data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">What Data We Store</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (Name, Email, Company)</li>
              <li>WhatsApp message logs and templates</li>
              <li>Imported contact lists</li>
              <li>Campaign performance data</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">How to Delete Your Data</h2>
            <p>You can request data deletion through any of the following methods:</p>
            <ul className="list-decimal pl-6 mb-6">
              <li><strong>Option 1:</strong> Through app settings (Go to Settings &gt; Account &gt; Delete Account in your Waki dashboard).</li>
              <li><strong>Option 2:</strong> Email a request to <a href="mailto:support@waki.in" className="text-[#25d366]">support@waki.in</a> with the subject "Data Deletion Request".</li>
              <li><strong>Option 3:</strong> Fill out the data deletion form below.</li>
            </ul>

            {submitted ? (
              <div className="bg-green-100 border-l-4 border-[#25d366] text-green-700 p-4 mb-8 rounded">
                <p className="font-bold">Success!</p>
                <p>Your request has been submitted. We will process it within 30 days and send a confirmation email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-bold mb-4">Submit Deletion Request</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#25d366]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#25d366]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID / Phone Number</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#25d366]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#25d366]">
                      <option>No longer using the service</option>
                      <option>Privacy concerns</option>
                      <option>Switching to another provider</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#25d366] hover:bg-[#1da851] text-white font-bold py-3 px-4 rounded transition-colors">
                    Submit Request
                  </button>
                </div>
              </form>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">What Happens After Request</h2>
            <p>Once your request is received, our team will initiate the deletion process. It may take up to 30 days to completely purge your data from all our active systems and backups. You will receive a confirmation email once the process is complete.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">Data We Must Retain</h2>
            <p>Please note that for legal and compliance reasons, we are required to retain certain information (such as billing and invoicing records) for up to 7 years in accordance with Indian law.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0a2a1a]">Contact</h2>
            <p>For any questions regarding data deletion, please contact us at <a href="mailto:support@waki.in" className="text-[#25d366]">support@waki.in</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
