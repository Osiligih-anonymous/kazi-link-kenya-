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
  getCVDataUrl
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
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'seekers' | 'payments' | 'categories'>('overview');

  // Stats & Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    loadAllData();
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
    return a.status === appFilterStatus;
  });

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
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
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
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold capitalize">
                    {app.status}
                  </span>
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
                <option value="all">All Statuses</option>
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        KSh 150 (M-Pesa Verified)
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={a.status}
                        onChange={(e) => handleAppStatusChange(a.id, e.target.value as ApplicationStatus)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-[11px] bg-white capitalize"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => setSelectedApp(a)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        View CV & Details
                      </button>
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
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {p.status}
                      </span>
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

            {/* Verified Payment Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-950">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                M-Pesa Verified Fee: KSh 150.00
              </span>
              <span className="font-mono text-[11px]">
                Receipt: {selectedApp.payment?.mpesa_receipt_number || 'KLK' + selectedApp.reference_number.substring(4)}
              </span>
            </div>

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
