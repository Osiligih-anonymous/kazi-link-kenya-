import React from 'react';
import { Briefcase, ShieldCheck, Phone, Mail, MapPin, CheckCircle2, Lock } from 'lucide-react';

interface FooterProps {
  setCurrentTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  openAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  onNavigate,
  openAuthModal,
  openAdminModal,
}) => {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (setCurrentTab) {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-serif">
                Kazi<span className="text-emerald-400">Link</span> <span className="text-amber-400 text-base font-sans font-bold">KENYA</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Kazi Link Kenya is an online Kenyan job-search and job-application platform connecting verified job seekers with employment opportunities across all 47 counties in Kenya.
            </p>

            {/* M-Pesa Badge & Safe Application Guarantee */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 max-w-md">
                <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                  M-PESA
                </div>
                <div className="text-xs">
                  <p className="text-white font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Safaricom M-Pesa STK Integration
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Fixed KSh 150 processing fee charged only upon final application submission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors">
                  Find Jobs in Kenya
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('categories')} className="hover:text-emerald-400 transition-colors">
                  Browse by Category
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors">
                  Nairobi Jobs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors">
                  Mombasa & Coastal Jobs
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('register')} className="hover:text-amber-400 text-amber-300 font-medium transition-colors">
                  Create Seeker Profile (Free)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Transparency */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-emerald-400 transition-colors">
                  About Kazi Link
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={openAdminModal} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact / Kenyan Presence */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kenyan Support</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nairobi Commercial Hub, Upper Hill & CBD, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+254 723 456 700 / +254 788 388 212</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@kazilink.co.ke</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
              <p className="font-semibold text-slate-400">Application Fee Notice:</p>
              <p>Browsing and CV uploads are 100% free. A flat fee of KSh 150 is paid directly via M-Pesa per submitted job application.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kazi Link Kenya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('privacy')} className="hover:text-slate-400">Privacy</button>
            <button onClick={() => handleNav('terms')} className="hover:text-slate-400">Terms</button>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-400">Security</button>
            <span className="text-emerald-500 font-medium">Proudly Kenyan 🇰🇪</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
