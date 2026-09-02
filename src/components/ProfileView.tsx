import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  uploadCVFile, 
  calculateProfileCompletion, 
  getCVDataUrl 
} from '../services/appService';
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  X, 
  Save, 
  Sparkles,
  Download,
  Trash2,
  FileCheck
} from 'lucide-react';
import { INITIAL_LOCATIONS } from '../data/initialData';

export const ProfileView: React.FC = () => {
  const { user, profile, updateCurrentProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Nairobi');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState('2');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cvSuccess, setCvSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync profile state
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || 'Nairobi');
      setProfessionalTitle(profile.professional_title || '');
      setBio(profile.bio || '');
      setEducation(profile.education || '');
      setExperience(profile.experience || '');
      setYearsOfExp(profile.years_of_experience || '2');
      setSkills(profile.skills || []);
    } else if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setLocation(user.location || 'Nairobi');
    }
  }, [profile, user]);

  const completionRate = calculateProfileCompletion({
    full_name: fullName,
    phone,
    location,
    professional_title: professionalTitle,
    bio,
    skills,
    education,
    experience,
    cv_path: profile?.cv_path,
    cv_file_name: profile?.cv_file_name,
  });

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      await updateCurrentProfile({
        full_name: fullName,
        phone,
        location,
        professional_title: professionalTitle,
        bio,
        skills,
        education,
        experience,
        years_of_experience: yearsOfExp,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingCv(true);
    setErrorMessage(null);
    setCvSuccess(false);

    try {
      const res = await uploadCVFile(user.id, file);
      await updateCurrentProfile({
        cv_path: res.path,
        cv_file_name: res.fileName,
        cv_file_size: res.fileSize,
        cv_uploaded_at: new Date().toISOString(),
      });
      setCvSuccess(true);
      setTimeout(() => setCvSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload CV.');
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleRemoveCv = async () => {
    if (window.confirm('Are you sure you want to remove your CV?')) {
      await updateCurrentProfile({
        cv_path: undefined,
        cv_file_name: undefined,
        cv_file_size: undefined,
        cv_uploaded_at: undefined,
      });
    }
  };

  const handleDownloadCv = () => {
    if (!profile?.cv_path) return;
    const dataUrl = getCVDataUrl(profile.cv_path);
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = profile.cv_file_name || 'My_CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Viewing securely from Supabase private storage.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Completion Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-serif font-black text-2xl flex items-center justify-center shadow-md">
              {(fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  {fullName || 'Job Seeker Profile'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Job Seeker
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600">
                {professionalTitle || 'Complete your profile to apply for jobs faster'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email} • {location}
              </p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:w-72">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Profile Strength
              </span>
              <span className={completionRate >= 80 ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                {completionRate}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {completionRate < 100 
                ? 'Add your CV, skills and work history to reach 100%.' 
                : 'Your profile is fully complete and ready for applications!'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          Profile saved successfully.
        </div>
      )}

      {cvSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          CV uploaded successfully.
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              Personal & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Phone (M-Pesa Number) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Location / Town <span className="text-rose-600">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  {INITIAL_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.county})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  placeholder="e.g. Certified Security Officer / Driver"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Bio / Professional Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your career objectives, strengths, and experience..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Skills & Experience */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Skills & Experience
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Skills (e.g. CCTV, Defensive Driving, POS, First Aid)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill & press Enter"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-600 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Education & Certifications
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. Diploma in Criminology / KCSE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Years of Experience
                  </label>
                  <select
                    value={yearsOfExp}
                    onChange={(e) => setYearsOfExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="0">Entry Level / Fresh Graduate</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 - 5 Years</option>
                    <option value="6">6 - 10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Private CV Management Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-emerald-600" />
              Private CV Storage
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your CV is stored securely and privately in encrypted storage. It is only accessible to you and authorized employers when you apply for a job.
            </p>

            {profile?.cv_file_name ? (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {profile.cv_file_name}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Active CV Uploaded
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/80">
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    View / Download
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveCv}
                    className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-rose-600 transition-colors shadow-2xs"
                    title="Remove CV"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No CV Attached Yet</p>
                <p className="text-[11px] text-slate-500 mt-1 mb-3">
                  Upload your CV in PDF, DOC, or DOCX format (Max 5 MB).
                </p>
              </div>
            )}

            {/* Replace / Upload CV Input */}
            <div>
              <label className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all">
                <Upload className="w-4 h-4" />
                {isUploadingCv ? 'Uploading CV...' : profile?.cv_file_name ? 'Replace Existing CV' : 'Upload New CV'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  disabled={isUploadingCv}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Allowed Formats:</p>
              <p>PDF, Microsoft Word (.doc, .docx). Max size 5 MB.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
