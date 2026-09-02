export type JobType = 
  | 'Full-time' 
  | 'Part-time' 
  | 'Contract' 
  | 'Temporary' 
  | 'Internship' 
  | 'Casual';

export type JobStatus = 'draft' | 'published' | 'closed';

export type ApplicationStatus = 'submitted' | 'reviewed' | 'shortlisted' | 'rejected';

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled';

export interface JobSeekerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone: string;
  location: string;
  bio?: string;
  professional_title?: string;
  skills?: string[];
  education?: string;
  experience?: string;
  years_of_experience?: string;
  cv_path?: string;
  cv_file_name?: string;
  cv_file_size?: number;
  cv_uploaded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  job_type: JobType;
  salary_range: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  application_info?: string;
  closing_date?: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  vacancy_id: string;
  job_seeker_id: string;
  cover_letter: string;
  cv_path?: string;
  cv_file_name?: string;
  status: ApplicationStatus;
  payment_status: PaymentStatus;
  reference_number: string;
  created_at: string;
  updated_at: string;
  // Joined relation fields
  vacancy?: JobVacancy;
  profile?: JobSeekerProfile;
  payment?: PaymentRecord;
}

export interface PaymentRecord {
  id: string;
  application_id: string;
  job_seeker_id: string;
  amount: number;
  currency: string;
  phone_number: string;
  merchant_request_id?: string;
  checkout_request_id?: string;
  mpesa_receipt_number?: string;
  transaction_date?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalJobSeekers: number;
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  totalApplications: number;
  applicationsToday: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  totalSuccessfulPayments: number;
  totalRevenueKes: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  iconName?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  county?: string;
  count?: number;
}
