import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JobCard } from './components/JobCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplicationModal } from './components/ApplicationModal';
import { AuthModal } from './components/AuthModal';
import { ProfileView } from './components/ProfileView';
import { MyApplicationsView } from './components/MyApplicationsView';
import { AdminDashboard } from './components/AdminDashboard';
import { JobsView } from './components/JobsView';
import { CategoriesView } from './components/CategoriesView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView, TermsOfServiceView } from './components/LegalViews';
import { JobVacancy, JobApplication, CategoryItem, LocationItem } from './types';
import { 
  fetchVacancies, 
  fetchCategories,
  fetchLocations,
  getCategories, 
  getLocations, 
  fetchUserApplications 
} from './services/appService';
import { 
  Search, 
  MapPin, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Users, 
  Briefcase, 
  Banknote,
  Clock,
  ExternalLink
} from 'lucide-react';

const VALID_VIEWS = ['home', 'jobs', 'categories', 'profile', 'my-applications', 'admin', 'about', 'contact', 'privacy', 'terms'];

function parseViewFromUrl(): string {
  if (typeof window === 'undefined') return 'home';

  // 1. Check hash e.g. #/jobs or #jobs
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  if (VALID_VIEWS.includes(hash)) return hash;

  // 2. Check path e.g. /kazi-link-kenya/jobs, /kazi-link-kenya-/jobs, or /jobs
  const cleanPath = window.location.pathname
    .replace(/^\/kazi-link-kenya-?\/?/i, '')
    .replace(/^\//, '')
    .split('/')[0]
    ?.toLowerCase();

  if (VALID_VIEWS.includes(cleanPath)) return cleanPath;

  return 'home';
}

function MainApp() {
  const { user, isAdmin } = useAuth();

  // Navigation State: 'home' | 'jobs' | 'categories' | 'profile' | 'my-applications' | 'admin' | 'about' | 'contact' | 'privacy' | 'terms'
  const [currentView, setCurrentView] = useState<string>(parseViewFromUrl);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    if (view === 'home') {
      // Clear hash or set to #/
      history.replaceState(null, '', window.location.pathname);
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize browser history and hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const detected = parseViewFromUrl();
      setCurrentView(detected);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Search parameters passed to jobs view
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: 'all',
    category: 'all',
  });

  // Vacancy Data & Metadata
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobVacancy | null>(null);

  // Load Vacancies & Taxonomies
  const loadData = async () => {
    setIsLoadingJobs(true);
    try {
      const [jobsData, catsData, locsData] = await Promise.all([
        fetchVacancies(),
        fetchCategories(),
        fetchLocations(),
      ]);
      setVacancies(jobsData);
      setCategories(catsData);
      setLocations(locsData);
    } catch (err) {
      console.error('Error loading vacancies:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load user applied job ids
  useEffect(() => {
    async function loadAppliedIds() {
      if (user) {
        try {
          const apps = await fetchUserApplications(user.id);
          const ids = new Set(apps.map((a) => a.vacancy_id));
          setAppliedJobIds(ids);
        } catch (e) {
          console.error(e);
        }
      } else {
        setAppliedJobIds(new Set());
      }
    }
    loadAppliedIds();
  }, [user]);

  // Handle Home Search Submit
  const handleHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('jobs');
  };

  // Open Auth Modal
  const openAuth = (mode: 'login' | 'register' | 'admin' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Trigger Application Flow
  const handleApplyClick = (job: JobVacancy) => {
    setSelectedJob(null);
    if (!user) {
      openAuth('login');
      return;
    }
    setApplyingJob(job);
  };

  // On Application Success
  const handleApplicationSuccess = (applicationOrId: JobApplication | string) => {
    const vacancyId = typeof applicationOrId === 'object' && applicationOrId?.vacancy_id
      ? applicationOrId.vacancy_id
      : applyingJob?.id;

    if (vacancyId) {
      setAppliedJobIds((prev) => new Set([...prev, vacancyId]));
    }
    setApplyingJob(null);
    navigateTo('my-applications');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Universal Navigation Header */}
      <Navbar
        currentTab={currentView}
        setCurrentTab={navigateTo}
        openAuthModal={openAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HOME VIEW */}
        {/* ========================================================================= */}
        {currentView === 'home' && (
          <div className="space-y-16 sm:space-y-24 pb-16">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8">
              {/* Background ambient accents */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Kenya's Dedicated Employment & CV Platform
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.15]">
                  Find Your Next Job in Kenya
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Browse verified vacancies across Kenya, create your profile, upload your CV securely and apply online with instant M-Pesa verification.
                </p>

                {/* Primary Search Bar */}
                <form
                  onSubmit={handleHomeSearch}
                  className="bg-white p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 max-w-4xl mx-auto text-slate-800"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Keyword */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={searchParams.keyword}
                        onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                        placeholder="Job title, keywords, or company..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    {/* Location */}
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <select
                        value={searchParams.location}
                        onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="all">All Locations (Kenya)</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.name}>
                            {l.name} ({l.county})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category + CTA */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <select
                          value={searchParams.category}
                          onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                          className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="all">All Categories</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center shrink-0"
                      >
                        Search Jobs
                      </button>
                    </div>
                  </div>
                </form>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                  <span className="font-semibold text-slate-300">Popular Sectors:</span>
                  {['Security', 'Technology / IT', 'Hospitality', 'Construction', 'Driving', 'Sales'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchParams({ ...searchParams, category: tag });
                        navigateTo('jobs');
                      }}
                      className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* HOW IT WORKS (4 STEPS) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Application Flow
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                  How Kazi Link Kenya Works
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Four simple, transparent steps to get your CV directly into the hands of Kenyan recruiters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Create Free Profile</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Register with your email, phone, and Kenyan town. Add your career summary, education, and skills.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Upload Your CV</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Attach your CV in PDF, DOC, or DOCX format. Stored privately and securely in encrypted storage.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Find & Apply</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Explore verified openings matching your qualifications across all counties in Kenya.
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-xs relative space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                    4
                  </div>
                  <h3 className="font-bold text-emerald-950 text-base">M-Pesa Verification</h3>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Submit your application with a flat <strong>KSh 150</strong> processing fee via Safaricom M-Pesa (Pochi la Biashara / Manual verification).
                  </p>
                </div>
              </div>
            </section>

            {/* FEATURED / LATEST VACANCIES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Latest Openings
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                    Featured Job Vacancies
                  </h2>
                </div>
                <button
                  onClick={() => navigateTo('jobs')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
                >
                  View All Openings ({vacancies.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoadingJobs ? (
                <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                  <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-semibold">Loading verified vacancies...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vacancies.slice(0, 6).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelect={(j) => setSelectedJob(j)}
                      hasApplied={appliedJobIds.has(job.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* TRANSPARENCY & PRICING BREAKDOWN */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
                <div className="max-w-3xl space-y-6">
                  <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    TRANSPARENCY GUARANTEE
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black font-serif text-white leading-tight">
                    Fair, Predictable & Transparent Pricing
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Kazi Link Kenya operates independently to provide Kenyan job seekers with a secure, spam-free employment gateway. Browsing, searching, profile management, and CV uploading are always 100% free.
                  </p>

                  {/* Free vs Paid Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        100% Free Always
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Browse all vacancies & filters
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Create and update your profile
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Secure CV cloud storage
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Track application statuses
                        </li>
                      </ul>
                    </div>

                    <div className="bg-emerald-900/60 rounded-2xl p-4 border border-emerald-600/50 space-y-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        KSh 150 Per Application
                      </span>
                      <ul className="text-xs text-slate-200 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          Payable only when you submit
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          Official Safaricom M-Pesa STK Push
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          Instant payment verification code
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          Application delivery to hiring team
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. JOBS SEARCH VIEW */}
        {/* ========================================================================= */}
        {currentView === 'jobs' && (
          <JobsView
            jobs={vacancies}
            categories={categories}
            locations={locations}
            appliedJobIds={appliedJobIds}
            onSelectJob={(j) => setSelectedJob(j)}
            initialCategory={searchParams.category}
            initialLocation={searchParams.location}
            initialKeyword={searchParams.keyword}
          />
        )}

        {/* ========================================================================= */}
        {/* 3. CATEGORIES VIEW */}
        {/* ========================================================================= */}
        {currentView === 'categories' && (
          <CategoriesView
            categories={categories}
            onSelectCategory={(catName) => {
              setSearchParams({ ...searchParams, category: catName });
              navigateTo('jobs');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* 4. PROFILE VIEW */}
        {/* ========================================================================= */}
        {currentView === 'profile' && (
          user ? (
            <ProfileView />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-md space-y-4">
              <Users className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 font-serif">Sign in to Access Profile</h2>
              <p className="text-xs text-slate-500">
                Please sign in or create a free job seeker account to manage your profile and upload your CV.
              </p>
              <button
                onClick={() => openAuth('login')}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* 5. MY APPLICATIONS VIEW */}
        {/* ========================================================================= */}
        {currentView === 'my-applications' && (
          user ? (
            <MyApplicationsView
              onBrowseJobs={() => navigateTo('jobs')}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-md space-y-4">
              <FileText className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 font-serif">Sign in to View Applications</h2>
              <p className="text-xs text-slate-500">
                Sign in to view your submitted job applications and M-Pesa receipts.
              </p>
              <button
                onClick={() => openAuth('login')}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {/* ========================================================================= */}
        {/* 6. ADMIN DASHBOARD */}
        {/* ========================================================================= */}
        {currentView === 'admin' && <AdminDashboard />}

        {/* ========================================================================= */}
        {/* 7. ABOUT VIEW */}
        {/* ========================================================================= */}
        {currentView === 'about' && (
          <AboutView
            onBrowseJobs={() => navigateTo('jobs')}
            openAuthModal={openAuth}
          />
        )}

        {/* ========================================================================= */}
        {/* 8. CONTACT VIEW */}
        {/* ========================================================================= */}
        {currentView === 'contact' && <ContactView />}

        {/* ========================================================================= */}
        {/* 9. PRIVACY & TERMS */}
        {/* ========================================================================= */}
        {currentView === 'privacy' && <PrivacyPolicyView />}
        {currentView === 'terms' && <TermsOfServiceView />}
      </main>

      {/* MODALS */}
      {/* 1. Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyClick}
          hasApplied={appliedJobIds.has(selectedJob.id)}
          openAuthModal={openAuth}
        />
      )}

      {/* 2. Job Application Modal with M-Pesa Payment Flow */}
      {applyingJob && (
        <ApplicationModal
          job={applyingJob}
          isOpen={Boolean(applyingJob)}
          onClose={() => setApplyingJob(null)}
          onSuccess={handleApplicationSuccess}
          openAuthModal={() => openAuth('login')}
        />
      )}

      {/* 3. Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Universal Footer */}
      <Footer
        onNavigate={navigateTo}
        openAuthModal={openAuth}
        openAdminModal={() => openAuth('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
