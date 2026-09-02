import React from 'react';
import { ShieldCheck, Target, Users, CheckCircle2, Lock, ArrowRight, Banknote } from 'lucide-react';

interface AboutViewProps {
  onBrowseJobs: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBrowseJobs, openAuthModal }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About Kazi Link Kenya
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif leading-tight">
          Connecting Kenyan Talent with Real Opportunities
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Kazi Link Kenya is designed to make it easier for job seekers across Kenya to discover employment opportunities, create a professional profile, upload their CV and apply online.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">National Reach</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From Nairobi and Mombasa to Eldoret, Kisumu, Nakuru, and Nyeri, we host opportunities across Kenya's diverse commercial hubs and counties.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Private CV Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your personal information and CV are stored in secure private storage. Only you and authorized hiring reviewers can access your documents.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Transparent Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Browsing, profile creation, and CV uploads are 100% free. You only pay a fixed KSh 150 processing fee via M-Pesa when you submit an application.
          </p>
        </div>
      </div>

      {/* Transparency Policy Box */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold font-serif text-white">
            Our Transparency Commitment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>We do NOT claim government affiliation or endorsement. We operate as an independent digital recruitment bridge.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>We do NOT promise or guarantee employment. All hiring decisions are made strictly by respective employers.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Every submitted application is securely time-stamped with a verified M-Pesa receipt reference.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>You can track your application review progress directly in the "My Applications" dashboard.</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-slate-800">
          <button
            onClick={onBrowseJobs}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            Explore Active Vacancies <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            Create Seeker Profile
          </button>
        </div>
      </div>
    </div>
  );
};
