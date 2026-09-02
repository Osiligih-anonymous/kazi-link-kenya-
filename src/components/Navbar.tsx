import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  FileText, 
  Layers, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronDown,
  PlusCircle,
  Search
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  openJobCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openJobCreateModal,
}) => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Kenyan Notice Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">KAZI LINK KENYA</span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-200">Official Kenyan Job Search & Application Platform</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-200 text-xs">
            <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-amber-300 font-semibold">
              KSh 150 Per Application
            </span>
            <span className="hidden sm:inline">M-Pesa Verified</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-serif">
                  Kazi<span className="text-emerald-700">Link</span>
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  KENYA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden xs:block">
                Tafuta Kazi • Apply Fast • M-Pesa Safe
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-btn-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentTab === 'home'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-btn-jobs"
              onClick={() => handleNavClick('jobs')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'jobs'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              Find Jobs
            </button>
            <button
              id="nav-btn-categories"
              onClick={() => handleNavClick('categories')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentTab === 'categories'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Categories
            </button>
            <button
              id="nav-btn-about"
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentTab === 'about'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              About
            </button>
            <button
              id="nav-btn-contact"
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentTab === 'contact'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>

            {/* Admin Quick Nav */}
            {isAdmin && (
              <button
                id="nav-btn-admin-desktop"
                onClick={() => handleNavClick('admin')}
                className={`ml-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* User Auth Buttons / Profile Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {(profile?.full_name || user.fullName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight max-w-[130px] truncate">
                      {profile?.full_name || user.fullName || 'My Account'}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
                      {isAdmin ? 'Administrator' : 'Job Seeker'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    {!isAdmin && (
                      <>
                        <button
                          id="drop-btn-dashboard"
                          onClick={() => handleNavClick('profile')}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 font-medium"
                        >
                          <User className="w-4 h-4 text-emerald-600" />
                          My Profile & CV
                        </button>
                        <button
                          id="drop-btn-applications"
                          onClick={() => handleNavClick('my-applications')}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 font-medium"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          My Applications
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <button
                        id="drop-btn-admin"
                        onClick={() => handleNavClick('admin')}
                        className="w-full px-4 py-2 text-left text-sm text-amber-900 hover:bg-amber-50 flex items-center gap-2.5 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      id="drop-btn-logout"
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                        setCurrentTab('home');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-login-header"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Log In
                </button>
                <button
                  id="btn-register-header"
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <button
                onClick={() => handleNavClick(isAdmin ? 'admin' : 'profile')}
                className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center"
              >
                {(profile?.full_name || user.fullName || user.email || 'U')[0].toUpperCase()}
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentTab === 'home' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('jobs')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentTab === 'jobs' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
            }`}
          >
            Find Jobs
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentTab === 'categories' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentTab === 'about' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
            }`}
          >
            About Kazi Link
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentTab === 'contact' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
            }`}
          >
            Contact Support
          </button>

          {user && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="px-3 py-1">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-bold text-slate-900">{profile?.full_name || user.email}</p>
              </div>

              {!isAdmin && (
                <>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center gap-2 ${
                      currentTab === 'profile' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
                    }`}
                  >
                    <User className="w-5 h-5 text-emerald-600" />
                    My Profile & CV
                  </button>
                  <button
                    onClick={() => handleNavClick('my-applications')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold flex items-center gap-2 ${
                      currentTab === 'my-applications' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    My Applications
                  </button>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                  setCurrentTab('home');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}

          {!user && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 text-center font-bold text-slate-800 bg-slate-100 rounded-xl"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="w-full py-2.5 text-center font-bold text-white bg-emerald-700 rounded-xl"
              >
                Create Free Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
