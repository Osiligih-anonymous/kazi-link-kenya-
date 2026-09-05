import React from 'react';
import { JobVacancy } from '../types';
import { MapPin, Briefcase, Calendar, Banknote, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: JobVacancy;
  onSelect: (job: JobVacancy) => void;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, hasApplied }) => {
  // Format posted date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'security':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'technology / it':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'hospitality':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'driving':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'retail':
      case 'sales':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'healthcare':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'agriculture':
        return 'bg-lime-50 text-lime-800 border-lime-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      id={`job-card-${job.id}`}
      onClick={() => onSelect(job)}
      className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-500/60 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div>
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(job.category)}`}>
              {job.category}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {job.job_type}
            </span>
          </div>

          {hasApplied && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Applied
            </span>
          )}
        </div>

        {/* Title & Organization */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
          {job.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mt-1 mb-3">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{job.organization}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Meta details & Action */}
      <div className="pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium truncate" title={`${job.location}${job.county ? `, ${job.county}` : ''}`}>
              {job.location}{job.county ? ` (${job.county.replace(' County', '')})` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-bold text-slate-800 truncate">{job.salary_range}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {formatDate(job.created_at)}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform">
            View Job <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
