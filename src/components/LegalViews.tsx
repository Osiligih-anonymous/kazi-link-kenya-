import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-800">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Legal & Security</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you register on Kazi Link Kenya as a job seeker, create a profile, and apply for employment vacancies, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>Account & Contact Info:</strong> Full name, email address, phone number, and Kenyan county/location.</li>
            <li><strong>Professional Profile Data:</strong> Professional title, career bio, skills tags, academic qualifications, and work history.</li>
            <li><strong>Curriculum Vitae (CV):</strong> Uploaded PDF, DOC, or DOCX documents.</li>
            <li><strong>Application Records:</strong> Cover letters, vacancy IDs, and timestamps.</li>
            <li><strong>Payment Metadata:</strong> M-Pesa phone number, transaction receipt codes, and timestamp verification for the KSh 150 application processing fee. We do NOT store M-Pesa secret PINs.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Private CV Storage & Security</h2>
          <p>
            Your uploaded CV files are stored in private, encrypted cloud storage buckets. CVs are never indexed publicly on search engines and are accessible only to you and authorized recruitment reviewers reviewing your specific job application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. How We Use Your Data</h2>
          <p>
            Your information is used strictly to provide recruitment bridging services: allowing you to search jobs, submit applications to employers, verify application processing payments via Safaricom M-Pesa, and receive status updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Data Sharing & Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal data. Application details and CV attachments are shared exclusively with the recruiting organization of the vacancy to which you voluntarily submit an application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Contact Us</h2>
          <p>
            For privacy inquiries or account data requests, please contact our Data Protection Officer at <strong>privacy@kazilink.co.ke</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsOfServiceView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-800">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: August 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Kazi Link Kenya, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Free Features vs. Application Fee</h2>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-950">
            <p className="font-bold">Summary of Platform Pricing:</p>
            <p>• <strong>FREE:</strong> Browsing website, searching vacancies, filtering jobs, account registration, profile management, and CV uploading.</p>
            <p>• <strong>APPLICATION PROCESSING FEE:</strong> A flat fee of <strong>KSh 150 per application</strong> is payable exclusively via Safaricom M-Pesa at the point of final submission.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Safaricom M-Pesa Payments & Verification</h2>
          <p>
            Payments are processed via authorized Safaricom Daraja STK Push gateways. An application is formally registered and submitted only after payment confirmation. In the event of a failed or cancelled transaction, the user may retry without being double-billed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. No Guarantee of Employment</h2>
          <p>
            Kazi Link Kenya operates as an online job listing and application delivery platform. Kazi Link Kenya does not guarantee interviews, shortlisting, or employment offers. Final hiring decisions rest exclusively with the prospective employers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. User Conduct & Accuracy</h2>
          <p>
            Users warrant that all details provided in their job seeker profile, CV, and cover letters are accurate and genuine. Submitting forged certificates or impersonating other individuals is strictly prohibited and will result in immediate account termination.
          </p>
        </section>
      </div>
    </div>
  );
};
