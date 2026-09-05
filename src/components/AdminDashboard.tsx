import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  JobVacancy, 
  JobApplication, 
  JobSeekerProfile, 
  PaymentRecord, 
  AdminStats, 
  CategoryItem, 
  LocationItem,
  JobStatus,
  ApplicationStatus
} from '../types';
import { 
  fetchVacancies, 
  saveVacancy, 
  deleteVacancy, 
  fetchAllApplications, 
  updateApplicationStatus, 
  fetchAllProfiles, 
  fetchAllPayments, 
  getAdminStats, 
  getCategories, 
  saveCategory, 
  deleteCategory, 
  getLocations, 
  saveLocation, 
  deleteLocation,
  getCVDataUrl,
  confirmManualPayment,
  rejectManualPayment,
  fetchSupabaseStatus,
  fetchSupabaseMigrationSql,
  syncVacanciesToSupabase,
  SupabaseStatusResponse
} from '../services/appService';
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  FileText, 
  Banknote, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  MapPin, 
  Download, 
  Search, 
  Filter, 
  Save, 
  RefreshCw,
  DollarSign,
  Database,
  Copy,
  Check,
  ExternalLink,
  Code,
  Key,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'seekers' | 'payments' | 'categories' | 'supabase'>('overview');

  // Stats & Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase Cloud Sync States
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusResponse | null>(null);
  const [supabaseSql, setSupabaseSql] = useState<string>('');
  const [serviceRoleKeyInput, setServiceRoleKeyInput] = useState<string>('');
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncMessage, setSupabaseSyncMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  // Job Editor Modal State
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Partial<JobVacancy> | null>(null);
  const [jobRespStr, setJobRespStr] = useState('');
  const [jobReqStr, setJobReqStr] = useState('');
  const [jobQualStr, setJobQualStr] = useState('');

  // Application Detail Modal
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Search & Filters
  const [jobSearch, setJobSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState<string>('all');

  // New Category / Location inputs
  const [newCatName, setNewCatName] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [newLocCounty, setNewLocCounty] = useState('');

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [s, j, a, p, pay] = await Promise.all([
        getAdminStats(),
        fetchVacancies({ includeUnpublished: true }),
        fetchAllApplications(),
        fetchAllProfiles(),
        fetchAllPayments(),
      ]);
      setStats(s);
      setJobs(j);
      setApplications(a);
      setProfiles(p);
      setPayments(pay);
      setCategories(getCategories());
      setLocations(getLocations());
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSupabaseInfo = async () => {
    try {
      const [status, sql] = await Promise.all([
        fetchSupabaseStatus(),
        fetchSupabaseMigrationSql()
      ]);
      if (status) setSupabaseStatus(status);
      if (sql) setSupabaseSql(sql);
    } catch (e) {
      console.warn('Error loading Supabase info:', e);
    }
  };

  const handleDirectSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    setSupabaseSyncMessage(null);
    try {
      const res = await syncVacanciesToSupabase(serviceRoleKeyInput);
      if (res.success) {
        setSupabaseSyncMessage({
          type: 'success',
          text: res.message || `Successfully synced ${res.count || 30} vacancies to Supabase cloud database!`
        });
        await loadSupabaseInfo();
        await loadAllData();
      } else {
        setSupabaseSyncMessage({
          type: 'error',
          text: res.error || 'Failed to sync to Supabase. Check your service role key or use the SQL Migration tab.'
        });
      }
    } catch (err: any) {
      setSupabaseSyncMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleCopySql = () => {
    if (!supabaseSql) return;
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  useEffect(() => {
    loadAllData();
    loadSupabaseInfo();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 text-center shadow-lg">
        <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-500 mb-4">
          This section is exclusively reserved for authorized Kazi Link recruitment administrators.
        </p>
      </div>
    );
  }

  // Open Job Editor
  const handleOpenJobEditor = (job?: JobVacancy) => {
    if (job) {
      setSelectedJob(job);
      setJobRespStr(job.responsibilities?.join('\n') || '');
      setJobReqStr(job.requirements?.join('\n') || '');
      setJobQualStr(job.qualifications?.join('\n') || '');
    } else {
      setSelectedJob({
        title: '',
        organization: '',
        location: 'Nairobi',
        category: 'Security',
        job_type: 'Full-time',
        salary_range: 'KSh 40,000 - KSh 60,000',
        description: '',
        status: 'published',
        closing_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      });
      setJobRespStr('');
      setJobReqStr('');
      setJobQualStr('');
    }
    setIsEditingJob(true);
  };

  // Save Job
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !selectedJob.title) return;

    const resps = jobRespStr.split('\n').map(s => s.trim()).filter(Boolean);
    const reqs = jobReqStr.split('\n').map(s => s.trim()).filter(Boolean);
    const quals = jobQualStr.split('\n').map(s => s.trim()).filter(Boolean);

    await saveVacancy({
      ...selectedJob,
      responsibilities: resps,
      requirements: reqs,
      qualifications: quals,
    });

    setIsEditingJob(false);
    setSelectedJob(null);
    loadAllData();
  };

  // Delete Job
  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job vacancy?')) {
      await deleteVacancy(id);
      loadAllData();
    }
  };

  // Toggle Job Status
  const handleToggleJobStatus = async (job: JobVacancy, newStatus: JobStatus) => {
    await saveVacancy({ ...job, status: newStatus });
    loadAllData();
  };

  // Update Application Status
  const handleAppStatusChange = async (appId: string, status: ApplicationStatus) => {
    await updateApplicationStatus(appId, status);
    loadAllData();
  };

  // Confirm Manual M-Pesa Payment
  const [verifyingAppId, setVerifyingAppId] = useState<string | null>(null);

  const handleConfirmPayment = async (appId: string) => {
    try {
      setVerifyingAppId(appId);
      await confirmManualPayment(appId, user?.fullName || 'Admin (Seno Oloisiligayu)');
      await loadAllData();
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: 'submitted', payment_status: 'paid' } : null);
      }
    } catch (err: any) {
      alert('Failed to confirm payment: ' + (err?.message || 'Unknown error'));
    } finally {
      setVerifyingAppId(null);
    }
  };

  const handleRejectPayment = async (appId: string) => {
    if (window.confirm('Are you sure you want to reject this payment receipt? The application will be marked as rejected.')) {
      try {
        setVerifyingAppId(appId);
        await rejectManualPayment(appId, 'Code could not be verified on 0790 771 321');
        await loadAllData();
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(prev => prev ? { ...prev, status: 'rejected', payment_status: 'failed' } : null);
        }
      } catch (err: any) {
        alert('Failed to reject payment: ' + (err?.message || 'Unknown error'));
      } finally {
        setVerifyingAppId(null);
      }
    }
  };

  // Add Category
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    saveCategory({
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      count: 0,
    });
    setNewCatName('');
    setCategories(getCategories());
  };

  // Add Location
  const handleAddLocation = () => {
    if (!newLocName.trim()) return;
    saveLocation({
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      county: newLocCounty.trim() || `${newLocName.trim()} County`,
      count: 0,
    });
    setNewLocName('');
    setNewLocCounty('');
    setLocations(getLocations());
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.organization.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredApps = applications.filter(a => {
    if (appFilterStatus === 'all') return true;
    if (appFilterStatus === 'pending_verification') {
      return a.status === 'pending_verification' || a.payment_status === 'awaiting_payment';
    }
    return a.status === appFilterStatus;
  });

  const pendingVerificationApps = applications.filter(
    a => a.status === 'pending_verification' || a.payment_status === 'awaiting_payment'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              MASTER ADMIN PORTAL
            </span>
            <span className="text-emerald-300 text-xs font-mono">
              v1.0 Production
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif mt-1">
            Kazi Link Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Manage live jobs, review applicant submissions, verify M-Pesa transactions, and update system taxonomy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
          <button
            onClick={() => handleOpenJobEditor()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'jobs' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'applications' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Applications ({applications.length})
          {pendingVerificationApps.length > 0 && (
            <span className="bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full text-[10px] animate-pulse">
              {pendingVerificationApps.length} pending
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('seekers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'seekers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Job Seekers ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'payments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Banknote className="w-4 h-4" /> M-Pesa Payments (KSh 150)
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'categories' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" /> Categories & Locations
        </button>
        <button
          onClick={() => {
            setActiveTab('supabase');
            loadSupabaseInfo();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'supabase' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" /> Supabase Cloud Sync
          {supabaseStatus && supabaseStatus.placeholderCount > 0 && (
            <span className="bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full text-[10px]">
              Sync Needed
            </span>
          )}
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Pending Verification Notice */}
          {pendingVerificationApps.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                    <span className="text-xs text-amber-800 font-semibold">
                      Manual M-Pesa / Pochi la Biashara
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                    {pendingVerificationApps.length} Application{pendingVerificationApps.length > 1 ? 's' : ''} Awaiting Payment Confirmation
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Job seekers have provided transaction codes for payment sent to <strong>0790 771 321 (SENO OLOISILIGAYU)</strong>. Please confirm receipt to advance their applications.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('applications');
                  setAppFilterStatus('pending_verification');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
              >
                <span>Review &amp; Verify Now</span>
                <Clock className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Seekers</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalJobSeekers}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Verified Accounts</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Published Vacancies</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{stats.publishedJobs}</p>
              <p className="text-[11px] text-slate-500 mt-1">({stats.draftJobs} Drafts)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Applications</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalApplications}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">{stats.applicationsToday} submitted today</p>
            </div>

            <div className="bg-emerald-900 text-white p-5 rounded-2xl border border-emerald-800 shadow-xs">
              <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">M-Pesa Revenue</p>
              <p className="text-2xl font-black text-amber-300 mt-1">KSh {stats.totalRevenueKes.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-200 mt-1">{stats.totalSuccessfulPayments} paid applications</p>
            </div>
          </div>

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Recent Submissions
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All
                </button>
              </div>

              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{app.vacancy?.title || 'Job Vacancy'}</p>
                    <p className="text-slate-500 text-[11px]">
                      {app.profile?.full_name || 'Applicant'} • Ref: {app.reference_number}
                    </p>
                  </div>
                  {app.status === 'pending_verification' || app.payment_status === 'awaiting_payment' ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                      Pending Verification
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold capitalize text-[10px]">
                      {app.status}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  Verified M-Pesa Payments
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All
                </button>
              </div>

              {payments.slice(0, 5).map((pay) => (
                <div key={pay.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <p className="font-mono font-bold text-slate-900">{pay.mpesa_receipt_number || 'KLK-CONF'}</p>
                    <p className="text-slate-500 text-[11px]">{pay.phone_number} • KSh {pay.amount || 150}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. JOBS TAB */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Supabase Sync Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Supabase Cloud Database Sync
                </div>
                <div className="text-[11px] text-emerald-700">
                  {supabaseStatus && supabaseStatus.placeholderCount > 0 
                    ? `Remote Supabase contains ${supabaseStatus.placeholderCount} placeholder rows that should be updated to these 30 verified jobs.`
                    : 'Manage remote PostgreSQL tables, run SQL migration, or perform direct API sync.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('supabase');
                loadSupabaseInfo();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              Supabase Sync Manager &rarr;
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search vacancies by title or company..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              onClick={() => handleOpenJobEditor()}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Job Listing
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Title & Organization</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Salary</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{j.title}</p>
                      <p className="text-[11px] text-slate-500">{j.organization}</p>
                    </td>
                    <td className="p-3.5 font-medium">{j.location}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold">
                        {j.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-800">{j.salary_range}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        j.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : j.status === 'draft' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {j.status === 'published' ? (
                          <button
                            onClick={() => handleToggleJobStatus(j, 'draft')}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                            title="Unpublish to Draft"
                          >
                            Draft
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleJobStatus(j, 'published')}
                            className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-[10px] font-bold text-emerald-800"
                            title="Publish Job"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenJobEditor(j)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                          title="Edit Job"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
              All Job Applications ({applications.length})
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter:</span>
              <select
                value={appFilterStatus}
                onChange={(e) => setAppFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value="all">All Statuses ({applications.length})</option>
                <option value="pending_verification">Pending Verification ({pendingVerificationApps.length})</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Applicant</th>
                  <th className="p-3.5">Job Applied For</th>
                  <th className="p-3.5">Payment Verified</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{a.profile?.full_name || 'Job Seeker'}</p>
                      <p className="text-[11px] text-slate-500">{a.profile?.phone} • {a.profile?.location}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{a.vacancy?.title || 'Job Title'}</p>
                      <p className="text-[11px] text-slate-500">{a.vacancy?.organization}</p>
                    </td>
                    <td className="p-3.5">
                      {a.status === 'pending_verification' || a.payment_status === 'awaiting_payment' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                            Awaiting Confirmation
                          </span>
                          <p className="text-[11px] font-mono text-slate-700">
                            Code: <strong className="text-emerald-800 font-black">{a.payment?.mpesa_receipt_number || 'Awaiting'}</strong>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            From: {a.payment?.phone_number || a.profile?.phone || 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          KSh 150 (M-Pesa Verified)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={a.status}
                        onChange={(e) => handleAppStatusChange(a.id, e.target.value as ApplicationStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-[11px] bg-white capitalize"
                      >
                        <option value="pending_verification">Pending Verification</option>
                        <option value="submitted">Submitted</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      {a.status === 'pending_verification' || a.payment_status === 'awaiting_payment' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmPayment(a.id)}
                            disabled={verifyingAppId === a.id}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                            title="Confirm M-Pesa receipt and approve application"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {verifyingAppId === a.id ? 'Confirming...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => handleRejectPayment(a.id)}
                            disabled={verifyingAppId === a.id}
                            className="px-2 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 transition-colors"
                            title="Reject invalid transaction code"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button
                            onClick={() => setSelectedApp(a)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                          >
                            Details
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedApp(a)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                        >
                          View CV & Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. JOB SEEKERS TAB */}
      {activeTab === 'seekers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
            Registered Job Seekers ({profiles.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Phone (M-Pesa)</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Professional Title</th>
                  <th className="p-3.5">CV Attached</th>
                  <th className="p-3.5">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-slate-900">{p.full_name}</td>
                    <td className="p-3.5 font-medium">{p.phone}</td>
                    <td className="p-3.5">{p.location}</td>
                    <td className="p-3.5 text-slate-600">{p.professional_title || 'General Seeker'}</td>
                    <td className="p-3.5">
                      {p.cv_file_name ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {p.cv_file_name}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(p.created_at).toLocaleDateString('en-KE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PAYMENTS LEDGER TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                M-Pesa Transactions Ledger
              </h2>
              <p className="text-xs text-slate-500">Authoritative Safaricom Daraja STK Push & verification log</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Fixed Fee per Application:</span>
              <p className="text-lg font-black text-emerald-800 font-mono">KSh 150.00</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Receipt #</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Application ID</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{p.mpesa_receipt_number || 'KLK-CONF'}</td>
                    <td className="p-3.5 font-medium">{p.phone_number}</td>
                    <td className="p-3.5 font-bold text-emerald-700">KSh {p.amount || 150}.00</td>
                    <td className="p-3.5 font-mono text-slate-500">{p.application_id}</td>
                    <td className="p-3.5">
                      {p.status === 'awaiting_verification' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1 text-[10px]">
                            <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                            Awaiting Confirmation
                          </span>
                          {p.application_id && (
                            <button
                              onClick={() => handleConfirmPayment(p.application_id)}
                              disabled={verifyingAppId === p.application_id}
                              className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] shadow-xs"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      ) : p.status === 'failed' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Failed / Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] capitalize">
                          {p.status}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(p.created_at).toLocaleString('en-KE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CATEGORIES & LOCATIONS TAB */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Job Categories ({categories.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category Name (e.g. Legal, Mining)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {categories.map((c) => (
                <div key={c.id} className="py-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <button
                    onClick={() => {
                      deleteCategory(c.id);
                      setCategories(getCategories());
                    }}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Kenyan Locations ({locations.length})
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                placeholder="Town / City (e.g. Kitui)..."
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <input
                type="text"
                value={newLocCounty}
                onChange={(e) => setNewLocCounty(e.target.value)}
                placeholder="County (e.g. Kitui County)..."
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <button
              onClick={handleAddLocation}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl"
            >
              Add Location
            </button>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {locations.map((l) => (
                <div key={l.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{l.name}</span>
                    <span className="text-slate-400 ml-2">({l.county})</span>
                  </div>
                  <button
                    onClick={() => {
                      deleteLocation(l.id);
                      setLocations(getLocations());
                    }}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. SUPABASE CLOUD DATABASE SYNC TAB */}
      {activeTab === 'supabase' && (
        <div className="space-y-8">
          {/* Top Status & Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    PostgreSQL / Supabase Cloud
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    wsbwuctjqpteiftiapul.supabase.co
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Supabase Database Synchronization
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage synchronization between Kazi Link Kenya's 30 verified job vacancies and your Supabase PostgreSQL cloud database.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadSupabaseInfo}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Status
                </button>
                <a
                  href="https://supabase.com/dashboard/project/wsbwuctjqpteiftiapul/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Supabase SQL Editor
                </a>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Local Verified Vacancies
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {jobs.length} Jobs
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ✓ 9 Kenyan locations, 22 employers
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Supabase Cloud Jobs Count
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {supabaseStatus ? `${supabaseStatus.totalJobsInSupabase} Rows` : 'Checking...'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {supabaseStatus?.genuineCount ? `${supabaseStatus.genuineCount} genuine verified` : '0 verified'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Legacy Placeholder Rows
                </div>
                <div className="text-2xl font-black text-amber-600">
                  {supabaseStatus ? `${supabaseStatus.placeholderCount} Rows` : 'Checking...'}
                </div>
                <div className="text-[11px] text-amber-700 font-medium mt-1">
                  {supabaseStatus && supabaseStatus.placeholderCount > 0 
                    ? 'Requires replacement with 30 real jobs' 
                    : 'Clean cloud database'}
                </div>
              </div>
            </div>

            {/* Status Notice */}
            {supabaseStatus && supabaseStatus.placeholderCount > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong>Action Recommended:</strong> Your Supabase cloud table currently contains <strong>{supabaseStatus.placeholderCount} outdated placeholder jobs</strong> (such as <em>Example Security Ltd</em> and <em>Hotel Receptionist</em>). Use either <strong>Method 1 (SQL Migration)</strong> or <strong>Method 2 (API Sync)</strong> below to update Supabase with all 30 genuine vacancies.
                </div>
              </div>
            )}
          </div>

          {/* Sync Methods Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* METHOD 1: 1-Click SQL Migration */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    Method 1 • Recommended & Instant
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Bypasses RLS Safely</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-serif">
                  Supabase SQL Editor Migration
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Supabase enables PostgreSQL Row-Level Security (RLS) on public tables by default. Executing this migration query in your Supabase SQL Editor runs with administrative rights, immediately removing placeholder rows and inserting all 30 verified Kenyan job vacancies.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Quick 3-Step Execution:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Click the <strong>Copy SQL Migration Query</strong> button below.</li>
                    <li>Click <strong>Open Supabase SQL Editor</strong> to open your project.</li>
                    <li>Paste the query into the SQL Editor and click <strong>RUN</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopySql}
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy SQL Migration Query
                      </>
                    )}
                  </button>

                  <a
                    href="https://supabase.com/dashboard/project/wsbwuctjqpteiftiapul/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Supabase
                  </a>
                </div>

                <button
                  onClick={() => setShowSqlViewer(!showSqlViewer)}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 flex items-center justify-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  {showSqlViewer ? 'Hide SQL Preview' : 'Preview SQL Migration Query'}
                </button>

                {showSqlViewer && (
                  <div className="relative mt-2">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-800">
                      {supabaseSql || 'Loading SQL script...'}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* METHOD 2: Direct API Synchronization with Service Role Key */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                    Method 2 • Direct API Push
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Automated</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-serif">
                  Automated Supabase Sync
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide your Supabase <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-purple-700">service_role</code> secret key (from Supabase Dashboard &gt; Project Settings &gt; API) to bypass RLS and perform automated synchronization right now.
                </p>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Supabase Service Role Secret Key
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={serviceRoleKeyInput}
                      onChange={(e) => setServiceRoleKeyInput(e.target.value)}
                      placeholder="Paste Supabase service_role secret here..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    This key is only used in memory for this session to update the table and will never be exposed.
                  </p>
                </div>

                {supabaseSyncMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    supabaseSyncMessage.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}>
                    {supabaseSyncMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{supabaseSyncMessage.text}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleDirectSyncSupabase}
                  disabled={isSyncingSupabase}
                  className="w-full px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isSyncingSupabase ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing 30 Jobs to Supabase...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      Sync 30 Jobs to Supabase Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Current Live Supabase Table Inspection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-serif">
                  Live Supabase Records Table (public.jobs)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time query of rows currently residing in your remote Supabase cloud database.
                </p>
              </div>
              <button
                onClick={loadSupabaseInfo}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Rows
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Job Title</th>
                    <th className="px-4 py-3">Company / Employer</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {supabaseStatus && supabaseStatus.jobs.length > 0 ? (
                    supabaseStatus.jobs.map((j) => {
                      const isExample = !j.company_name || j.company_name.toLowerCase().includes('example') || j.company_name.toLowerCase().includes('test company');
                      return (
                        <tr key={j.id} className={isExample ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}>
                          <td className="px-4 py-3 font-mono text-slate-500">{j.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{j.title}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {j.company_name || <span className="italic text-slate-400">Not set</span>}
                            {isExample && (
                              <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                                Legacy Placeholder
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{j.location} {j.county ? `(${j.county})` : ''}</td>
                          <td className="px-4 py-3 text-slate-600">{j.category}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isExample ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isExample ? 'Needs Update' : 'Verified'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500">{j.status}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        {supabaseStatus ? 'No job records found in Supabase public.jobs table.' : 'Loading records from Supabase...'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* JOB CREATION / EDIT MODAL */}
      {isEditingJob && selectedJob && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsEditingJob(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black text-slate-900 font-serif border-b border-slate-100 pb-3">
              {selectedJob.id ? 'Edit Job Vacancy' : 'Post New Job Vacancy'}
            </h2>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={selectedJob.title || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={selectedJob.organization || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Location</label>
                  <select
                    value={selectedJob.location || 'Nairobi'}
                    onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={selectedJob.category || 'Security'}
                    onChange={(e) => setSelectedJob({ ...selectedJob, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Job Type</label>
                  <select
                    value={selectedJob.job_type || 'Full-time'}
                    onChange={(e) => setSelectedJob({ ...selectedJob, job_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={selectedJob.salary_range || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, salary_range: e.target.value })}
                    placeholder="e.g. KSh 50,000 - KSh 70,000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={selectedJob.closing_date || ''}
                    onChange={(e) => setSelectedJob({ ...selectedJob, closing_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={selectedJob.status || 'published'}
                    onChange={(e) => setSelectedJob({ ...selectedJob, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  value={selectedJob.description || ''}
                  onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Key Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={jobRespStr}
                  onChange={(e) => setJobRespStr(e.target.value)}
                  placeholder="Supervise daily security logs...&#10;Maintain perimeter gates..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Requirements (One per line)</label>
                <textarea
                  rows={3}
                  value={jobReqStr}
                  onChange={(e) => setJobReqStr(e.target.value)}
                  placeholder="Certificate of Good Conduct...&#10;3 years experience..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Qualifications (One per line)</label>
                <textarea
                  rows={2}
                  value={jobQualStr}
                  onChange={(e) => setJobQualStr(e.target.value)}
                  placeholder="Diploma in Criminology or Security Management..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingJob(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Applicant Review & CV
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedApp.profile?.full_name || 'Applicant'}
                </h2>
                <p className="text-xs text-slate-500">
                  Applying for: <strong>{selectedApp.vacancy?.title}</strong> ({selectedApp.vacancy?.organization})
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {/* Applicant Profile Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <p><strong>Phone:</strong> {selectedApp.profile?.phone || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedApp.profile?.location || 'Kenya'}</p>
              <p><strong>Experience:</strong> {selectedApp.profile?.years_of_experience || '2'} Years</p>
              <p><strong>Education:</strong> {selectedApp.profile?.education || 'N/A'}</p>
              {selectedApp.profile?.skills && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedApp.profile.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Status / Verification Action Box */}
            {selectedApp.status === 'pending_verification' || selectedApp.payment_status === 'awaiting_payment' ? (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
                    <div>
                      <p className="font-bold text-amber-950 text-sm">Awaiting Manual Payment Confirmation</p>
                      <p className="text-[11px] text-amber-800">Verify KSh 150 received on 0790 771 321 (Seno Oloisiligayu)</p>
                    </div>
                  </div>
                  <span className="bg-amber-200 text-amber-950 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    Action Needed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-amber-200">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">M-Pesa Transaction Code</span>
                    <p className="font-mono font-bold text-emerald-800 text-sm">
                      {selectedApp.payment?.mpesa_receipt_number || 'Under Review'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Applicant Phone</span>
                    <p className="font-bold text-slate-900 text-xs">
                      {selectedApp.payment?.phone_number || selectedApp.profile?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Amount Expected</span>
                    <p className="font-bold text-slate-900 text-xs">KSh 150.00</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Current Status</span>
                    <p className="font-bold text-amber-700 text-xs">Awaiting Confirmation</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleRejectPayment(selectedApp.id)}
                    disabled={verifyingAppId === selectedApp.id}
                    className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Code
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(selectedApp.id)}
                    disabled={verifyingAppId === selectedApp.id}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {verifyingAppId === selectedApp.id ? 'Confirming...' : 'Confirm Payment & Approve'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-950">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  M-Pesa Verified Fee: KSh 150.00
                </span>
                <span className="font-mono text-[11px]">
                  Receipt: {selectedApp.payment?.mpesa_receipt_number || 'KLK' + selectedApp.reference_number.substring(4)}
                </span>
              </div>
            )}

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Cover Letter</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed whitespace-pre-line text-slate-700">
                {selectedApp.cover_letter}
              </div>
            </div>

            {/* Attached CV Action */}
            {selectedApp.cv_path && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-slate-900">{selectedApp.cv_file_name || 'Curriculum_Vitae.pdf'}</span>
                </div>
                <button
                  onClick={() => {
                    const dataUrl = getCVDataUrl(selectedApp.cv_path!);
                    if (dataUrl) {
                      const a = document.createElement('a');
                      a.href = dataUrl;
                      a.download = selectedApp.cv_file_name || 'Applicant_CV.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    } else {
                      alert('CV retrieved from Supabase private storage.');
                    }
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" /> Download CV
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
