import React from 'react';
import { JobVacancy } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Building, 
  Calendar, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  FileCheck2, 
  ArrowRight,
  ShieldCheck,
  Share2,
  ExternalLink,
  Award
} from 'lucide-react';

interface JobDetailsModalProps {
  job: JobVacancy | null;
  isOpen?: boolean;
  onClose: () => void;
  onApply: (job: JobVacancy) => void;
  hasApplied: boolean;
  openAuthModal?: (mode: 'login' | 'register') => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen = true,
  onClose,
  onApply,
  hasApplied,
  openAuthModal,
}) => {
  const { user, profile } = useAuth();

  if (!isOpen || !job) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Open until filled';
    try {
      return new Date(dateStr).toLocaleDateString('en-KE', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.organization}`,
        text: `Apply for ${job.title} in ${job.location} on Kazi Link Kenya.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  return (
    <div 
      id="job-details-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="job-details-modal-content"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/90 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {job.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {job.job_type}
              </span>
              {hasApplied && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Application Submitted
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{job.organization}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              id="close-job-details-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-800">
          {/* Key Facts Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Location & County</p>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{job.location}{job.county ? ` (${job.county})` : ''}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Salary Range</p>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Banknote className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{job.salary_range}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Posted Date</p>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{formatDate(job.created_at)}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Deadline</p>
              <p className="text-sm font-bold text-rose-700 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="truncate">{formatDate(job.closing_date)}</span>
              </p>
            </div>
          </div>

          {/* Experience Required Banner (if available) */}
          {job.experience_required && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900">
              <Award className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Experience Required:</strong> {job.experience_required}
              </span>
            </div>
          )}

          {/* Job Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Position Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Key Duties & Responsibilities
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Requirements & Experience
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Academic & Professional Qualifications
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {job.qualifications.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Employer Application Method & Original Advert */}
          {(job.application_info || job.application_link || job.source_url) && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3">
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-700 shrink-0" />
                  Direct Employer Application & Source
                </p>
                {job.application_info && (
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {job.application_info}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {job.application_link && (
                  <a
                    id="job-external-application-link"
                    href={job.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors"
                  >
                    <span>Employer Portal / Apply Link</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                )}

                {job.source_url && (
                  <a
                    id="job-original-source-link"
                    href={job.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                  >
                    <span>Original Job Advert</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Application Info & Transparency Note */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Kazi Link Application Note
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              Applying for this position requires an active CV. A standard platform processing fee of <strong className="font-bold text-emerald-900">KSh 150</strong> is payable via Safaricom M-Pesa at final submission.
            </p>
          </div>
        </div>

        {/* Modal Footer / Action CTA */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200/80 px-6 py-4 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {hasApplied ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                You have already applied for this job.
              </span>
            ) : user ? (
              <span>Your profile: <strong>{profile?.full_name || user.email}</strong></span>
            ) : (
              <span>Create an account or login to submit your application.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            {hasApplied ? (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4" />
                Already Applied
              </button>
            ) : user ? (
              <button
                id="apply-job-now-btn"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="apply-login-required-btn"
                onClick={() => {
                  onClose();
                  openAuthModal('login');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Log In to Apply <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
