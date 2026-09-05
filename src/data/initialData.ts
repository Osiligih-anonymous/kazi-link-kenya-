import { JobVacancy, CategoryItem, LocationItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    "id": "cat-cs",
    "name": "Customer Service",
    "count": 2,
    "iconName": "Headphones"
  },
  {
    "id": "cat-sales",
    "name": "Sales & Marketing",
    "count": 4,
    "iconName": "TrendingUp"
  },
  {
    "id": "cat-admin",
    "name": "Administration",
    "count": 3,
    "iconName": "Briefcase"
  },
  {
    "id": "cat-acc",
    "name": "Accounting",
    "count": 1,
    "iconName": "Calculator"
  },
  {
    "id": "cat-tech",
    "name": "Technology",
    "count": 2,
    "iconName": "Laptop"
  },
  {
    "id": "cat-sec",
    "name": "Security",
    "count": 0,
    "iconName": "Shield"
  },
  {
    "id": "cat-hosp",
    "name": "Hospitality",
    "count": 1,
    "iconName": "Utensils"
  },
  {
    "id": "cat-const",
    "name": "Construction",
    "count": 1,
    "iconName": "HardHat"
  },
  {
    "id": "cat-health",
    "name": "Healthcare",
    "count": 8,
    "iconName": "Activity"
  },
  {
    "id": "cat-edu",
    "name": "Education",
    "count": 6,
    "iconName": "GraduationCap"
  },
  {
    "id": "cat-biz",
    "name": "Business",
    "count": 3,
    "iconName": "TrendingUp"
  }
];

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    "id": "loc-nbo",
    "name": "Nairobi",
    "county": "Nairobi County",
    "count": 3
  },
  {
    "id": "loc-thk",
    "name": "Thika",
    "county": "Kiambu County",
    "count": 4
  },
  {
    "id": "loc-nye",
    "name": "Nyeri",
    "county": "Nyeri County",
    "count": 3
  },
  {
    "id": "loc-nrk",
    "name": "Narok",
    "county": "Narok County",
    "count": 3
  },
  {
    "id": "loc-mba",
    "name": "Mombasa",
    "county": "Mombasa County",
    "count": 3
  },
  {
    "id": "loc-mrg",
    "name": "Murang'a",
    "county": "Murang'a County",
    "count": 3
  },
  {
    "id": "loc-rru",
    "name": "Ruiru",
    "county": "Kiambu County",
    "count": 4
  },
  {
    "id": "loc-nak",
    "name": "Nakuru",
    "county": "Nakuru County",
    "count": 4
  },
  {
    "id": "loc-glg",
    "name": "Gilgil",
    "county": "Nakuru County",
    "count": 3
  }
];

export const INITIAL_VACANCIES: JobVacancy[] = [
  {
    "id": "vac-001",
    "title": "Junior School Teacher and Assistant Houseparent",
    "organization": "Pembroke House School",
    "location": "Gilgil",
    "county": "Nakuru County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Pembroke House School, an accredited British prep boarding school in Gilgil, is seeking a passionate and energetic Junior School Teacher and Assistant Houseparent. You will deliver high quality British National Curriculum instruction to younger pupils while actively participating in boarding house duties, student welfare, and co-curricular sports and arts.",
    "responsibilities": [
      "Teach junior school classes according to the British National Curriculum.",
      "Assist the Houseparent in daily boarding house operations, bedtime routines, and pastoral care.",
      "Lead or support sports, arts, and outdoor adventurous activities for boarding pupils.",
      "Maintain continuous communication with parents regarding academic progress and pastoral wellbeing.",
      "Ensure safeguarding policies and pupil health and safety regulations are strictly adhered to."
    ],
    "requirements": [
      "Bachelor of Education (B.Ed) or PGCE / Diploma in Primary Education.",
      "Registered with Teachers Service Commission (TSC) or equivalent recognized teaching council.",
      "Commitment to boarding school life and residential pastoral mentorship.",
      "Strong communication and interpersonal skills with young learners."
    ],
    "qualifications": [
      "B.Ed / PGCE Primary Education from an accredited university.",
      "Valid TSC Registration Certificate.",
      "Child protection and safeguarding certification is an added advantage."
    ],
    "experience_required": "Minimum 2 years of teaching experience in British or international primary schools.",
    "application_info": "Submit your CV and letter of application addressed to the Headmaster at recruitment@pembrokehouse.sc.ke.",
    "application_link": "https://www.pembrokehouse.sc.ke",
    "source_url": "https://www.tes.com/jobs/vacancy/junior-school-teacher-and-assistant-houseparent-gilgil-kenya-2092144",
    "date_posted": "2026-08-15",
    "closing_date": "2026-09-30",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-15T08:00:00.000Z",
    "updated_at": "2026-08-15T08:00:00.000Z"
  },
  {
    "id": "vac-002",
    "title": "English Teacher (Years 5-8)",
    "organization": "Pembroke House School",
    "location": "Gilgil",
    "county": "Nakuru County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Pembroke House School in Gilgil is seeking a creative and highly motivated English Teacher for Years 5 to 8. The successful candidate will foster a love for English literature, creative writing, and critical literacy skills in preparation for Common Entrance examinations while engaging in school life.",
    "responsibilities": [
      "Plan and teach English language and literature to pupils in Years 5 through 8.",
      "Prepare pupils thoroughly for UK Common Entrance and scholarship examinations.",
      "Incorporate modern pedagogical methods, drama, reading clubs, and debating activities.",
      "Assess student work regularly, provide constructive feedback, and maintain academic tracking records.",
      "Contribute to boarding duties and extracurricular sports/arts programmes."
    ],
    "requirements": [
      "Degree in English Literature / Language or B.Ed (English major).",
      "Valid TSC registration number.",
      "Familiarity with British Common Entrance or IGCSE English curriculum.",
      "High standard of written and spoken English."
    ],
    "qualifications": [
      "Bachelor’s degree in Education (English) or BA in English with PGCE.",
      "Active TSC registration.",
      "Evidence of continuous professional development in literacy instruction."
    ],
    "experience_required": "At least 3 years teaching English in Upper Primary or Lower Secondary levels.",
    "application_info": "Apply by emailing your curriculum vitae and motivation letter to recruitment@pembrokehouse.sc.ke.",
    "application_link": "https://www.pembrokehouse.sc.ke",
    "source_url": "https://www.tes.com/jobs/vacancy/english-teacher-gilgil-kenya-2094831",
    "date_posted": "2026-08-20",
    "closing_date": "2026-10-15",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-20T08:30:00.000Z",
    "updated_at": "2026-08-20T08:30:00.000Z"
  },
  {
    "id": "vac-003",
    "title": "Direct Sales Representative - Gilgil",
    "organization": "Automobile Association of Kenya (AA Kenya)",
    "location": "Gilgil",
    "county": "Nakuru County",
    "category": "Sales & Marketing",
    "job_type": "Contract",
    "salary_range": "KSh 20,000 - KSh 35,000",
    "description": "AA Kenya is recruiting energetic Direct Sales Representatives based in Gilgil. The role focuses on creating market demand for AA Kenya products and services, including motoring membership packages, driving school admissions, vehicle inspection, and insurance brokerage services across the Gilgil area.",
    "responsibilities": [
      "Prospect and generate qualified sales leads for AA Kenya products across Gilgil town and surrounding hubs.",
      "Execute direct field sales activations, corporate visits, and customer presentations.",
      "Enroll motorists into AA Membership packages and driving school programs.",
      "Maintain strong customer relationships and provide after-sales assistance.",
      "Achieve weekly and monthly sales targets set by the regional branch supervisor."
    ],
    "requirements": [
      "Diploma or Certificate in Sales, Marketing, or Business Administration.",
      "Proven sales acumen with confident interpersonal and negotiation skills.",
      "Familiarity with the Gilgil and Nakuru County business ecosystem.",
      "Self-driven individual capable of working under minimal supervision."
    ],
    "qualifications": [
      "Diploma or Certificate in Business, Sales, or Marketing.",
      "KCSE certificate with mean grade C- or above."
    ],
    "experience_required": "1 to 2 years practical experience in direct field sales or retail sales promotions.",
    "application_info": "Apply through the AA Kenya online careers portal or via Fuzu.",
    "application_link": "https://www.aakenya.co.ke/careers",
    "source_url": "https://www.fuzu.com/kenya/jobs/direct-sales-representatives-gilgil-automobile-association-of-kenya",
    "date_posted": "2026-07-28",
    "closing_date": "2026-09-25",
    "status": "published",
    "is_active": true,
    "created_at": "2026-07-28T09:00:00.000Z",
    "updated_at": "2026-07-28T09:00:00.000Z"
  },
  {
    "id": "vac-004",
    "title": "Clinical Nurse - Narok Outreach Clinic",
    "organization": "Aga Khan University Hospital",
    "location": "Narok",
    "county": "Narok County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Aga Khan University Hospital, Nairobi (AKUH) is seeking a qualified, patient-focused Clinical Nurse for its Narok Medical Outreach Centre. You will provide primary and acute nursing care, patient triage, wound care, immunization, and medication administration adhering to international Joint Commission International (JCI) quality standards.",
    "responsibilities": [
      "Conduct patient intake, vital signs assessment, and clinical triage in the outpatient centre.",
      "Administer prescribed medications, injections, and intravenous therapies safely.",
      "Perform wound dressings, minor procedural assistance, and patient health education.",
      "Maintain accurate patient clinical documentation in the Electronic Health Records (EHR) system.",
      "Ensure clinical waste management and infection control protocols are rigorously practiced."
    ],
    "requirements": [
      "Diploma in Community Health Nursing (KRCHN) or Bachelor of Science in Nursing (BScN).",
      "Valid practicing license from the Nursing Council of Kenya (NCK).",
      "Valid BLS (Basic Life Support) certification.",
      "Strong diagnostic, communication, and patient empathy skills."
    ],
    "qualifications": [
      "KRCHN or BScN from an institution recognized by NCK.",
      "Current, unencumbered Nursing Council of Kenya practicing retention certificate."
    ],
    "experience_required": "Minimum 2 years post-internship clinical nursing experience in a busy hospital or outpatient clinic.",
    "application_info": "Apply via the Aga Khan University Hospital global recruitment portal.",
    "application_link": "https://www.aku.edu/careers/pages/home.aspx",
    "source_url": "https://www.myjobmag.co.ke/job/clinical-nurse-narok-aga-khan-university-hospital",
    "date_posted": "2026-08-12",
    "closing_date": "2026-09-28",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-12T07:30:00.000Z",
    "updated_at": "2026-08-12T07:30:00.000Z"
  },
  {
    "id": "vac-005",
    "title": "Direct Sales Representative (Banking)",
    "organization": "SBM Bank Kenya",
    "location": "Narok",
    "county": "Narok County",
    "category": "Business",
    "job_type": "Contract",
    "salary_range": "KSh 25,000 - KSh 45,000",
    "description": "SBM Bank Kenya is hiring a performance-driven Direct Sales Representative to drive retail banking customer acquisition in Narok town and surrounding commercial hubs. The role involves prospecting business owners, SMEs, and individual professionals to open transactional accounts and access personal credit facilities.",
    "responsibilities": [
      "Identify, contact, and acquire new retail and SME banking customers across Narok.",
      "Sell personal and business current accounts, savings accounts, and fixed deposits.",
      "Cross-sell digital banking services including mobile banking and card products.",
      "Assist customers with KYC documentation and bank account opening procedures.",
      "Consistently meet weekly and monthly sales quotas set by the Branch Manager."
    ],
    "requirements": [
      "Diploma or Degree in Business, Marketing, Finance, or related discipline.",
      "Demonstrated experience in sales of banking or financial service products.",
      "Strong negotiation, networking, and presentation abilities.",
      "Good knowledge of the local retail and agricultural commerce in Narok."
    ],
    "qualifications": [
      "Diploma or Bachelor’s degree in a business-related field.",
      "Certificate of Good Conduct."
    ],
    "experience_required": "1 to 2 years sales experience within the banking or microfinance sector.",
    "application_info": "Submit application via BrighterMonday Kenya or directly to SBM Bank careers portal.",
    "application_link": "https://www.sbmbank.co.ke/careers",
    "source_url": "https://www.brightermonday.co.ke/listings/direct-sales-representative-narok-sbm-bank",
    "date_posted": "2026-08-10",
    "closing_date": "2026-09-30",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-10T10:00:00.000Z",
    "updated_at": "2026-08-10T10:00:00.000Z"
  },
  {
    "id": "vac-006",
    "title": "Pharmaceutical Technologist III",
    "organization": "Narok County Public Service Board",
    "location": "Narok",
    "county": "Narok County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 32,700 - KSh 45,000",
    "description": "The Narok County Public Service Board is inviting applications for the position of Pharmaceutical Technologist III to be deployed within Narok County health facilities. The officer will manage drug dispensing, maintain accurate pharmacy inventory, verify doctor prescriptions, and counsel patients on safe drug administration.",
    "responsibilities": [
      "Dispense prescription and over-the-counter medications to patients in county health facilities.",
      "Check prescriptions for correctness of dosage, drug interactions, and contraindications.",
      "Maintain pharmacy store records, monitor stock levels, and prepare requisitions for essential medicines.",
      "Provide patient counseling on proper drug use, side effects, and storage conditions.",
      "Ensure compliance with the Pharmacy and Poisons Act and Ministry of Health guidelines."
    ],
    "requirements": [
      "Diploma in Pharmacy or Pharmaceutical Technology from a recognized institution.",
      "Valid enrollment certificate and practicing license from the Pharmacy and Poisons Board (PPB).",
      "Demonstrated knowledge of public health pharmacy inventory management systems.",
      "Meet the requirements of Chapter Six of the Constitution of Kenya."
    ],
    "qualifications": [
      "Diploma in Pharmacy or Pharmaceutical Technology from KMTC or recognized college.",
      "Current Annual Practicing License from the Pharmacy and Poisons Board."
    ],
    "experience_required": "At least 1 year post-qualification dispensing experience.",
    "application_info": "Apply online via the Narok County recruitment portal at portal.narok.go.ke/careers.",
    "application_link": "https://portal.narok.go.ke/careers",
    "source_url": "https://www.myjobmag.co.ke/job/pharmaceutical-technologist-iii-narok-county-public-service-board",
    "date_posted": "2026-08-25",
    "closing_date": "2026-10-05",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-25T08:00:00.000Z",
    "updated_at": "2026-08-25T08:00:00.000Z"
  },
  {
    "id": "vac-007",
    "title": "Information Technology (IT) Trainer",
    "organization": "Kiharu Technical College",
    "location": "Murang'a",
    "county": "Murang'a County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "KSh 28,000 - KSh 42,000",
    "description": "Kiharu Technical College in Murang’a is looking for a qualified and motivated Information Technology (IT) Trainer. The trainer will prepare and deliver instruction in computer applications, programming, networking fundamentals, and digital literacy to TVET diploma and certificate trainees.",
    "responsibilities": [
      "Deliver practical and theoretical lectures in Information Communication Technology courses.",
      "Prepare instructional materials, course outlines, lesson plans, and practical computer lab sessions.",
      "Assess and evaluate trainee coursework, exams, and national technical exam projects.",
      "Supervise computer lab maintenance, software installations, and student network access.",
      "Guide trainees on industry readiness, software skills, and technological innovations."
    ],
    "requirements": [
      "Bachelor’s Degree or Higher Diploma in Computer Science, Information Technology, or Business IT.",
      "Pedagogical training or TVET trainer qualification is an added advantage.",
      "Strong proficiency in web programming, databases, and computer systems repair.",
      "Good classroom management and communication abilities."
    ],
    "qualifications": [
      "BSc in Computer Science / Information Technology or Higher National Diploma in ICT.",
      "TVET CDACC or KNEC technical training certification is preferred."
    ],
    "experience_required": "Minimum 2 years of teaching or instructional experience in a TVET or college environment.",
    "application_info": "Send CV and academic testimonials to info@kiharutechnical.ac.ke.",
    "application_link": "https://www.kiharutechnical.ac.ke",
    "source_url": "https://www.careerjet.co.ke/job/it-trainer-kiharu-technical-college-muranga",
    "date_posted": "2026-08-18",
    "closing_date": "2026-09-22",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-18T09:00:00.000Z",
    "updated_at": "2026-08-18T09:00:00.000Z"
  },
  {
    "id": "vac-008",
    "title": "Lecturer in Public Health",
    "organization": "Murang'a University of Technology",
    "location": "Murang'a",
    "county": "Murang'a County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "KSh 99,400 - KSh 140,683",
    "description": "Murang'a University of Technology (MUT) invites applications from suitably qualified candidates for the position of Lecturer in Public Health in the School of Health Sciences. The role encompasses teaching undergraduate and postgraduate programs, supervising research dissertations, and initiating community health outreach projects.",
    "responsibilities": [
      "Teach undergraduate and postgraduate courses in Public Health, Epidemiology, and Community Health.",
      "Supervise undergraduate and postgraduate student research dissertations and clinical attachments.",
      "Conduct original scholarly research and publish in reputable peer-reviewed academic journals.",
      "Participate in curriculum review, academic advisory, and department quality assurance boards.",
      "Engage in university resource mobilization and community health outreach initiatives."
    ],
    "requirements": [
      "Ph.D. in Public Health, Epidemiology, or Community Health from a recognized university.",
      "Master’s degree in Public Health and Bachelor’s degree in a health-related science.",
      "Demonstrated research output with at least 24 research points from peer-reviewed publications.",
      "Registered with relevant professional public health bodies in Kenya."
    ],
    "qualifications": [
      "Doctorate (Ph.D.) degree in Public Health or equivalent.",
      "Active registration with the Public Health Officers and Technicians Council (PHOTC)."
    ],
    "experience_required": "At least 3 years of university teaching and research experience.",
    "application_info": "Submit ten (10) copies of application documents to the Vice Chancellor at recruitment@mut.ac.ke.",
    "application_link": "https://www.mut.ac.ke/careers",
    "source_url": "https://www.mut.ac.ke/vacancies",
    "date_posted": "2026-08-22",
    "closing_date": "2026-10-02",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-22T08:30:00.000Z",
    "updated_at": "2026-08-22T08:30:00.000Z"
  },
  {
    "id": "vac-009",
    "title": "Loan Sales Agent",
    "organization": "Brisk Credit Limited",
    "location": "Murang'a",
    "county": "Murang'a County",
    "category": "Business",
    "job_type": "Full-time",
    "salary_range": "KSh 20,000 - KSh 35,000",
    "description": "Brisk Credit Limited is seeking energetic Loan Sales Agents to operate from its Murang’a branch. You will market micro-business loans, agricultural credit, and personal loan products to entrepreneurs and civil servants across Murang’a town and surrounding trade centers.",
    "responsibilities": [
      "Source new loan applicants through direct field marketing and business community visits.",
      "Appraise borrower loan applications, business cash flows, and security collateral.",
      "Conduct preliminary credit vetting and verify applicant KYC and employment details.",
      "Assist clients with the loan disbursement process and explain repayment schedules.",
      "Monitor loan portfolios and follow up on early arrears to maintain low default rates."
    ],
    "requirements": [
      "Certificate or Diploma in Sales, Microfinance, Cooperative Management, or Business.",
      "Proven track record in meeting microfinance sales targets.",
      "Excellent interpersonal communication and relationship management skills.",
      "Familiarity with business enterprises across Murang’a County."
    ],
    "qualifications": [
      "Diploma in Business Administration, Accounting, or Marketing.",
      "KCSE minimum grade C-."
    ],
    "experience_required": "Minimum 1 year in microfinance lending, SME field loan sales, or credit verification.",
    "application_info": "Apply with CV and cover letter to careers@briskcredit.co.ke.",
    "application_link": "https://www.briskcredit.co.ke",
    "source_url": "https://www.careerjet.co.ke/job/loan-sales-agent-brisk-credit-muranga",
    "date_posted": "2026-08-14",
    "closing_date": "2026-09-29",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-14T09:00:00.000Z",
    "updated_at": "2026-08-14T09:00:00.000Z"
  },
  {
    "id": "vac-010",
    "title": "Pediatric Nurse",
    "organization": "The Outspan Hospital",
    "location": "Nyeri",
    "county": "Nyeri County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 40,000 - KSh 60,000",
    "description": "The Outspan Hospital, a leading private referral and teaching hospital in Nyeri, is seeking a compassionate and qualified Pediatric Nurse. The nurse will deliver specialized healthcare to infants, children, and adolescents in the pediatric ward and outpatient pediatric clinic.",
    "responsibilities": [
      "Provide comprehensive nursing care to pediatric patients following established hospital protocols.",
      "Administer medications and IV fluids calculated accurately according to pediatric body weight.",
      "Monitor and interpret pediatric vital signs, recognizing early signs of clinical deterioration.",
      "Support and educate parents and guardians regarding childhood illness management and immunization.",
      "Maintain pediatric resuscitation equipment and ensure optimal ward hygiene."
    ],
    "requirements": [
      "Diploma in Community Health Nursing (KRCHN) or Bachelor of Science in Nursing (BScN).",
      "Higher Diploma in Pediatric Nursing is an added advantage.",
      "Valid practicing license from the Nursing Council of Kenya.",
      "Certification in Pediatric Advanced Life Support (PALS) is preferred."
    ],
    "qualifications": [
      "Diploma in Nursing (KRCHN) / BScN.",
      "Valid Nursing Council of Kenya Annual Retention Certificate."
    ],
    "experience_required": "Minimum 2 years clinical pediatric nursing experience in a recognized hospital.",
    "application_info": "Send your application letter, CV, and certificates to hr@outspanhospital.org.",
    "application_link": "https://www.outspanhospital.org/careers",
    "source_url": "https://www.myjobmag.co.ke/job/pediatric-nurse-the-outspan-hospital-nyeri",
    "date_posted": "2026-08-18",
    "closing_date": "2026-09-20",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-18T08:00:00.000Z",
    "updated_at": "2026-08-18T08:00:00.000Z"
  },
  {
    "id": "vac-011",
    "title": "Reproductive Health Nurse",
    "organization": "The Outspan Hospital",
    "location": "Nyeri",
    "county": "Nyeri County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 40,000 - KSh 58,000",
    "description": "The Outspan Hospital in Nyeri is recruiting a dedicated Reproductive Health Nurse. The officer will provide maternal and reproductive healthcare services including antenatal clinic care, labor and delivery management, postnatal care, family planning, and cervical cancer screening.",
    "responsibilities": [
      "Manage normal spontaneous deliveries and assist obstetricians in complicated labor procedures.",
      "Provide antenatal and postnatal consultations, clinical examinations, and preventive therapies.",
      "Administer family planning counselling, contraceptives, and cervical screening services.",
      "Monitor maternal and fetal wellbeing using cardiotocography (CTG) and vital sign tracking.",
      "Document maternal health indicators accurately in compliance with Ministry of Health registers."
    ],
    "requirements": [
      "Diploma in KRCHN or BScN with specialization/experience in Midwifery and Reproductive Health.",
      "Valid registration and current practicing license from the Nursing Council of Kenya.",
      "Demonstrated competence in Emergency Obstetric and Newborn Care (EmONC).",
      "Strong clinical assessment, emergency response, and patient counselling capabilities."
    ],
    "qualifications": [
      "KRCHN or BScN with Midwifery training.",
      "Valid unencumbered NCK license."
    ],
    "experience_required": "At least 2 years post-qualification experience in maternity or reproductive health units.",
    "application_info": "Submit application letter and CV to hr@outspanhospital.org.",
    "application_link": "https://www.outspanhospital.org/careers",
    "source_url": "https://www.myjobmag.co.ke/job/reproductive-health-nurse-the-outspan-hospital-nyeri",
    "date_posted": "2026-08-18",
    "closing_date": "2026-09-20",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-18T08:30:00.000Z",
    "updated_at": "2026-08-18T08:30:00.000Z"
  },
  {
    "id": "vac-012",
    "title": "Laboratory Technologist",
    "organization": "The Outspan Hospital",
    "location": "Nyeri",
    "county": "Nyeri County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 35,000 - KSh 50,000",
    "description": "The Outspan Hospital in Nyeri requires a qualified Medical Laboratory Technologist. You will perform accurate clinical diagnostic tests in hematology, clinical chemistry, microbiology, parasitology, and blood transfusion, supporting clinical decision-making for outpatient and inpatient units.",
    "responsibilities": [
      "Collect and prepare patient blood, bodily fluid, and tissue specimens following strict SOPs.",
      "Perform diagnostic laboratory assays using automated analyzers and microscopy methods.",
      "Execute internal quality control checks and maintain equipment calibration logs.",
      "Verify and enter lab results into the Hospital Information Management System promptly.",
      "Ensure strict adherence to laboratory biosafety standards and waste disposal guidelines."
    ],
    "requirements": [
      "Diploma or Degree in Medical Laboratory Sciences from an accredited institution.",
      "Registered with Kenya Medical Laboratory Technicians and Technologists Board (KMLTTB).",
      "Valid KMLTTB Annual Practicing License.",
      "Experience operating modern automated clinical biochemistry and hematology analyzers."
    ],
    "qualifications": [
      "Diploma / Degree in Medical Laboratory Sciences.",
      "Active KMLTTB license."
    ],
    "experience_required": "Minimum 2 years of hospital diagnostic laboratory experience.",
    "application_info": "Apply with CV, academic credentials, and KMLTTB license to hr@outspanhospital.org.",
    "application_link": "https://www.outspanhospital.org",
    "source_url": "https://www.outspanhospital.org/vacancies/laboratory-technologist",
    "date_posted": "2026-08-20",
    "closing_date": "2026-09-25",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-20T09:00:00.000Z",
    "updated_at": "2026-08-20T09:00:00.000Z"
  },
  {
    "id": "vac-013",
    "title": "Lecturer, Health Records and Information Management",
    "organization": "Mount Kenya University (MKU)",
    "location": "Thika",
    "county": "Kiambu County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Mount Kenya University (MKU) invites applications for the position of Lecturer in Health Records and Information Management based at its Main Campus in Thika. The successful applicant will lecture undergraduate students, develop curricula, supervise academic research, and publish academic research in peer-reviewed journals.",
    "responsibilities": [
      "Teach undergraduate courses in Health Records, Health Informatics, and Biostatistics.",
      "Supervise student research projects, dissertations, and hospital practical attachments.",
      "Conduct scholarly research, publish articles, and participate in academic conferences.",
      "Contribute to curriculum reviews and continuous assessment tests.",
      "Perform academic advisory and mentor students in professional health information ethics."
    ],
    "requirements": [
      "Ph.D. or Master’s Degree in Health Records and Information Management, Health Informatics, or related field.",
      "At least three (3) years of teaching experience at university level.",
      "Research publications in refereed academic journals.",
      "Registered with the relevant health records professional association in Kenya."
    ],
    "qualifications": [
      "Ph.D. or Master’s degree in Health Records / Health Informatics.",
      "Bachelor of Science in Health Records & Information Management."
    ],
    "experience_required": "At least 3 years teaching and research experience in a recognized university.",
    "application_info": "Apply online through the Mount Kenya University online recruitment portal at recruitment.mku.ac.ke.",
    "application_link": "https://recruitment.mku.ac.ke",
    "source_url": "https://opportunitiesforyoungkenyans.co.ke/mount-kenya-university-mku-recruitment-thika",
    "date_posted": "2026-08-28",
    "closing_date": "2026-09-11",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-28T09:00:00.000Z",
    "updated_at": "2026-08-28T09:00:00.000Z"
  },
  {
    "id": "vac-014",
    "title": "Laboratory Manager",
    "organization": "Kenya Medical Research Institute (KEMRI)",
    "location": "Thika",
    "county": "Kiambu County",
    "category": "Healthcare",
    "job_type": "Contract",
    "salary_range": "KSh 120,000 - KSh 180,000",
    "description": "The Kenya Medical Research Institute (KEMRI) is recruiting a dynamic Laboratory Manager to lead clinical research laboratory operations at its research center in Thika. The role manages laboratory workflows, quality management systems (ISO 15189), equipment maintenance, staff compliance, and clinical research specimen testing.",
    "responsibilities": [
      "Oversee day-to-day operations and quality assurance of the clinical research laboratory in Thika.",
      "Ensure strict compliance with Good Clinical Laboratory Practices (GCLP) and ISO 15189 standards.",
      "Manage inventory, procurement of diagnostic reagents, and preventive equipment maintenance.",
      "Supervise medical laboratory scientists and technicians across clinical trial protocols.",
      "Review and authorize clinical laboratory trial data and specimen management reports."
    ],
    "requirements": [
      "Bachelor’s degree in Medical Laboratory Sciences or related biomedical discipline.",
      "Master’s degree in Medical Laboratory Sciences, Virology, Molecular Biology, or Public Health.",
      "Valid registration and current practicing license from KMLTTB.",
      "Comprehensive knowledge of ISO 15189 laboratory accreditation requirements."
    ],
    "qualifications": [
      "MSc in Medical Laboratory Science / Biomedical Sciences.",
      "BSc in Medical Laboratory Science with active KMLTTB license."
    ],
    "experience_required": "Minimum 7 years experience in a clinical research laboratory, with at least 5 years in a managerial position.",
    "application_info": "Submit application via KEMRI careers portal or email as directed on the official advert.",
    "application_link": "https://www.kemri.go.ke/careers",
    "source_url": "https://www.corporatestaffing.co.ke/job/laboratory-manager-kemri-thika",
    "date_posted": "2026-08-24",
    "closing_date": "2026-09-15",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-24T08:00:00.000Z",
    "updated_at": "2026-08-24T08:00:00.000Z"
  },
  {
    "id": "vac-015",
    "title": "Maintenance Foreman",
    "organization": "Bidco Africa Ltd",
    "location": "Thika",
    "county": "Kiambu County",
    "category": "Construction",
    "job_type": "Full-time",
    "salary_range": "KSh 45,000 - KSh 70,000",
    "description": "Bidco Africa Ltd, a leading FMCG manufacturer headquartered in Thika, is seeking an experienced Maintenance Foreman. You will supervise preventive maintenance schedules, mechanical plant repairs, utility pumps, piping, and automated packaging lines to ensure uninterrupted manufacturing throughput.",
    "responsibilities": [
      "Lead and coordinate daily maintenance technician tasks across processing and packaging plants.",
      "Implement scheduled preventive maintenance programs for pumps, conveyors, boilers, and gearboxes.",
      "Diagnose machine breakdowns rapidly and coordinate immediate corrective repairs.",
      "Manage spare parts inventory, tools requisition, and maintenance log records.",
      "Enforce workplace safety, occupational health protocols, and environmental standards."
    ],
    "requirements": [
      "Higher Diploma or Diploma in Mechanical Engineering or Plant Engineering.",
      "Strong diagnostic skills in industrial hydraulic, pneumatic, and mechanical systems.",
      "Demonstrated leadership skills in managing factory technical teams.",
      "Ability to work flexible shift schedules including breakdown on-call periods."
    ],
    "qualifications": [
      "Higher National Diploma or Diploma in Mechanical / Plant Engineering.",
      "Safety certification in industrial machinery operations."
    ],
    "experience_required": "Minimum 4 years industrial plant maintenance experience, with at least 2 years in a supervisory role.",
    "application_info": "Apply via the Bidco Africa online careers portal.",
    "application_link": "https://www.bidcoafrica.com/careers",
    "source_url": "https://www.indeed.com/viewjob?jk=bidco-maintenance-foreman-thika",
    "date_posted": "2026-08-16",
    "closing_date": "2026-09-30",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-16T10:00:00.000Z",
    "updated_at": "2026-08-16T10:00:00.000Z"
  },
  {
    "id": "vac-016",
    "title": "Graduate Assistant, Health Records",
    "organization": "Mount Kenya University (MKU)",
    "location": "Thika",
    "county": "Kiambu County",
    "category": "Education",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Mount Kenya University (MKU) has an opening for a Graduate Assistant in the School of Clinical Medicine (Health Records Department) at Thika Main Campus. The Graduate Assistant will support senior faculty in tutorials, student practical sessions, health data lab management, and research data organization.",
    "responsibilities": [
      "Assist lecturers in preparing practical tutorial classes and electronic health data demonstrations.",
      "Guide students during health records practical software lab sessions.",
      "Assist in invigilation of university continuous assessment tests and final examinations.",
      "Support department academic staff in research data gathering and literature reviews.",
      "Maintain departmental records and student attendance registers."
    ],
    "requirements": [
      "Bachelor’s Degree in Health Records and Information Management with First Class or Upper Second Class Honours.",
      "Demonstrated academic excellence and commitment to pursuing postgraduate studies.",
      "Strong computer literacy and data analysis capabilities.",
      "Good organizational and verbal presentation skills."
    ],
    "qualifications": [
      "BSc in Health Records & Information Management (First Class or Upper Second Class).",
      "Certificate of Good Conduct."
    ],
    "experience_required": "Recent graduate with proven academic excellence; internship or clinical attachment experience is an advantage.",
    "application_info": "Submit application documents through the MKU recruitment portal at recruitment.mku.ac.ke.",
    "application_link": "https://recruitment.mku.ac.ke",
    "source_url": "https://opportunitiesforyoungkenyans.co.ke/mount-kenya-university-mku-recruitment-thika",
    "date_posted": "2026-08-28",
    "closing_date": "2026-09-11",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-28T10:00:00.000Z",
    "updated_at": "2026-08-28T10:00:00.000Z"
  },
  {
    "id": "vac-017",
    "title": "Network Engineer",
    "organization": "Zetech University",
    "location": "Ruiru",
    "county": "Kiambu County",
    "category": "Technology",
    "job_type": "Full-time",
    "salary_range": "KSh 60,000 - KSh 90,000",
    "description": "Zetech University is looking for a skilled Network Engineer at its Main Campus along Thika Road in Ruiru. The engineer will design, implement, monitor, and secure the university-wide network infrastructure, covering campus fiber backbone, high-density Wi-Fi networks, firewalls, and server connectivity.",
    "responsibilities": [
      "Design, configure, and maintain LAN, WAN, WLAN, and campus fiber optic network connections.",
      "Manage Cisco switches, routers, MikroTik gateways, and Fortinet / Sophos firewalls.",
      "Monitor network uptime, bandwidth utilization, latency, and troubleshoot connectivity bottlenecks.",
      "Implement network security protocols, VLAN segmentation, and VPN remote access.",
      "Maintain data center server rack wiring, power redundancy, and network documentation."
    ],
    "requirements": [
      "Bachelor’s degree in Computer Science, Telecommunications, or Information Technology.",
      "Professional certifications: CCNA / CCNP, NSE4, or MikroTik MTCNA.",
      "Solid experience in configuring routing protocols (OSPF, BGP) and enterprise Wi-Fi systems.",
      "Ability to resolve urgent network outages under pressure."
    ],
    "qualifications": [
      "BSc in Computer Science / IT / Telecommunications.",
      "Active CCNA or higher networking certification."
    ],
    "experience_required": "Minimum 3 years active experience managing enterprise or campus network infrastructure.",
    "application_info": "Apply with CV and cover letter to vacancies@zetech.ac.ke.",
    "application_link": "https://zetech.ac.ke/careers",
    "source_url": "https://www.corporatestaffing.co.ke/job/network-engineer-zetech-university-ruiru",
    "date_posted": "2026-08-26",
    "closing_date": "2026-09-18",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-26T08:30:00.000Z",
    "updated_at": "2026-08-26T08:30:00.000Z"
  },
  {
    "id": "vac-018",
    "title": "Career Service & Mentorship Officer",
    "organization": "Zetech University",
    "location": "Ruiru",
    "county": "Kiambu County",
    "category": "Administration",
    "job_type": "Full-time",
    "salary_range": "KSh 45,000 - KSh 65,000",
    "description": "Zetech University is seeking an energetic Career Service & Mentorship Officer based at the Ruiru Main Campus. You will guide students and alumni through professional career planning, resume development, job search preparation, corporate internships, and employer networking partnerships.",
    "responsibilities": [
      "Organize campus career fairs, employer recruitment presentations, and industry guest speaker talks.",
      "Conduct one-on-one career counseling, CV review clinics, and mock interview sessions for final-year students.",
      "Establish and maintain partnerships with corporate employers for student internship and graduate placements.",
      "Track graduate employability rates and compile destination reports.",
      "Coordinate the university alumni mentorship program and career development workshops."
    ],
    "requirements": [
      "Bachelor’s degree in Human Resource Management, Education, Social Sciences, or Business.",
      "Strong knowledge of contemporary labor market dynamics and employer recruitment expectations in Kenya.",
      "Superb interpersonal, networking, public speaking, and presentation skills.",
      "Demonstrated enthusiasm for youth mentorship and career progression."
    ],
    "qualifications": [
      "Bachelor’s Degree in HR, Education, or Social Sciences.",
      "Certification in Career Guidance or Coaching is an added advantage."
    ],
    "experience_required": "At least 2 to 3 years experience in university career services, HR recruitment, or student placement.",
    "application_info": "Send CV and credentials quoting reference number to vacancies@zetech.ac.ke.",
    "application_link": "https://zetech.ac.ke/careers",
    "source_url": "https://www.corporatestaffing.co.ke/job/career-service-officer-zetech-university-ruiru",
    "date_posted": "2026-08-26",
    "closing_date": "2026-09-18",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-26T09:00:00.000Z",
    "updated_at": "2026-08-26T09:00:00.000Z"
  },
  {
    "id": "vac-019",
    "title": "Automation Technician - Utilities (Water)",
    "organization": "Tatu City Limited",
    "location": "Ruiru",
    "county": "Kiambu County",
    "category": "Technology",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Tatu City, the premier Special Economic Zone and mixed-use development in Ruiru, is hiring an Automation Technician - Utilities (Water). The technician will install, calibrate, program, and maintain automated instrumentation, SCADA controls, telemetry systems, and PLC networks across municipal water treatment plants and wastewater facilities.",
    "responsibilities": [
      "Maintain SCADA, PLC, and telemetry monitoring systems across Tatu City water distribution networks.",
      "Calibrate electronic flow meters, pressure sensors, level transmitters, and automated control valves.",
      "Diagnose and repair automation electrical faults in water pumping stations and treatment plants.",
      "Perform routine preventive instrumentation testing and maintain telemetry data accuracy.",
      "Collaborate with utility operations engineers to optimize water conservation and automation reliability."
    ],
    "requirements": [
      "Diploma or Bachelor’s Degree in Mechatronics, Electrical & Electronics, or Automation Engineering.",
      "Practical hands-on experience with SCADA software and PLC programming (Siemens, Schneider, or Allen Bradley).",
      "Understanding of industrial instrumentation, sensors, and telemetry communication networks.",
      "Valid driving license and ability to handle field troubleshooting across the 5,000-acre development."
    ],
    "qualifications": [
      "Diploma or Degree in Mechatronics / Instrumentation / Electrical Engineering.",
      "EPRA electrician license is an added advantage."
    ],
    "experience_required": "Minimum 3 years experience in water utility automation, SCADA systems, or industrial process instrumentation.",
    "application_info": "Submit application through the Tatu City careers portal at tatucity.com/careers.",
    "application_link": "https://www.tatucity.com/careers",
    "source_url": "https://www.myjobmag.co.ke/job/automation-technician-tatu-city-ruiru",
    "date_posted": "2026-08-22",
    "closing_date": "2026-09-28",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-22T08:00:00.000Z",
    "updated_at": "2026-08-22T08:00:00.000Z"
  },
  {
    "id": "vac-020",
    "title": "Quality Assurance Officer",
    "organization": "Brookside Dairy Limited",
    "location": "Ruiru",
    "county": "Kiambu County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 50,000 - KSh 75,000",
    "description": "Brookside Dairy Limited, the leading dairy processing company in East Africa with headquarters in Ruiru, is recruiting a Quality Assurance Officer. The officer will oversee microbiological and chemical testing, line hygiene validation, and compliance with KEBS food safety and ISO 22000 / HACCP standards.",
    "responsibilities": [
      "Conduct laboratory chemical and microbiological analysis of raw milk, in-process, and finished dairy goods.",
      "Monitor Critical Control Points (CCPs) along pasteurization, fermentation, and aseptic packaging lines.",
      "Perform hygiene swabs, equipment sanitation validation, and clean-in-place (CIP) audit checks.",
      "Investigate non-conforming product batches and implement root-cause corrective actions.",
      "Maintain QA inspection logs and ensure compliance with KEBS and ISO 22000 requirements."
    ],
    "requirements": [
      "Bachelor of Science Degree in Food Science and Technology, Dairy Technology, or Microbiology.",
      "Sound knowledge of HACCP, ISO 22000, and Good Manufacturing Practices (GMP).",
      "Strong proficiency in laboratory analytical techniques and food safety auditing.",
      "Attention to detail, analytical mindset, and ability to work in factory shift environments."
    ],
    "qualifications": [
      "BSc in Food Science & Technology / Dairy Technology / Industrial Microbiology.",
      "HACCP / ISO 22000 Lead Auditor or Implementation Certificate is preferred."
    ],
    "experience_required": "Minimum 2 to 3 years quality assurance experience in a high-speed FMCG food or dairy manufacturing plant.",
    "application_info": "Submit application and CV to hr.recruitment@brookside.co.ke.",
    "application_link": "https://www.brookside.co.ke",
    "source_url": "https://www.myjobmag.co.ke/job/quality-assurance-officer-brookside-dairy-ruiru",
    "date_posted": "2026-08-20",
    "closing_date": "2026-10-02",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-20T08:00:00.000Z",
    "updated_at": "2026-08-20T08:00:00.000Z"
  },
  {
    "id": "vac-021",
    "title": "Accounts Clerk",
    "organization": "Gilani's Supermarket Ltd",
    "location": "Nakuru",
    "county": "Nakuru County",
    "category": "Accounting",
    "job_type": "Full-time",
    "salary_range": "KSh 28,000 - KSh 40,000",
    "description": "Gilani's Supermarket Ltd, Nakuru's largest wholesale and supermarket brand, is hiring an Accounts Clerk. The clerk will perform daily cashier balancing, supplier invoice processing, bank reconciliations, VAT schedule preparations, and general ledger journal postings.",
    "responsibilities": [
      "Reconcile daily retail sales cash, card settlements, and M-Pesa till balances.",
      "Verify incoming supplier delivery notes, matching them against purchase orders and tax invoices.",
      "Process accounts payable vouchers and prepare electronic supplier payment schedules.",
      "Assist in monthly physical stock counts and investigate inventory discrepancy variances.",
      "Maintain well-organized financial document archives for internal and statutory audit purposes."
    ],
    "requirements": [
      "CPA Part 2 (Section 4) or Diploma in Accounting / Finance.",
      "Hands-on experience with computerized accounting ERP systems and Microsoft Excel.",
      "Strong numerical accuracy, ethical integrity, and cash reconciliation ability.",
      "Familiarity with retail point-of-sale systems."
    ],
    "qualifications": [
      "CPA II / Diploma in Accounting or Commerce.",
      "Proficiency in QuickBooks, Tally, or SAP retail modules."
    ],
    "experience_required": "Minimum 2 years bookkeeping or accounts clerk experience in a retail or FMCG environment.",
    "application_info": "Send CV and testimonials to careers@gilanis.co.ke or deliver to Gilani's Supermarket offices in Nakuru.",
    "application_link": "https://www.gilanis.co.ke",
    "source_url": "https://www.myjobmag.co.ke/job/accounts-clerk-gilanis-supermarket-nakuru",
    "date_posted": "2026-08-16",
    "closing_date": "2026-09-25",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-16T09:00:00.000Z",
    "updated_at": "2026-08-16T09:00:00.000Z"
  },
  {
    "id": "vac-022",
    "title": "Warehouse Manager",
    "organization": "Gilani's Supermarket Ltd",
    "location": "Nakuru",
    "county": "Nakuru County",
    "category": "Administration",
    "job_type": "Full-time",
    "salary_range": "KSh 55,000 - KSh 80,000",
    "description": "Gilani's Supermarket Ltd is seeking an experienced Warehouse Manager for its central wholesale and retail distribution depot in Nakuru. You will lead goods receipt, inventory storage, stock picking, dispatch fleet loading, and shrinkage control across high-volume FMCG product categories.",
    "responsibilities": [
      "Supervise daily warehouse operations including offloading, inspection, bin storage, and dispatch.",
      "Enforce FIFO/FEFO stock rotation rules to minimize expired or slow-moving goods.",
      "Lead regular cycle counts and quarterly comprehensive inventory audits with minimal variance.",
      "Manage a team of over 40 warehouse assistants, forklift operators, and loaders.",
      "Implement strict warehouse health, safety, fire prevention, and loss prevention controls."
    ],
    "requirements": [
      "Bachelor’s Degree or Higher Diploma in Supply Chain, Logistics, or Business Administration.",
      "Demonstrated experience operating Warehouse Management Systems (WMS) and barcode scanners.",
      "Excellent leadership, logistics planning, and conflict resolution skills.",
      "Solid knowledge of FMCG wholesale and supermarket inventory security."
    ],
    "qualifications": [
      "BSc or Diploma in Supply Chain / Procurement & Logistics Management.",
      "Member of Kenya Institute of Supplies Management (KISM) is preferred."
    ],
    "experience_required": "At least 4 years warehouse and stock management experience, with 2 years at managerial level.",
    "application_info": "Email application and detailed CV to careers@gilanis.co.ke.",
    "application_link": "https://www.gilanis.co.ke",
    "source_url": "https://www.myjobmag.co.ke/job/warehouse-manager-gilanis-supermarket-nakuru",
    "date_posted": "2026-08-16",
    "closing_date": "2026-09-25",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-16T09:30:00.000Z",
    "updated_at": "2026-08-16T09:30:00.000Z"
  },
  {
    "id": "vac-023",
    "title": "Marketing Executive - Nakuru",
    "organization": "Mediheal Group of Hospitals",
    "location": "Nakuru",
    "county": "Nakuru County",
    "category": "Sales & Marketing",
    "job_type": "Full-time",
    "salary_range": "KSh 40,000 - KSh 60,000",
    "description": "Mediheal Group of Hospitals is seeking an ambitious Marketing Executive based in Nakuru. The executive will drive patient referrals, build corporate medical insurance partnerships, coordinate community health camps, and promote specialized surgical and diagnostic services across Nakuru County.",
    "responsibilities": [
      "Build and sustain relationships with corporate clients, insurance providers, SACCOs, and medical clinics.",
      "Organize medical outreach camps, health awareness days, and CME sessions for healthcare practitioners.",
      "Promote tertiary healthcare services including radiology, dialysis, ICU, and surgical packages.",
      "Prepare marketing proposals, track referral numbers, and submit monthly performance analytics.",
      "Conduct regular competitor analysis and identify growth opportunities in Nakuru County."
    ],
    "requirements": [
      "Bachelor’s Degree or Diploma in Marketing, Healthcare Administration, or Public Relations.",
      "Proven experience in hospital marketing, pharmaceutical sales, or diagnostic services marketing.",
      "Outstanding communication, pitch presentation, and corporate relationship building abilities.",
      "Dynamic field person with valid driving license or willingness to travel around the Rift Valley."
    ],
    "qualifications": [
      "Degree or Diploma in Marketing / Business Administration / Healthcare Management.",
      "MSK (Marketing Society of Kenya) membership is an added bonus."
    ],
    "experience_required": "Minimum 2 years marketing experience in a hospital, pharmaceutical, or diagnostic institution.",
    "application_info": "Send application letter and CV to hr.nakuru@medihealgroup.com.",
    "application_link": "https://medihealgroup.com/careers",
    "source_url": "https://www.myjobmag.co.ke/job/marketing-executive-mediheal-nakuru",
    "date_posted": "2026-08-19",
    "closing_date": "2026-09-22",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-19T08:00:00.000Z",
    "updated_at": "2026-08-19T08:00:00.000Z"
  },
  {
    "id": "vac-024",
    "title": "Clinical Nurse - Nakuru East Outreach Clinic",
    "organization": "Aga Khan University Hospital",
    "location": "Nakuru",
    "county": "Nakuru County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "Salary not disclosed",
    "description": "Aga Khan University Hospital, Nairobi is seeking a qualified Clinical Nurse to deliver patient-centered ambulatory care at its modern Outreach Medical Clinic in Nakuru East. The role involves patient assessment, triage, treatment room procedures, patient counselling, and strict adherence to hospital clinical safety protocols.",
    "responsibilities": [
      "Perform initial clinical assessments, triage, and record patient vital signs accurately.",
      "Provide direct nursing treatments including wound dressing, medication administration, and immunizations.",
      "Assist visiting consultant physicians and medical officers during patient examinations and minor procedures.",
      "Educate patients and their families on disease management and wellness maintenance.",
      "Maintain treatment room stock, sterile instruments, and accurate electronic medical records."
    ],
    "requirements": [
      "Diploma in Community Health Nursing (KRCHN) or Bachelor of Science in Nursing (BScN).",
      "Valid registration and annual practicing license from the Nursing Council of Kenya (NCK).",
      "Valid Basic Life Support (BLS) certification.",
      "Exceptional customer care attitude, empathy, and professional integrity."
    ],
    "qualifications": [
      "KRCHN or BScN.",
      "Current NCK practicing retention certificate."
    ],
    "experience_required": "At least 2 years post-internship nursing experience in an outpatient center or busy hospital.",
    "application_info": "Apply online through the Aga Khan University careers portal.",
    "application_link": "https://www.aku.edu/careers/pages/home.aspx",
    "source_url": "https://www.careerjet.co.ke/job/clinical-nurse-nakuru-aga-khan-university-hospital",
    "date_posted": "2026-08-14",
    "closing_date": "2026-09-29",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-14T08:30:00.000Z",
    "updated_at": "2026-08-14T08:30:00.000Z"
  },
  {
    "id": "vac-025",
    "title": "Patient Services Cashier / Receptionist",
    "organization": "Aga Khan Hospital, Mombasa",
    "location": "Mombasa",
    "county": "Mombasa County",
    "category": "Customer Service",
    "job_type": "Full-time",
    "salary_range": "KSh 30,000 - KSh 45,000",
    "description": "The Aga Khan Hospital, Mombasa is looking for a professional and polite Patient Services Cashier / Receptionist. The officer welcomes patients, handles hospital registrations, verifies insurance pre-authorizations, receives cash/card/M-Pesa payments, and delivers top-tier patient service.",
    "responsibilities": [
      "Warmly welcome patients, register new profiles, and guide visitors to appropriate hospital clinics.",
      "Verify medical insurance eligibility, biometrics, and pre-authorization approvals on insurance portals.",
      "Collect and receipt patient co-payments, cash fees, credit card charges, and Safaricom M-Pesa payments.",
      "Prepare accurate daily cashier reconciliations and hand over shift collections to finance.",
      "Handle patient billing inquiries patiently and resolve routine front-desk complaints."
    ],
    "requirements": [
      "Diploma in Front Office Operations, Customer Service, Business Administration, or CPA Part 1.",
      "Experience in hospital reception, cash handling, and medical insurance portals.",
      "High standard of courtesy, empathy, and clear spoken communication in English and Swahili.",
      "Proficiency in computerized billing and Hospital Information Systems."
    ],
    "qualifications": [
      "Diploma in Customer Service / Front Office Management / Business Administration.",
      "CPA Part 1 or equivalent bookkeeping competence is an advantage."
    ],
    "experience_required": "1 to 2 years front-office or cashiering experience in a hospital or hospitality environment.",
    "application_info": "Send your application letter, CV, and testimonials to recruitment.msa@akhskenya.org.",
    "application_link": "https://www.akdn.org/careers",
    "source_url": "https://www.myjobmag.co.ke/job/patient-services-cashier-receptionist-aga-khan-hospital-mombasa",
    "date_posted": "2026-08-21",
    "closing_date": "2026-09-26",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-21T08:00:00.000Z",
    "updated_at": "2026-08-21T08:00:00.000Z"
  },
  {
    "id": "vac-026",
    "title": "Paediatrics Unit Nurse",
    "organization": "Aga Khan Hospital, Mombasa",
    "location": "Mombasa",
    "county": "Mombasa County",
    "category": "Healthcare",
    "job_type": "Full-time",
    "salary_range": "KSh 45,000 - KSh 65,000",
    "description": "The Aga Khan Hospital, Mombasa is inviting applications for a Paediatrics Unit Nurse. You will provide comprehensive inpatient care to pediatric patients, administer medications, manage IV therapies, coordinate with pediatricians, and offer reassurance and health education to parents.",
    "responsibilities": [
      "Provide bedside nursing care and vital signs monitoring for pediatric inpatients.",
      "Calculate and administer pediatric drug doses and infusions with zero error tolerance.",
      "Assess pediatric pain, hydration, and nutritional status, intervening appropriately.",
      "Assist pediatricians with procedures including lumbar punctures, cannulations, and wound dressings.",
      "Maintain rigorous infection prevention protocols and update electronic nursing care plans."
    ],
    "requirements": [
      "Diploma in Community Health Nursing (KRCHN) or Bachelor of Science in Nursing (BScN).",
      "Valid practicing license from the Nursing Council of Kenya.",
      "Pediatric Life Support (PLS) or Emergency Triage Assessment and Treatment (ETAT) certification.",
      "Exceptional patience and warmth in handling ill children and concerned families."
    ],
    "qualifications": [
      "KRCHN or BScN.",
      "Active Nursing Council of Kenya retention certificate."
    ],
    "experience_required": "Minimum 2 years experience in a pediatric ward in an accredited hospital.",
    "application_info": "Submit application with CV and copies of credentials to recruitment.msa@akhskenya.org.",
    "application_link": "https://www.akdn.org/careers",
    "source_url": "https://www.myjobmag.co.ke/job/paediatrics-unit-nurse-aga-khan-hospital-mombasa",
    "date_posted": "2026-08-21",
    "closing_date": "2026-09-26",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-21T08:30:00.000Z",
    "updated_at": "2026-08-21T08:30:00.000Z"
  },
  {
    "id": "vac-027",
    "title": "Marketing & Social Media Executive",
    "organization": "PrideInn Hotels, Resorts & Camps",
    "location": "Mombasa",
    "county": "Mombasa County",
    "category": "Hospitality",
    "job_type": "Full-time",
    "salary_range": "KSh 40,000 - KSh 60,000",
    "description": "PrideInn Hotels, Resorts & Camps is seeking a creative and energetic Marketing & Social Media Executive for its beach resorts in Mombasa (PrideInn Paradise & PrideInn Flamingo). The role will manage digital brand campaigns, content creation, social media channels, local corporate activations, and influencer collaborations.",
    "responsibilities": [
      "Create engaging multimedia content (photography, reels, stories) showcasing resort hospitality and conferences.",
      "Manage official social media accounts (Instagram, TikTok, LinkedIn, Facebook) and engage with followers.",
      "Plan and execute targeted digital advertising campaigns to boost holiday bookings and weekend packages.",
      "Coordinate with corporate sales teams to design promotional flyers, brochures, and email newsletters.",
      "Track digital marketing campaign metrics, ROI, and submit weekly engagement analytics."
    ],
    "requirements": [
      "Bachelor’s Degree or Diploma in Marketing, Digital Media, Mass Communication, or Hospitality.",
      "Hands-on graphic design (Canva, Adobe Photoshop) and video editing capabilities.",
      "Demonstrated portfolio of successful social media campaigns in hospitality or lifestyle brands.",
      "Energetic communicator with creative copywriting flair."
    ],
    "qualifications": [
      "Degree or Diploma in Marketing / Digital Media / Mass Communication.",
      "Certifications in Digital Marketing, Google Ads, or Meta Blueprint are an asset."
    ],
    "experience_required": "Minimum 2 years practical digital marketing and content creation experience, preferably in the hotel industry.",
    "application_info": "Send CV, portfolio links, and motivation letter to careers@prideinn.co.ke.",
    "application_link": "https://prideinn.co.ke/careers",
    "source_url": "https://www.corporatestaffing.co.ke/job/marketing-social-media-executive-prideinn-mombasa",
    "date_posted": "2026-08-25",
    "closing_date": "2026-09-30",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-25T09:00:00.000Z",
    "updated_at": "2026-08-25T09:00:00.000Z"
  },
  {
    "id": "vac-028",
    "title": "Front Office Assistant - Cashier",
    "organization": "The Nairobi Hospital",
    "location": "Nairobi",
    "county": "Nairobi County",
    "category": "Customer Service",
    "job_type": "Full-time",
    "salary_range": "KSh 35,000 - KSh 52,000",
    "description": "The Nairobi Hospital, a premier healthcare institution in East Africa, is recruiting a Front Office Assistant - Cashier. You will provide front-line patient customer service, register outpatient and inpatient admissions, process billing invoices, verify medical insurance smart cards, and receive co-payments.",
    "responsibilities": [
      "Welcome patients and visitors courteously, offering guidance on hospital clinics and admission processes.",
      "Register patients in the hospital management system and issue clinic queue appointments.",
      "Process medical insurance approvals, electronic claims, and biometric validations with providers.",
      "Collect and receipt payments via cash, credit cards, bank transfers, and Safaricom M-Pesa.",
      "Perform shift-end cashier reconciliations and resolve billing inquiries in compliance with hospital standards."
    ],
    "requirements": [
      "Diploma in Front Office Management, Customer Service, Business Administration, or CPA Part 1.",
      "Demonstrated experience handling computerized cashiering, POS systems, and electronic medical claims.",
      "Polished interpersonal presentation, patience, and clear verbal communication.",
      "Ability to work rotating 8-hour shift schedules including nights, weekends, and holidays."
    ],
    "qualifications": [
      "Diploma in Customer Care / Business Administration / Front Office Operations.",
      "CPA I or equivalent accounting certification."
    ],
    "experience_required": "At least 2 years customer service and cashiering experience in a busy hospital or financial institution.",
    "application_info": "Submit application and CV via The Nairobi Hospital recruitment portal at thenairobihosp.org/careers.",
    "application_link": "https://thenairobihosp.org/careers",
    "source_url": "https://www.myjobmag.co.ke/job/front-office-assistant-cashier-the-nairobi-hospital",
    "date_posted": "2026-08-27",
    "closing_date": "2026-09-24",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-27T08:00:00.000Z",
    "updated_at": "2026-08-27T08:00:00.000Z"
  },
  {
    "id": "vac-029",
    "title": "Office Administrator, Centre of Teaching Excellence",
    "organization": "Strathmore University",
    "location": "Nairobi",
    "county": "Nairobi County",
    "category": "Administration",
    "job_type": "Full-time",
    "salary_range": "KSh 50,000 - KSh 75,000",
    "description": "Strathmore University in Madaraka, Nairobi, is hiring an Office Administrator for its Centre of Teaching Excellence. The administrator coordinates executive correspondence, manages center budgets, organizes faculty training workshops, manages logistics for guest lecturers, and maintains administrative archives.",
    "responsibilities": [
      "Provide comprehensive administrative and executive secretarial support to the Director.",
      "Organize faculty pedagogical workshops, seminars, and academic symposiums.",
      "Draft formal correspondence, prepare meeting minutes, and track execution of action items.",
      "Maintain office filing systems, inventory of office supplies, and coordinate center travel arrangements.",
      "Manage departmental petty cash, purchase requisitions, and reconcile monthly expense statements."
    ],
    "requirements": [
      "Bachelor’s Degree in Business Administration, Secretarial Studies, Public Relations, or related field.",
      "Proficiency in Microsoft Office 365, Google Workspace, and enterprise document management.",
      "Strong organizational abilities with keen attention to calendar and event coordination.",
      "Discretion in handling confidential faculty evaluations and university academic records."
    ],
    "qualifications": [
      "Bachelor’s degree in Business Administration, Office Management, or Social Sciences.",
      "Professional secretarial certification (KNEC) or CPS is an added advantage."
    ],
    "experience_required": "Minimum 3 years administrative or executive secretarial experience in a higher education or corporate setting.",
    "application_info": "Submit CV and cover letter to recruitment@strathmore.edu quoting the reference number.",
    "application_link": "https://strathmore.edu/vacancies",
    "source_url": "https://www.corporatestaffing.co.ke/job/office-admin-strathmore-university",
    "date_posted": "2026-08-26",
    "closing_date": "2026-09-18",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-26T09:30:00.000Z",
    "updated_at": "2026-08-26T09:30:00.000Z"
  },
  {
    "id": "vac-030",
    "title": "Regional Relationship Manager - Bancassurance (Nairobi East)",
    "organization": "Equity Bank Kenya",
    "location": "Nairobi",
    "county": "Nairobi County",
    "category": "Business",
    "job_type": "Full-time",
    "salary_range": "KSh 80,000 - KSh 130,000",
    "description": "Equity Bank Kenya is seeking a dynamic Regional Relationship Manager - Bancassurance for the Nairobi East region. The role manages the delivery of general and life insurance products through the branch network, training branch teams, meeting revenue quotas, and managing high-value corporate client accounts.",
    "responsibilities": [
      "Drive growth in insurance premium revenues across designated Equity Bank branches in Nairobi East.",
      "Coach and support branch sales teams and credit officers on identifying customer insurance needs.",
      "Structure custom corporate insurance packages for commercial and institutional banking clients.",
      "Review insurance claims, liaise with underwriters, and ensure prompt settlement for clients.",
      "Ensure strict regulatory compliance with Insurance Regulatory Authority (IRA) and CBK guidelines."
    ],
    "requirements": [
      "Bachelor’s Degree in Insurance, Actuarial Science, Marketing, Business, or Finance.",
      "Professional qualifications in insurance: ACII, AIIK, or COP (Certificate of Proficiency).",
      "Proven track record of exceeding insurance sales targets in banking or insurance brokerages.",
      "Strategic thinker with excellent stakeholder engagement and relationship management capabilities."
    ],
    "qualifications": [
      "Bachelor’s Degree in Business / Insurance / Actuarial Science.",
      "Diploma in Insurance (AIIK) or ACII certification."
    ],
    "experience_required": "At least 4 years experience in bancassurance, corporate insurance sales, or insurance underwriting.",
    "application_info": "Submit application through the Equity Bank career portal.",
    "application_link": "https://equitybank.com/careers",
    "source_url": "https://www.myjobmag.co.ke/job/regional-relationship-manager-bancassurance-equity-bank",
    "date_posted": "2026-08-20",
    "closing_date": "2026-09-25",
    "status": "published",
    "is_active": true,
    "created_at": "2026-08-20T08:30:00.000Z",
    "updated_at": "2026-08-20T08:30:00.000Z"
  }
];
