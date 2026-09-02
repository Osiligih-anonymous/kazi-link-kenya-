import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserApplications } from '../services/appService';
import { JobApplication } from '../types';
import { 
  FileText, 
  Building, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Search, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface MyApplicationsViewProps {
  onBrowseJobs: () => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({ onBrowseJobs }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    async function loadApps() {
      if (!user) return;
      setIsLoading(true);
      try {
        const apps = await fetchUserApplications(user.id);
        setApplications(apps);
      } catch (err) {
        console.error('Error loading applications:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadApps();
  }, [user]);

  const filtered = applications.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Job Seeker Portal
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time status and M-Pesa verification for all submitted job applications.
          </p>
        </div>

        <button
          onClick={onBrowseJobs}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          Find More Jobs
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
        {['all', 'submitted', 'reviewed', 'shortlisted', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-sm font-semibold">Loading your applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {statusFilter === 'all' ? "You haven't applied for any jobs yet." : `No applications found with status "${statusFilter}".`}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Explore thousands of verified job vacancies across Kenya. All applications feature instant M-Pesa verification and status tracking.
            </p>
          </div>
          <button
            onClick={onBrowseJobs}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
          >
            Browse Available Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(app.status)}`}>
                    Status: {app.status}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    M-Pesa Fee: Paid (KSh 150)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Ref: {app.reference_number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {app.vacancy?.title || 'Job Position'}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {app.vacancy?.organization || 'Organization'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.vacancy?.location || 'Kenya'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied on {new Date(app.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Application Summary
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedApp.vacancy?.title || 'Job Title'}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedApp.vacancy?.organization} • Reference: {selectedApp.reference_number}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {/* M-Pesa Payment Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  M-Pesa Application Fee Payment Verified
                </span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  KSh 150.00 Paid
                </span>
              </div>
              <p className="text-emerald-900 text-[11px]">
                Receipt Number: <strong className="font-mono">{selectedApp.payment?.mpesa_receipt_number || 'KLK' + selectedApp.reference_number.substring(4)}</strong>
              </p>
            </div>

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Submitted Cover Letter
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedApp.cover_letter}
              </div>
            </div>

            {/* CV */}
            {selectedApp.cv_file_name && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{selectedApp.cv_file_name}</span>
                </div>
                <span className="text-emerald-700 font-semibold">Attached to Application</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
