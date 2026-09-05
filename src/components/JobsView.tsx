import React, { useState } from 'react';
import { JobVacancy, CategoryItem, LocationItem } from '../types';
import { JobCard } from './JobCard';
import { 
  Search, 
  MapPin, 
  Layers, 
  Briefcase, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Clock,
  Sparkles,
  Filter
} from 'lucide-react';

interface JobsViewProps {
  jobs: JobVacancy[];
  categories: CategoryItem[];
  locations: LocationItem[];
  appliedJobIds: Set<string>;
  onSelectJob: (job: JobVacancy) => void;
  initialCategory?: string;
  initialLocation?: string;
  initialKeyword?: string;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  categories,
  locations,
  appliedJobIds,
  onSelectJob,
  initialCategory = 'all',
  initialLocation = 'all',
  initialKeyword = '',
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    // Keyword match
    if (keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      const matchTitle = job.title.toLowerCase().includes(kw);
      const matchOrg = job.organization.toLowerCase().includes(kw);
      const matchDesc = job.description.toLowerCase().includes(kw);
      const matchLoc = job.location.toLowerCase().includes(kw);
      const matchCounty = job.county ? job.county.toLowerCase().includes(kw) : false;
      const matchReq = job.requirements?.some(r => r.toLowerCase().includes(kw));
      if (!matchTitle && !matchOrg && !matchDesc && !matchLoc && !matchCounty && !matchReq) return false;
    }

    // Category match
    if (selectedCategory !== 'all' && selectedCategory.trim()) {
      if (job.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    // Location match
    if (selectedLocation !== 'all' && selectedLocation.trim()) {
      if (job.location.toLowerCase() !== selectedLocation.toLowerCase()) return false;
    }

    // Job Type match
    if (selectedJobType !== 'all' && selectedJobType.trim()) {
      if (job.job_type !== selectedJobType) return false;
    }

    return true;
  });

  // Sort
  filteredJobs.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const clearFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedJobType('all');
    setSortBy('newest');
  };

  const hasActiveFilters = Boolean(
    keyword.trim() || 
    selectedCategory !== 'all' || 
    selectedLocation !== 'all' || 
    selectedJobType !== 'all'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Main Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Verified Kenyan Opportunities
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif">
              Find Jobs in Kenya
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Search by title, town, category, or industry. All applications require a flat KSh 150 M-Pesa fee at submission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Keyword */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or company..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Locations (Kenya)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.county})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
                <option value="Casual">Casual</option>
              </select>
            </div>
          </div>

          {/* Active Filters summary & reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-700">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No jobs found matching your search.
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords, clearing location filters, or exploring other job categories.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              hasApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
