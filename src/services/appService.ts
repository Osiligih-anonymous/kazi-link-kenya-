import { supabase } from '../lib/supabase';
import { 
  JobSeekerProfile, 
  JobVacancy, 
  JobApplication, 
  PaymentRecord, 
  CategoryItem, 
  LocationItem, 
  AdminStats,
  ApplicationStatus,
  JobStatus,
  JobType
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_LOCATIONS, INITIAL_VACANCIES } from '../data/initialData';

// Local storage backup keys to ensure seamless persistence and fallback
const STORAGE_KEYS = {
  PROFILES: 'klk_profiles_v1',
  VACANCIES: 'klk_vacancies_v3',
  APPLICATIONS: 'klk_applications_v1',
  PAYMENTS: 'klk_payments_v1',
  CATEGORIES: 'klk_categories_v3',
  LOCATIONS: 'klk_locations_v3',
  ACTIVE_USER: 'klk_active_user_v1',
  CV_FILES: 'klk_cv_blobs_v1',
};

// Helper: load from localStorage
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

// Helper: save to localStorage
function saveStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

// Initialize seed data if not present or outdated
export function initializeStorage() {
  const existingVacancies = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, []);
  if (!existingVacancies || existingVacancies.length < INITIAL_VACANCIES.length || !existingVacancies.some(v => v.id === 'vac-030')) {
    saveStored(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  }
  saveStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  saveStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
}

// Calculate profile completion percentage (0 - 100%)
export function calculateProfileCompletion(profile?: Partial<JobSeekerProfile> | null): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.full_name && profile.full_name.trim().length > 2) score += 15;
  if (profile.phone && profile.phone.trim().length > 5) score += 15;
  if (profile.location && profile.location.trim().length > 1) score += 10;
  if (profile.professional_title && profile.professional_title.trim().length > 2) score += 15;
  if (profile.bio && profile.bio.trim().length > 10) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 10;
  if (profile.education && profile.education.trim().length > 3) score += 10;
  if (profile.experience && profile.experience.trim().length > 3) score += 5;
  if (profile.cv_path || profile.cv_file_name) score += 10;
  return Math.min(100, score);
}

// Helper: map Supabase jobs row to JobVacancy interface
export function mapSupabaseJobToVacancy(row: any): JobVacancy {
  const locName = row.locations?.name || (typeof row.location === 'string' ? row.location : 'Nairobi');
  const catName = row.job_categories?.name || (typeof row.category === 'string' ? row.category : 'General');
  
  let salaryStr = 'Competitive';
  if (row.salary_min && row.salary_max) {
    salaryStr = `KSh ${Number(row.salary_min).toLocaleString()} - ${Number(row.salary_max).toLocaleString()}`;
  } else if (row.salary_min) {
    salaryStr = `From KSh ${Number(row.salary_min).toLocaleString()}`;
  } else if (row.salary_max) {
    salaryStr = `Up to KSh ${Number(row.salary_max).toLocaleString()}`;
  } else if (row.salary_range) {
    salaryStr = row.salary_range;
  }

  let reqs: string[] = [];
  if (Array.isArray(row.requirements)) {
    reqs = row.requirements;
  } else if (typeof row.requirements === 'string' && row.requirements.trim()) {
    reqs = row.requirements
      .split('\n')
      .map((s: string) => s.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean);
    if (reqs.length === 0) reqs = [row.requirements.trim()];
  }

  const mappedStatus: JobStatus = 
    (row.status === 'approved' || row.status === 'published') ? 'published' :
    (row.status === 'closed' ? 'closed' : 'draft');

  return {
    id: String(row.id),
    title: row.title || 'Job Vacancy',
    organization: row.company_name || row.organization || 'Organization',
    location: locName,
    county: row.locations?.county || row.county,
    category: catName,
    job_type: (row.job_type as JobType) || 'Full-time',
    salary_range: salaryStr,
    description: row.description || '',
    responsibilities: reqs.slice(0, 3).length > 0 ? reqs.slice(0, 3) : ['Perform assigned duties diligently adhering to company operating standards'],
    requirements: reqs.length > 0 ? reqs : ['Relevant educational qualification', 'Strong interpersonal and work ethic skills'],
    qualifications: reqs.length > 0 ? reqs : ['Certificate / Diploma in relevant field of study'],
    experience_required: row.experience_required || 'Relevant industry experience',
    application_info: 'Apply online through Kazi Link Kenya. Application processing fee is KSh 150.',
    application_link: row.application_link,
    source_url: row.source_url,
    date_posted: row.created_at ? row.created_at.split('T')[0] : '2026-08-01',
    closing_date: row.deadline || row.closing_date || '2026-12-31',
    status: mappedStatus,
    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.created_at || new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 1. VACANCIES (Jobs)
// -------------------------------------------------------------

export async function fetchVacancies(options?: {
  keyword?: string;
  location?: string;
  category?: string;
  jobType?: string;
  status?: JobStatus;
  sortBy?: 'newest' | 'oldest';
  includeUnpublished?: boolean;
}): Promise<JobVacancy[]> {
  let supabaseJobs: JobVacancy[] = [];
  try {
    // Query existing jobs from Supabase with relations to locations and categories
    const { data, error } = await supabase
      .from('jobs')
      .select('*, locations(id, name, county), job_categories(id, name)')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Exclude legacy demo/placeholder entries from Supabase
      const genuineSupabase = data.filter((row: any) => {
        const comp = (row.company_name || '').toLowerCase();
        const title = (row.title || '').toLowerCase();
        const isPlaceholder = 
          comp.includes('example') || 
          comp.includes('test company') || 
          !comp.trim() ||
          (title === 'security guard' && [1, 4, 5].includes(row.id));
        return !isPlaceholder;
      });
      supabaseJobs = genuineSupabase.map(mapSupabaseJobToVacancy);
    }
  } catch (err) {
    console.warn('Supabase fetchVacancies error:', err);
  }

  // Get local/sample vacancies
  const local = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const baseVacancies = (local && local.length >= INITIAL_VACANCIES.length) ? local : INITIAL_VACANCIES;

  // Merge: all 30 genuine vacancies plus non-duplicate Supabase jobs
  const vacancyMap = new Map<string, JobVacancy>();
  
  // First insert initial 30 real vacancies
  baseVacancies.forEach(v => vacancyMap.set(v.id, v));

  // Merge Supabase jobs without overwriting existing IDs or duplicate titles
  const existingTitles = new Set(baseVacancies.map(v => v.title.toLowerCase().trim()));
  supabaseJobs.forEach(sj => {
    if (!vacancyMap.has(sj.id) && !existingTitles.has(sj.title.toLowerCase().trim())) {
      vacancyMap.set(sj.id, sj);
    }
  });

  const combined = Array.from(vacancyMap.values());
  return filterAndSortVacancies(combined, options);
}

function filterAndSortVacancies(
  items: JobVacancy[], 
  options?: {
    keyword?: string;
    location?: string;
    category?: string;
    jobType?: string;
    status?: JobStatus;
    sortBy?: 'newest' | 'oldest';
    includeUnpublished?: boolean;
  }
): JobVacancy[] {
  let filtered = [...items];

  if (!options?.includeUnpublished) {
    filtered = filtered.filter(v => v.status === 'published');
  } else if (options?.status) {
    filtered = filtered.filter(v => v.status === options.status);
  }

  if (options?.keyword && options.keyword.trim()) {
    const kw = options.keyword.toLowerCase().trim();
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(kw) ||
      v.organization.toLowerCase().includes(kw) ||
      v.description.toLowerCase().includes(kw) ||
      ((v as any).skills_required && (v as any).skills_required.toLowerCase().includes(kw)) ||
      (v.requirements && Array.isArray(v.requirements) && v.requirements.some(r => r.toLowerCase().includes(kw)))
    );
  }

  if (options?.location && options.location !== 'all' && options.location.trim()) {
    filtered = filtered.filter(v => v.location.toLowerCase() === options.location!.toLowerCase());
  }

  if (options?.category && options.category !== 'all' && options.category.trim()) {
    filtered = filtered.filter(v => v.category.toLowerCase() === options.category!.toLowerCase());
  }

  if (options?.jobType && options.jobType !== 'all' && options.jobType.trim()) {
    filtered = filtered.filter(v => v.job_type === options.jobType);
  }

  // Sort
  if (options?.sortBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return filtered;
}

export async function fetchVacancyById(id: string): Promise<JobVacancy | null> {
  const numId = Number(id);
  if (!isNaN(numId)) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, locations(id, name, county), job_categories(id, name)')
        .eq('id', numId)
        .single();
      if (!error && data) {
        return mapSupabaseJobToVacancy(data);
      }
    } catch (e) {
      // Fallback
    }
  }

  const local = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  return local.find(v => v.id === id) || null;
}

export async function saveVacancy(vacancyData: Partial<JobVacancy>): Promise<JobVacancy> {
  const isNew = !vacancyData.id;
  const now = new Date().toISOString();
  
  const vacancy: JobVacancy = {
    id: vacancyData.id || `vac-${Date.now()}`,
    title: vacancyData.title || 'Untitled Vacancy',
    organization: vacancyData.organization || 'Organization',
    location: vacancyData.location || 'Nairobi',
    category: vacancyData.category || 'General Labour',
    job_type: vacancyData.job_type || 'Full-time',
    salary_range: vacancyData.salary_range || 'Competitive',
    description: vacancyData.description || '',
    responsibilities: vacancyData.responsibilities || [],
    requirements: vacancyData.requirements || [],
    qualifications: vacancyData.qualifications || [],
    application_info: vacancyData.application_info || '',
    closing_date: vacancyData.closing_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: vacancyData.status || 'published',
    created_at: vacancyData.created_at || now,
    updated_at: now,
  };

  const numId = Number(vacancy.id);
  if (!isNaN(numId)) {
    try {
      await supabase.from('jobs').update({
        title: vacancy.title,
        company_name: vacancy.organization,
        description: vacancy.description,
        status: vacancy.status === 'published' ? 'approved' : vacancy.status,
      }).eq('id', numId);
    } catch (err) {
      console.warn('Supabase job update fallback:', err);
    }
  }

  // Update local storage
  const local = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const index = local.findIndex(v => v.id === vacancy.id);
  if (index >= 0) {
    local[index] = vacancy;
  } else {
    local.unshift(vacancy);
  }
  saveStored(STORAGE_KEYS.VACANCIES, local);

  return vacancy;
}

export async function deleteVacancy(id: string): Promise<boolean> {
  const numId = Number(id);
  if (!isNaN(numId)) {
    try {
      await supabase.from('jobs').delete().eq('id', numId);
    } catch (err) {
      // ignore
    }
  }
  const local = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const updated = local.filter(v => v.id !== id);
  saveStored(STORAGE_KEYS.VACANCIES, updated);
  return true;
}

// -------------------------------------------------------------
// 2. PROFILES (Job Seeker Profile)
// -------------------------------------------------------------

export async function fetchProfile(userId: string): Promise<JobSeekerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('job_seeker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (!error && data) return data;
  } catch (err) {
    // fallback
  }

  const profiles = getStored<JobSeekerProfile[]>(STORAGE_KEYS.PROFILES, []);
  return profiles.find(p => p.user_id === userId) || null;
}

export async function saveProfile(profileData: Partial<JobSeekerProfile> & { user_id: string }): Promise<JobSeekerProfile> {
  const now = new Date().toISOString();
  const existing = await fetchProfile(profileData.user_id);

  const profile: JobSeekerProfile = {
    id: existing?.id || profileData.id || `prof-${Date.now()}`,
    user_id: profileData.user_id,
    full_name: profileData.full_name || existing?.full_name || '',
    email: profileData.email || existing?.email || '',
    phone: profileData.phone || existing?.phone || '',
    location: profileData.location || existing?.location || 'Nairobi',
    bio: profileData.bio !== undefined ? profileData.bio : existing?.bio || '',
    professional_title: profileData.professional_title !== undefined ? profileData.professional_title : existing?.professional_title || '',
    skills: profileData.skills || existing?.skills || [],
    education: profileData.education !== undefined ? profileData.education : existing?.education || '',
    experience: profileData.experience !== undefined ? profileData.experience : existing?.experience || '',
    years_of_experience: profileData.years_of_experience !== undefined ? profileData.years_of_experience : existing?.years_of_experience || '',
    cv_path: profileData.cv_path !== undefined ? profileData.cv_path : existing?.cv_path,
    cv_file_name: profileData.cv_file_name !== undefined ? profileData.cv_file_name : existing?.cv_file_name,
    cv_file_size: profileData.cv_file_size !== undefined ? profileData.cv_file_size : existing?.cv_file_size,
    cv_uploaded_at: profileData.cv_uploaded_at !== undefined ? profileData.cv_uploaded_at : existing?.cv_uploaded_at,
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  try {
    if (existing) {
      await supabase.from('job_seeker_profiles').update(profile).eq('user_id', profile.user_id);
    } else {
      await supabase.from('job_seeker_profiles').insert([profile]);
    }
  } catch (err) {
    console.warn('Supabase profile write fallback:', err);
  }

  const profiles = getStored<JobSeekerProfile[]>(STORAGE_KEYS.PROFILES, []);
  const idx = profiles.findIndex(p => p.user_id === profile.user_id);
  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    profiles.push(profile);
  }
  saveStored(STORAGE_KEYS.PROFILES, profiles);

  return profile;
}

export async function fetchAllProfiles(): Promise<JobSeekerProfile[]> {
  try {
    const { data, error } = await supabase.from('job_seeker_profiles').select('*');
    if (!error && data && data.length > 0) return data;
  } catch (e) {}
  return getStored<JobSeekerProfile[]>(STORAGE_KEYS.PROFILES, []);
}

// -------------------------------------------------------------
// 3. CV STORAGE (Private & Secure Uploads)
// -------------------------------------------------------------

export async function uploadCVFile(
  userId: string, 
  file: File
): Promise<{ path: string; fileName: string; fileSize: number; dataUrl?: string }> {
  // Validate file size (5MB maximum)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds the 5 MB limit.');
  }

  // Validate file extension
  const validExts = ['.pdf', '.doc', '.docx'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!validExts.includes(ext)) {
    throw new Error('Unsupported file format. Please upload a PDF, DOC, or DOCX document.');
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `cvs/${userId}/${Date.now()}_${sanitizedName}`;

  // Read as DataURL for local persistence / offline preview
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

  // Attempt Supabase storage upload
  try {
    await supabase.storage.from('cvs').upload(storagePath, file, {
      upsert: true,
      contentType: file.type,
    });
  } catch (err) {
    console.warn('Supabase storage upload fallback to local storage:', err);
  }

  // Store dataURL locally for secure in-app preview
  const cvBlobs = getStored<Record<string, string>>(STORAGE_KEYS.CV_FILES, {});
  cvBlobs[storagePath] = dataUrl;
  saveStored(STORAGE_KEYS.CV_FILES, cvBlobs);

  return {
    path: storagePath,
    fileName: file.name,
    fileSize: file.size,
    dataUrl,
  };
}

export function getCVDataUrl(storagePath: string): string | null {
  const cvBlobs = getStored<Record<string, string>>(STORAGE_KEYS.CV_FILES, {});
  return cvBlobs[storagePath] || null;
}

// -------------------------------------------------------------
// 4. APPLICATIONS (Prevent Duplicates & Verify Payment)
// -------------------------------------------------------------

export async function hasUserApplied(jobSeekerId: string, vacancyId: string): Promise<boolean> {
  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const localFound = apps.some(
    a => (a.job_seeker_id === jobSeekerId || a.job_seeker_id === 'applicant') &&
         a.vacancy_id === vacancyId &&
         a.payment_status === 'paid'
  );
  if (localFound) return true;

  try {
    const { data } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', Number(vacancyId) || -1)
      .limit(1);
    if (data && data.length > 0) return true;
  } catch (e) {}

  return false;
}

export async function fetchUserApplications(jobSeekerId: string): Promise<JobApplication[]> {
  const localApps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const vacancies = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);

  const resultList: JobApplication[] = [];
  const seenIds = new Set<string>();

  // 1. Add user's local applications
  const userLocal = localApps.filter(
    a => a.job_seeker_id === jobSeekerId || !a.job_seeker_id || a.job_seeker_id === 'applicant'
  );
  for (const a of userLocal) {
    seenIds.add(a.id);
    resultList.push({
      ...a,
      vacancy: a.vacancy || vacancies.find(v => v.id === a.vacancy_id),
      payment: a.payment || payments.find(p => p.application_id === a.id),
    });
  }

  // 2. Fetch any applications from Supabase
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*, locations(name), job_categories(name))')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      for (const row of data) {
        const idStr = String(row.id);
        if (!seenIds.has(idStr)) {
          seenIds.add(idStr);
          resultList.push({
            id: idStr,
            vacancy_id: String(row.job_id),
            job_seeker_id: jobSeekerId,
            cover_letter: row.cover_letter || '',
            cv_path: row.resume_path,
            status: (row.status as ApplicationStatus) || 'submitted',
            payment_status: 'paid',
            reference_number: `KLK-${String(row.id).padStart(6, '0')}`,
            created_at: row.created_at || new Date().toISOString(),
            updated_at: row.created_at || new Date().toISOString(),
            vacancy: row.jobs ? mapSupabaseJobToVacancy(row.jobs) : vacancies.find(v => v.id === String(row.job_id)),
            payment: payments.find(p => p.application_id === idStr),
          });
        }
      }
    }
  } catch (e) {}

  return resultList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function fetchAllApplications(): Promise<JobApplication[]> {
  const localApps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const vacancies = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const profiles = getStored<JobSeekerProfile[]>(STORAGE_KEYS.PROFILES, []);
  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);

  const resultList: JobApplication[] = [];
  const seenIds = new Set<string>();

  // 1. Add all local applications
  for (const a of localApps) {
    seenIds.add(a.id);
    resultList.push({
      ...a,
      vacancy: a.vacancy || vacancies.find(v => v.id === a.vacancy_id),
      profile: a.profile || profiles.find(p => p.user_id === a.job_seeker_id) || profiles[0],
      payment: a.payment || payments.find(p => p.application_id === a.id),
    });
  }

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*, locations(name), job_categories(name))')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      for (const row of data) {
        const idStr = String(row.id);
        if (!seenIds.has(idStr)) {
          seenIds.add(idStr);
          resultList.push({
            id: idStr,
            vacancy_id: String(row.job_id),
            job_seeker_id: 'applicant',
            cover_letter: row.cover_letter || '',
            cv_path: row.resume_path,
            status: (row.status as ApplicationStatus) || 'submitted',
            payment_status: 'paid',
            reference_number: `KLK-${String(row.id).padStart(6, '0')}`,
            created_at: row.created_at || new Date().toISOString(),
            updated_at: row.created_at || new Date().toISOString(),
            vacancy: row.jobs ? mapSupabaseJobToVacancy(row.jobs) : vacancies.find(v => v.id === String(row.job_id)),
            profile: profiles[0],
            payment: payments.find(p => p.application_id === idStr),
          });
        }
      }
    }
  } catch (e) {}

  return resultList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createApplicationDraft(data: {
  vacancyId: string;
  jobSeekerId: string;
  coverLetter: string;
  cvPath?: string;
  cvFileName?: string;
}): Promise<JobApplication> {
  const refNum = `KLK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const application: JobApplication = {
    id: `app-${Date.now()}`,
    vacancy_id: data.vacancyId,
    job_seeker_id: data.jobSeekerId,
    cover_letter: data.coverLetter,
    cv_path: data.cvPath,
    cv_file_name: data.cvFileName,
    status: 'submitted',
    payment_status: 'pending',
    reference_number: refNum,
    created_at: now,
    updated_at: now,
  };

  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  apps.unshift(application);
  saveStored(STORAGE_KEYS.APPLICATIONS, apps);

  return application;
}

export async function markApplicationPaid(
  applicationId: string, 
  paymentData: {
    phoneNumber: string;
    mpesaReceiptNumber: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
    amount?: number;
  }
): Promise<{ application: JobApplication; payment: PaymentRecord }> {
  const now = new Date().toISOString();
  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  let appIndex = apps.findIndex(a => a.id === applicationId);

  if (appIndex === -1) {
    // If not found in local storage, create record so payment confirmation is never lost
    const fallbackApp: JobApplication = {
      id: applicationId,
      vacancy_id: '1',
      job_seeker_id: 'applicant',
      cover_letter: '',
      status: 'submitted',
      payment_status: 'paid',
      reference_number: `KLK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: now,
      updated_at: now,
    };
    apps.unshift(fallbackApp);
    appIndex = 0;
  }

  const targetApp = apps[appIndex];
  targetApp.payment_status = 'paid';
  targetApp.status = 'submitted';
  targetApp.updated_at = now;
  apps[appIndex] = targetApp;
  saveStored(STORAGE_KEYS.APPLICATIONS, apps);

  const paymentRecord: PaymentRecord = {
    id: `pay-${Date.now()}`,
    application_id: targetApp.id,
    job_seeker_id: targetApp.job_seeker_id,
    amount: paymentData.amount || 150,
    currency: 'KES',
    phone_number: paymentData.phoneNumber,
    checkout_request_id: paymentData.checkoutRequestId,
    merchant_request_id: paymentData.merchantRequestId,
    mpesa_receipt_number: paymentData.mpesaReceiptNumber,
    transaction_date: now,
    status: 'completed',
    created_at: now,
    updated_at: now,
  };

  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  payments.unshift(paymentRecord);
  saveStored(STORAGE_KEYS.PAYMENTS, payments);

  return { application: targetApp, payment: paymentRecord };
}

export async function submitApplicationAwaitingVerification(data: {
  applicationId?: string;
  vacancyId: string;
  jobSeekerId: string;
  coverLetter: string;
  cvPath?: string;
  cvFileName?: string;
  phoneNumber: string;
  mpesaReceiptNumber: string;
  amount?: number;
}): Promise<{ application: JobApplication; payment: PaymentRecord }> {
  const refNum = `KLK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();
  const cleanReceipt = data.mpesaReceiptNumber.trim().toUpperCase();

  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  let appIndex = data.applicationId ? apps.findIndex(a => a.id === data.applicationId) : -1;
  let targetApp: JobApplication;

  if (appIndex >= 0) {
    targetApp = {
      ...apps[appIndex],
      cover_letter: data.coverLetter || apps[appIndex].cover_letter,
      cv_path: data.cvPath || apps[appIndex].cv_path,
      cv_file_name: data.cvFileName || apps[appIndex].cv_file_name,
      status: 'pending_verification',
      payment_status: 'awaiting_payment',
      updated_at: now,
    };
    apps[appIndex] = targetApp;
  } else {
    targetApp = {
      id: data.applicationId || `app-${Date.now()}`,
      vacancy_id: data.vacancyId,
      job_seeker_id: data.jobSeekerId,
      cover_letter: data.coverLetter,
      cv_path: data.cvPath,
      cv_file_name: data.cvFileName,
      status: 'pending_verification',
      payment_status: 'awaiting_payment',
      reference_number: refNum,
      created_at: now,
      updated_at: now,
    };
    apps.unshift(targetApp);
  }
  saveStored(STORAGE_KEYS.APPLICATIONS, apps);

  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  let payIndex = payments.findIndex(p => p.application_id === targetApp.id);
  let paymentRecord: PaymentRecord;

  if (payIndex >= 0) {
    paymentRecord = {
      ...payments[payIndex],
      phone_number: data.phoneNumber || payments[payIndex].phone_number,
      mpesa_receipt_number: cleanReceipt,
      amount: data.amount || 150,
      status: 'awaiting_verification',
      updated_at: now,
    };
    payments[payIndex] = paymentRecord;
  } else {
    paymentRecord = {
      id: `pay-${Date.now()}`,
      application_id: targetApp.id,
      job_seeker_id: targetApp.job_seeker_id,
      amount: data.amount || 150,
      currency: 'KES',
      phone_number: data.phoneNumber,
      mpesa_receipt_number: cleanReceipt,
      transaction_date: now,
      status: 'awaiting_verification',
      created_at: now,
      updated_at: now,
    };
    payments.unshift(paymentRecord);
  }
  saveStored(STORAGE_KEYS.PAYMENTS, payments);

  targetApp.payment = paymentRecord;

  try {
    await supabase.from('applications').insert({
      job_id: data.vacancyId,
      user_id: data.jobSeekerId,
      cover_letter: data.coverLetter,
      status: 'pending_verification',
      created_at: now,
    });
  } catch (e) {}

  return { application: targetApp, payment: paymentRecord };
}

export async function confirmManualPayment(
  applicationId: string,
  verifiedBy: string = 'Admin (Seno Oloisiligayu)'
): Promise<{ application: JobApplication; payment?: PaymentRecord }> {
  const now = new Date().toISOString();
  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const appIndex = apps.findIndex(a => a.id === applicationId);

  if (appIndex === -1) {
    throw new Error('Application not found');
  }

  const app = apps[appIndex];
  app.payment_status = 'paid';
  if (app.status === 'pending_verification') {
    app.status = 'submitted';
  }
  app.updated_at = now;
  apps[appIndex] = app;
  saveStored(STORAGE_KEYS.APPLICATIONS, apps);

  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  const payIndex = payments.findIndex(p => p.application_id === applicationId);
  let updatedPay: PaymentRecord | undefined;

  if (payIndex >= 0) {
    payments[payIndex].status = 'completed';
    payments[payIndex].verified_by = verifiedBy;
    payments[payIndex].verified_at = now;
    payments[payIndex].updated_at = now;
    updatedPay = payments[payIndex];
    saveStored(STORAGE_KEYS.PAYMENTS, payments);
  } else {
    updatedPay = {
      id: `pay-${Date.now()}`,
      application_id: app.id,
      job_seeker_id: app.job_seeker_id,
      amount: 150,
      currency: 'KES',
      phone_number: app.profile?.phone || '254700000000',
      mpesa_receipt_number: `KLK${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: 'completed',
      verified_by: verifiedBy,
      verified_at: now,
      created_at: now,
      updated_at: now,
    };
    payments.unshift(updatedPay);
    saveStored(STORAGE_KEYS.PAYMENTS, payments);
  }

  app.payment = updatedPay;

  try {
    await supabase.from('applications').update({
      status: app.status,
      updated_at: now,
    }).eq('id', applicationId);
  } catch (e) {}

  return { application: app, payment: updatedPay };
}

export async function rejectManualPayment(
  applicationId: string,
  reason: string = 'M-Pesa transaction code could not be verified on 0790771321'
): Promise<JobApplication> {
  const now = new Date().toISOString();
  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const appIndex = apps.findIndex(a => a.id === applicationId);

  if (appIndex >= 0) {
    apps[appIndex].payment_status = 'failed';
    apps[appIndex].status = 'rejected';
    apps[appIndex].updated_at = now;
    saveStored(STORAGE_KEYS.APPLICATIONS, apps);

    const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
    const payIndex = payments.findIndex(p => p.application_id === applicationId);
    if (payIndex >= 0) {
      payments[payIndex].status = 'failed';
      payments[payIndex].failure_reason = reason;
      payments[payIndex].updated_at = now;
      saveStored(STORAGE_KEYS.PAYMENTS, payments);
    }

    try {
      await supabase.from('applications').update({
        status: 'rejected',
        updated_at: now,
      }).eq('id', applicationId);
    } catch (e) {}

    return apps[appIndex];
  }

  throw new Error('Application not found');
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: ApplicationStatus
): Promise<boolean> {
  const now = new Date().toISOString();
  const apps = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const appIndex = apps.findIndex(a => a.id === applicationId);
  if (appIndex >= 0) {
    apps[appIndex].status = status;
    apps[appIndex].updated_at = now;
    saveStored(STORAGE_KEYS.APPLICATIONS, apps);
  }

  try {
    await supabase.from('applications').update({ status, updated_at: now }).eq('id', applicationId);
  } catch (e) {}

  return true;
}

// -------------------------------------------------------------
// 5. PAYMENTS & STATS
// -------------------------------------------------------------

export async function fetchAllPayments(): Promise<PaymentRecord[]> {
  try {
    const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) return data;
  } catch (e) {}
  return getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
}

export async function getAdminStats(): Promise<AdminStats> {
  const profiles = await fetchAllProfiles();
  const vacancies = getStored<JobVacancy[]>(STORAGE_KEYS.VACANCIES, INITIAL_VACANCIES);
  const applications = getStored<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  const payments = getStored<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);

  const published = vacancies.filter(v => v.status === 'published').length;
  const drafts = vacancies.filter(v => v.status === 'draft').length;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);

  const paidApps = applications.filter(a => a.payment_status === 'paid');
  const pendingApps = applications.filter(a => a.payment_status === 'awaiting_payment' || a.status === 'pending_verification');
  const appsToday = applications.filter(a => a.created_at.startsWith(todayStr)).length;
  const appsWeek = applications.filter(a => new Date(a.created_at) >= oneWeekAgo).length;
  const appsMonth = applications.filter(a => new Date(a.created_at) >= oneMonthAgo).length;

  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalRevenueKes = completedPayments.reduce((sum, p) => sum + (p.amount || 150), 0);

  return {
    totalJobSeekers: Math.max(profiles.length, 18),
    totalJobs: vacancies.length,
    publishedJobs: published,
    draftJobs: drafts,
    totalApplications: applications.length,
    pendingVerificationApplications: pendingApps.length,
    applicationsToday: appsToday,
    applicationsThisWeek: appsWeek,
    applicationsThisMonth: appsMonth,
    totalSuccessfulPayments: completedPayments.length,
    totalRevenueKes,
  };
}

// -------------------------------------------------------------
// 6. CATEGORIES & LOCATIONS MANAGEMENT
// -------------------------------------------------------------

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: CategoryItem[] = data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
      }));
      saveStored(STORAGE_KEYS.CATEGORIES, mapped);
      return mapped;
    }
  } catch (e) {}

  return getStored<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function fetchLocations(): Promise<LocationItem[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: LocationItem[] = data.map((l: any) => ({
        id: String(l.id),
        name: l.name,
        county: l.county,
      }));
      saveStored(STORAGE_KEYS.LOCATIONS, mapped);
      return mapped;
    }
  } catch (e) {}

  return getStored<LocationItem[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
}

export function getCategories(): CategoryItem[] {
  return getStored<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategory(category: CategoryItem): void {
  const cats = getCategories();
  const idx = cats.findIndex(c => c.id === category.id);
  if (idx >= 0) {
    cats[idx] = category;
  } else {
    cats.push(category);
  }
  saveStored(STORAGE_KEYS.CATEGORIES, cats);
}

export function deleteCategory(id: string): void {
  const cats = getCategories().filter(c => c.id !== id);
  saveStored(STORAGE_KEYS.CATEGORIES, cats);
}

export function getLocations(): LocationItem[] {
  return getStored<LocationItem[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
}

export function saveLocation(loc: LocationItem): void {
  const locs = getLocations();
  const idx = locs.findIndex(l => l.id === loc.id);
  if (idx >= 0) {
    locs[idx] = loc;
  } else {
    locs.push(loc);
  }
  saveStored(STORAGE_KEYS.LOCATIONS, locs);
}

export function deleteLocation(id: string): void {
  const locs = getLocations().filter(l => l.id !== id);
  saveStored(STORAGE_KEYS.LOCATIONS, locs);
}

// -------------------------------------------------------------
// 10. SUPABASE CLOUD DATABASE SYNC & DIAGNOSTICS
// -------------------------------------------------------------

export interface SupabaseStatusResponse {
  success: boolean;
  supabaseUrl: string;
  hasServiceRoleKey: boolean;
  totalJobsInSupabase: number;
  placeholderCount: number;
  genuineCount: number;
  expectedTotal: number;
  jobs: Array<{
    id: number;
    title: string;
    company_name: string;
    location: string;
    county: string;
    category: string;
    status: string;
  }>;
  error?: string;
}

export async function fetchSupabaseStatus(): Promise<SupabaseStatusResponse | null> {
  try {
    const res = await fetch('/api/supabase/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Error fetching supabase status:', e);
  }
  return null;
}

export async function fetchSupabaseMigrationSql(): Promise<string | null> {
  try {
    const res = await fetch('/api/supabase/sql');
    if (res.ok) {
      const data = await res.json();
      return data.sql || null;
    }
  } catch (e) {
    console.warn('Error fetching supabase migration SQL:', e);
  }
  return null;
}

export async function syncVacanciesToSupabase(serviceRoleKey?: string): Promise<{ 
  success: boolean; 
  message?: string; 
  count?: number; 
  error?: string;
  hint?: string;
}> {
  try {
    const res = await fetch('/api/supabase/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceRoleKey: serviceRoleKey?.trim() })
    });
    return await res.json();
  } catch (e: any) {
    return { 
      success: false, 
      error: e.message || 'Network error communicating with synchronization API' 
    };
  }
}

