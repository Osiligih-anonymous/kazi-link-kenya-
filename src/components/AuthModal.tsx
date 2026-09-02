import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { INITIAL_LOCATIONS } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { signUp, signIn, loginAsAdmin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Nairobi');
  const [adminPasscode, setAdminPasscode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'admin') {
        const res = await loginAsAdmin(adminPasscode);
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Invalid admin passcode.');
        }
      } else if (mode === 'register') {
        if (!fullName.trim() || !phone.trim()) {
          setErrorMessage('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }

        const res = await signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim(),
          location,
        });

        if (res.success) {
          setSuccessMessage(res.message || 'Account created successfully.');
          if (!res.requiresEmailConfirmation) {
            setTimeout(() => {
              onClose();
            }, 1200);
          }
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      } else {
        // Login
        const res = await signIn({ email: email.trim(), password });
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo user helper
  const fillDemoJobSeeker = () => {
    setEmail('wanjiku.kamau@example.co.ke');
    setPassword('KenyaPass2026!');
    setFullName('Wanjiku Kamau');
    setPhone('0712345678');
    setLocation('Nairobi');
  };

  const fillDemoAdmin = () => {
    setMode('admin');
    setAdminPasscode('admin123');
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="auth-modal-content"
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/90 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-serif font-bold text-sm">
              KL
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-serif">
                {mode === 'login' ? 'Job Seeker Sign In' : mode === 'register' ? 'Create Seeker Account' : 'Admin Security Access'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {mode === 'admin' ? 'Authorized recruitment administrator portal' : '100% Free registration & profile creation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 mx-6 mt-4 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Free
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'admin' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Kazi Link Admin Portal
                </p>
                <p>Enter administrator security passcode or credentials to manage vacancies, review applications, and inspect payments.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Admin Passcode / Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter admin passcode (e.g. admin123)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Wanjiku Kamau"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Phone Number (M-Pesa) <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712345678"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Location / Town <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      >
                        {INITIAL_LOCATIONS.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} ({loc.county})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              mode === 'admin' 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {isLoading ? (
              <span>Please wait...</span>
            ) : mode === 'register' ? (
              <>
                Create Free Job Seeker Account <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'login' ? (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Access Admin Dashboard <ShieldCheck className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Pre-fill helpers */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={fillDemoJobSeeker}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Fill Demo Seeker
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-amber-800 font-semibold hover:underline"
            >
              Admin Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
