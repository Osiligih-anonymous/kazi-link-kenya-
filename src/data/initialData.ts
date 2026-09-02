import { JobVacancy, CategoryItem, LocationItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-cs', name: 'Customer Service', count: 28, iconName: 'Headphones' },
  { id: 'cat-sales', name: 'Sales', count: 32, iconName: 'TrendingUp' },
  { id: 'cat-admin', name: 'Administration', count: 24, iconName: 'Briefcase' },
  { id: 'cat-acc', name: 'Accounting / Finance', count: 19, iconName: 'Calculator' },
  { id: 'cat-tech', name: 'Technology / IT', count: 21, iconName: 'Laptop' },
  { id: 'cat-driv', name: 'Driving', count: 18, iconName: 'Car' },
  { id: 'cat-sec', name: 'Security', count: 15, iconName: 'Shield' },
  { id: 'cat-ret', name: 'Retail', count: 22, iconName: 'ShoppingBag' },
  { id: 'cat-hosp', name: 'Hospitality', count: 20, iconName: 'Utensils' },
  { id: 'cat-agri', name: 'Agriculture', count: 16, iconName: 'Sprout' },
  { id: 'cat-const', name: 'Construction', count: 12, iconName: 'HardHat' },
  { id: 'cat-health', name: 'Healthcare', count: 10, iconName: 'Activity' },
  { id: 'cat-edu', name: 'Education', count: 11, iconName: 'GraduationCap' },
  { id: 'cat-clean', name: 'Cleaning', count: 14, iconName: 'Sparkles' },
  { id: 'cat-lab', name: 'General Labour', count: 17, iconName: 'Wrench' },
  { id: 'cat-oth', name: 'Other', count: 8, iconName: 'Layers' },
];

export const INITIAL_LOCATIONS: LocationItem[] = [
  { id: 'loc-nbo', name: 'Nairobi', county: 'Nairobi County', count: 145 },
  { id: 'loc-nak', name: 'Nakuru', county: 'Nakuru County', count: 48 },
  { id: 'loc-mba', name: 'Mombasa', county: 'Mombasa County', count: 46 },
  { id: 'loc-eld', name: 'Eldoret', county: 'Uasin Gishu County', count: 31 },
  { id: 'loc-ksm', name: 'Kisumu', county: 'Kisumu County', count: 35 },
  { id: 'loc-nrk', name: 'Narok', county: 'Narok County', count: 16 },
  { id: 'loc-mch', name: 'Machakos', county: 'Machakos County', count: 22 },
  { id: 'loc-thk', name: 'Thika', county: 'Kiambu County', count: 20 },
  { id: 'loc-kbu', name: 'Kiambu', county: 'Kiambu County', count: 17 },
  { id: 'loc-rru', name: 'Ruiru', county: 'Kiambu County', count: 14 },
  { id: 'loc-nye', name: 'Nyeri', county: 'Nyeri County', count: 12 },
  { id: 'loc-mrg', name: 'Murang\'a', county: 'Murang\'a County', count: 10 },
  { id: 'loc-glg', name: 'Gilgil', county: 'Nakuru County', count: 7 },
  { id: 'loc-mld', name: 'Malindi', county: 'Kilifi County', count: 9 },
  { id: 'loc-nvs', name: 'Naivasha', county: 'Nakuru County', count: 11 },
  { id: 'loc-krc', name: 'Kericho', county: 'Kericho County', count: 9 },
  { id: 'loc-ktl', name: 'Kitale', county: 'Trans Nzoia County', count: 8 },
];

export const INITIAL_VACANCIES: JobVacancy[] = [
  {
    id: 'vac-001',
    title: 'Customer Service Representative',
    organization: 'SafariCall Solutions Kenya Ltd',
    location: 'Nairobi',
    category: 'Customer Service',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'SafariCall Solutions Kenya Ltd is seeking a friendly, customer-focused Customer Service Representative to join our Nairobi front-office and client operations hub in Upper Hill. You will serve as the first point of contact for inquiries, resolving customer complaints, handling account queries, and maintaining high client satisfaction standards across email, phone, and walk-in channels.',
    responsibilities: [
      'Handle incoming phone calls, WhatsApp inquiries, and walk-in client requests professionally and promptly.',
      'Accurately log customer issues, ticket details, and resolutions into the CRM software.',
      'Follow up on open customer tickets to ensure issues are resolved within agreed service level agreements (SLAs).',
      'Provide clear explanations of company services, subscription packages, and payment methods including M-Pesa.',
      'Escalate complex technical or billing discrepancies to department supervisors.',
      'Collect customer feedback and recommend workflow improvements to management.'
    ],
    requirements: [
      'Minimum 1-2 years of relevant customer care, call handling, or front-office support experience.',
      'Excellent verbal and written communication skills in both English and Kiswahili.',
      'High typing speed (minimum 35 WPM) and proficiency with MS Office (Word, Excel) and email.',
      'Strong active listening, conflict resolution, and interpersonal abilities.',
      'Ability to multitask calmly and professionally during peak business hours.'
    ],
    qualifications: [
      'Diploma in Customer Service Management, Public Relations, Mass Communication, or Business Administration.',
      'Minimum KCSE mean grade of C (Plain) or equivalent.',
      'Valid Certificate of Good Conduct from DCI.'
    ],
    application_info: 'Shortlisted candidates will be invited for an in-person assessment and interview at our Upper Hill, Nairobi offices.',
    closing_date: '2026-10-25',
    status: 'published',
    created_at: '2026-08-25T08:00:00.000Z',
    updated_at: '2026-08-25T08:00:00.000Z',
  },
  {
    id: 'vac-002',
    title: 'Sales Representative',
    organization: 'Twiga Commercial Distributors Ltd',
    location: 'Nairobi',
    category: 'Sales',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 40,000',
    description: 'Twiga Commercial Distributors Ltd, a fast-growing distributor of fast-moving consumer goods (FMCG) and household essentials, is hiring an energetic Sales Representative based in Industrial Area, Nairobi. You will be responsible for mapping retail outlets, pitching product lines, securing daily stock orders, and achieving sales targets across key Nairobi routes.',
    responsibilities: [
      'Conduct daily field visits to wholesalers, supermarkets, and duka retailers within designated Nairobi routes.',
      'Present, promote, and sell company product catalogue to new and existing merchant clients.',
      'Negotiate order quantities, delivery schedules, and payment terms in line with company credit policy.',
      'Achieve and consistently surpass agreed monthly sales volume and revenue targets.',
      'Collect market intelligence on competitor pricing, new product launches, and retail trends.',
      'Prepare daily sales reconciliation reports and route activity summaries for the Territory Manager.'
    ],
    requirements: [
      'At least 1-2 years of field sales experience in FMCG, retail distribution, or merchant onboarding.',
      'Proven track record of meeting daily and monthly sales quotas.',
      'Energetic, self-driven, and confident communicator fluent in English and Kiswahili.',
      'Strong negotiation, persuasion, and customer relationship building skills.',
      'Good geographical knowledge of Nairobi estates, commercial hubs, and retail zones.'
    ],
    qualifications: [
      'Certificate or Diploma in Sales & Marketing, Business Management, or related field.',
      'Minimum KCSE mean grade of D+ (Plus) or above.'
    ],
    application_info: 'Monthly commission bonuses are awarded on performance surpassing route targets.',
    closing_date: '2026-10-28',
    status: 'published',
    created_at: '2026-08-25T09:30:00.000Z',
    updated_at: '2026-08-25T09:30:00.000Z',
  },
  {
    id: 'vac-003',
    title: 'Junior Accountant',
    organization: 'Baraka Financial Advisors & Associates',
    location: 'Nairobi',
    category: 'Accounting / Finance',
    job_type: 'Full-time',
    salary_range: 'KSh 35,000 - KSh 50,000',
    description: 'Baraka Financial Advisors & Associates is recruiting a detail-oriented Junior Accountant for our central Nairobi practice in the CBD. The successful candidate will support day-to-day financial bookkeeping, bank reconciliations, accounts payable and receivable tracking, and statutory tax filings on the KRA iTax and eTIMS platforms.',
    responsibilities: [
      'Post daily financial transactions, vendor invoices, petty cash vouchers, and customer receipts into QuickBooks Online.',
      'Reconcile commercial bank statements, M-Pesa paybill accounts, and petty cash balances on a weekly and monthly basis.',
      'Prepare and file monthly statutory tax returns on KRA iTax (PAYE, VAT, NSSF, SHA/SHIF, Housing Levy).',
      'Issue electronic tax invoices through KRA eTIMS and follow up on outstanding client receivables.',
      'Assist the Senior Accountant in preparing monthly trial balances, expenditure summaries, and audit schedules.',
      'Maintain organized digital and physical financial filing systems for easy retrieval and compliance.'
    ],
    requirements: [
      'Solid working knowledge of accounting principles, general ledger entries, and financial reconciliation.',
      'Hands-on proficiency with computerized accounting packages (QuickBooks or Sage) and advanced MS Excel.',
      'Practical understanding of Kenyan statutory tax filing procedures (KRA iTax & eTIMS).',
      'High level of mathematical accuracy, integrity, and meticulous attention to detail.',
      '1-2 years of accounting or bookkeeping experience (internship in an audit firm is welcomed).'
    ],
    qualifications: [
      'CPA Foundation / CPA Part II (Sections 3 & 4) or Diploma in Accounting / Finance.',
      'Bachelor of Commerce / Accounting degree is an added advantage.',
      'Minimum KCSE mean grade of C+ (Plus) with at least C+ in Mathematics.'
    ],
    application_info: 'Please bring original certificates and academic transcripts when invited for the practical Excel assessment.',
    closing_date: '2026-10-30',
    status: 'published',
    created_at: '2026-08-26T08:00:00.000Z',
    updated_at: '2026-08-26T08:00:00.000Z',
  },
  {
    id: 'vac-004',
    title: 'Office Administrator',
    organization: 'Apex Business Chambers Ltd',
    location: 'Nairobi',
    category: 'Administration',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Apex Business Chambers Ltd is seeking a proactive and organized Office Administrator to oversee general administrative workflow, facility maintenance, procurement of office supplies, and executive calendar scheduling at our modern offices in Westlands, Nairobi.',
    responsibilities: [
      'Coordinate day-to-day office operations, executive scheduling, board meetings, and official appointments.',
      'Supervise front-desk attendants, office messengers, cleaning personnel, and facility maintenance contractors.',
      'Manage office inventory, stationery reordering, and utility bill settlements (electricity, water, internet).',
      'Draft official correspondence, memos, meeting minutes, and executive briefing reports.',
      'Oversee physical document archiving, confidential records management, and electronic document indexing.',
      'Plan logistical arrangements for company workshops, seminars, and visiting delegates.'
    ],
    requirements: [
      'At least 2 years of proven administrative or office management experience in a busy professional setting.',
      'Advanced computer literacy in MS Office Suite (Word, Excel, PowerPoint, Outlook) and Google Workspace.',
      'Excellent organizational, time management, and multi-tasking skills with high autonomy.',
      'Strong written and verbal business English communication skills.',
      'Demonstrated discretion and confidentiality when handling management information.'
    ],
    qualifications: [
      'Diploma or Degree in Business Administration, Office Management, Secretarial Studies, or related field.',
      'KCSE mean grade of C (Plain) or above.'
    ],
    application_info: 'Immediate opening for a qualified professional ready to commence work upon completion of onboarding.',
    closing_date: '2026-10-22',
    status: 'published',
    created_at: '2026-08-26T10:15:00.000Z',
    updated_at: '2026-08-26T10:15:00.000Z',
  },
  {
    id: 'vac-005',
    title: 'Receptionist',
    organization: 'Savannah Medical & Wellness Clinic',
    location: 'Nairobi',
    category: 'Administration',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 35,000',
    description: 'Savannah Medical & Wellness Clinic, a premier private outpatient healthcare provider in Kilimani, Nairobi, is hiring a courteous and well-groomed Receptionist. You will be the welcoming face of our clinic, greeting patients, managing clinic appointment bookings, and ensuring a comfortable reception lounge environment.',
    responsibilities: [
      'Warmly receive and register patients, visitors, and corporate clients arriving at the reception desk.',
      'Answer switchboard calls, respond to WhatsApp inquiries, and direct queries to respective doctors or departments.',
      'Schedule doctor consultations, diagnostic appointments, and follow-up medical reviews in the clinic software.',
      'Collect consultation fees via M-Pesa or card terminal and issue valid clinic receipts.',
      'Keep the reception lounge, magazine stands, and visitor waiting areas tidy and presentable at all times.',
      'Maintain strict confidentiality of all patient demographic information and medical visitation logs.'
    ],
    requirements: [
      'Minimum 1 year experience in a reception, front desk, or customer-facing hospitality role.',
      'Pleasant personality, warm interpersonal demeanor, and professional personal grooming.',
      'Clear verbal communication and telephone etiquette in English and Kiswahili.',
      'Computer literate with ability to learn clinic scheduling and invoicing software quickly.',
      'Calm composure and patience when dealing with anxious patients or emergency arrivals.'
    ],
    qualifications: [
      'Certificate or Diploma in Front Office Operations, Secretarial Studies, Customer Care, or Hospitality.',
      'Minimum KCSE mean grade of C- (Minus) or equivalent.'
    ],
    application_info: 'Work shift rota includes daytime hours Monday to Saturday.',
    closing_date: '2026-10-20',
    status: 'published',
    created_at: '2026-08-27T08:30:00.000Z',
    updated_at: '2026-08-27T08:30:00.000Z',
  },
  {
    id: 'vac-006',
    title: 'Driver',
    organization: 'TransitPoint Fleet Logistics Ltd',
    location: 'Nairobi',
    category: 'Driving',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 40,000',
    description: 'TransitPoint Fleet Logistics Ltd is looking for a reliable, disciplined, and safety-conscious Driver to operate company passenger vans and light delivery pickup vehicles across the Nairobi Metropolitan Area. You will safely transport corporate staff, deliver parcels, and carry out vehicle routine upkeep.',
    responsibilities: [
      'Safely transport company personnel, clients, and light cargo to scheduled destinations across Nairobi and surrounding counties.',
      'Carry out daily pre-trip vehicle inspections including engine oil, coolant, brake fluid, tyre pressure, and battery status.',
      'Accurately maintain vehicle logbooks, fuel receipts, work tickets, and mileage entries.',
      'Ensure company vehicles are kept clean, serviced on schedule, and inspected regularly.',
      'Strictly adhere to NTSA traffic rules, speed limits, and road safety regulations at all times.',
      'Report any vehicle mechanical faults, incidents, or insurance renewal dates to the Fleet Supervisor promptly.'
    ],
    requirements: [
      'Valid Kenyan Smart Driving License (Class B, C, or BCE) with a clean driving record.',
      'Minimum 4 years of continuous commercial or corporate driving experience within Nairobi.',
      'Valid Certificate of Good Conduct from the Directorate of Criminal Investigations (DCI).',
      'Defensive driving certification from AA Kenya or National Youth Service (NYS) is an added advantage.',
      'Good geographical knowledge of Nairobi roads, bypasses, estates, and traffic patterns.'
    ],
    qualifications: [
      'KCSE Certificate with minimum grade of D (Plain) or above.',
      'Basic motor vehicle mechanics certificate from a recognized technical institute is a plus.'
    ],
    application_info: 'A practical driving test and vehicle inspection assessment will be conducted during the interview process.',
    closing_date: '2026-10-18',
    status: 'published',
    created_at: '2026-08-27T11:00:00.000Z',
    updated_at: '2026-08-27T11:00:00.000Z',
  },
  {
    id: 'vac-007',
    title: 'Security Guard',
    organization: 'ShieldGuard Patrol Services Kenya',
    location: 'Nairobi',
    category: 'Security',
    job_type: 'Full-time',
    salary_range: 'KSh 18,000 - KSh 25,000',
    description: 'ShieldGuard Patrol Services Kenya is recruiting vigilant and disciplined Security Guards to provide physical security guarding, visitor screening, and asset protection across commercial office buildings, warehouses, and residential gated communities in Nairobi.',
    responsibilities: [
      'Conduct access control at main entrance gates, screen visitors using handheld metal detectors, and inspect vehicle boots.',
      'Accurately maintain visitor occurrence books (OB), vehicle registration logs, and gate pass slips.',
      'Perform routine perimeter foot patrols to identify security vulnerabilities, broken fences, or suspicious activities.',
      'Monitor premises CCTV feeds and report unusual occurrences immediately to the central control room.',
      'Enforce property safety protocols, prevent unauthorized entry, and respond swiftly to fire alarms or emergencies.',
      'Provide a polite and welcoming presence while firmly upholding security regulations for all visitors.'
    ],
    requirements: [
      'Physically fit and alert with no medical impairments affecting standing or patrolling.',
      'Height requirement: Minimum 5ft 8in for male applicants and 5ft 4in for female applicants.',
      'Valid Certificate of Good Conduct (not older than 6 months).',
      'Clear command of basic spoken English and Kiswahili.',
      'Previous security guard training or NYS service is an added advantage.'
    ],
    qualifications: [
      'Minimum KCSE mean grade of D (Plain) or D+ (Plus).',
      'Discharge letter or recommendation from previous security company or local administration chief if entry-level.'
    ],
    application_info: 'Uniforms, boots, and company training will be provided upon recruitment.',
    closing_date: '2026-10-27',
    status: 'published',
    created_at: '2026-08-27T14:20:00.000Z',
    updated_at: '2026-08-27T14:20:00.000Z',
  },
  {
    id: 'vac-008',
    title: 'Call Centre Agent',
    organization: 'EchoCall Contact Hub Ltd',
    location: 'Nairobi',
    category: 'Customer Service',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 38,000',
    description: 'EchoCall Contact Hub Ltd, a modern business process outsourcing (BPO) centre based on Ngong Road, Nairobi, is hiring enthusiastic Call Centre Agents. You will handle inbound support calls, answer customer questions regarding e-commerce orders and digital banking, and perform outbound tele-surveys in a fast-paced team setting.',
    responsibilities: [
      'Manage high volumes of inbound and outbound customer calls in a timely and professional manner.',
      'Identify customer needs, research issues using internal knowledge bases, and provide accurate product solutions.',
      'Maintain average handling time (AHT) and first-call resolution (FCR) targets set by the operations manager.',
      'Accurately log call disposition summaries, customer inquiries, and escalations into the CRM system.',
      'Handle difficult or frustrated callers with empathy, patience, and de-escalation techniques.',
      'Participate in ongoing quality coaching sessions to enhance voice etiquette and product knowledge.'
    ],
    requirements: [
      'Excellent spoken English and Kiswahili with clear voice clarity and active listening skills.',
      'Fast computer keyboard typing speed (at least 30 WPM) and basic computer navigation skills.',
      'Willingness to work flexible shift schedules (including morning, afternoon, and weekend shifts).',
      'High emotional intelligence, resilience, and a positive team-player attitude.',
      'Prior experience in a call centre, BPO, or telephone customer support role is a plus (fresh graduates welcome).'
    ],
    qualifications: [
      'Certificate, Diploma, or Degree in any field (Mass Media, Communication, IT, or Humanities).',
      'Minimum KCSE mean grade of C- (Minus) with at least C in English.'
    ],
    application_info: 'Comprehensive 2-week paid product and voice training is provided to successful candidates.',
    closing_date: '2026-10-24',
    status: 'published',
    created_at: '2026-08-28T08:00:00.000Z',
    updated_at: '2026-08-28T08:00:00.000Z',
  },
  {
    id: 'vac-009',
    title: 'Procurement Assistant',
    organization: 'PrimeBuild Construction Supplies Ltd',
    location: 'Nairobi',
    category: 'Administration',
    job_type: 'Full-time',
    salary_range: 'KSh 35,000 - KSh 50,000',
    description: 'PrimeBuild Construction Supplies Ltd is hiring a motivated Procurement Assistant for our Nairobi head office along Enterprise Road. You will support supplier sourcing, quotation analysis, purchase order (LPO) preparation, vendor database updates, and goods receipt inspections for building materials.',
    responsibilities: [
      'Prepare requests for quotation (RFQs) and source competitive pricing from approved suppliers.',
      'Analyze vendor bids, prepare comparative price schedules, and recommend best-value suppliers.',
      'Generate local purchase orders (LPOs) in the ERP system and track supplier fulfillment timelines.',
      'Inspect delivered goods against purchase orders, delivery notes, and quality specifications before signing GRNs.',
      'Maintain an up-to-date database of prequalified vendors, business permits, and tax compliance certificates.',
      'Coordinate with the finance team to ensure timely processing of supplier invoices and payments.'
    ],
    requirements: [
      'Solid understanding of supply chain procedures, public/private procurement best practices, and inventory basics.',
      'Proficiency in ERP systems (SAP, Sage, or QuickBooks) and advanced MS Excel.',
      'Strong negotiation, numerical evaluation, and commercial communication skills.',
      'High ethical standards, accountability, and refusal of conflicts of interest.',
      '1-2 years experience in purchasing, supplies management, or stores coordination.'
    ],
    qualifications: [
      'Diploma or Degree in Purchasing and Supplies Management, Supply Chain, or CIPS qualification.',
      'Member of KISM (Kenya Institute of Supplies Management) or student member is an added advantage.',
      'KCSE mean grade of C (Plain) or above.'
    ],
    application_info: 'Attach copies of KISM registration or academic certificates when submitting your application.',
    closing_date: '2026-10-29',
    status: 'published',
    created_at: '2026-08-28T10:00:00.000Z',
    updated_at: '2026-08-28T10:00:00.000Z',
  },
  {
    id: 'vac-010',
    title: 'Storekeeper',
    organization: 'Ushindi Wholesale & Hardware Ltd',
    location: 'Nairobi',
    category: 'Retail',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 35,000',
    description: 'Ushindi Wholesale & Hardware Ltd is looking for an organized and trustworthy Storekeeper to manage daily stock receipts, bin-card entries, warehousing organization, and goods dispatch at our central warehouse in Embakasi, Nairobi.',
    responsibilities: [
      'Receive incoming stock consignments, inspect packaging for damages, and verify quantities against delivery notes.',
      'Accurately post stock receipts, issues, and transfers on physical bin cards and computerized inventory software.',
      'Organize warehouse shelving, ensure proper labeling of SKUs, and maintain clean storage passageways.',
      'Issue requested tools, hardware, and goods to sales reps or dispatch drivers upon receipt of authorized requisitions.',
      'Conduct periodic physical cycle stock counts and investigate variances between physical counts and system balances.',
      'Enforce warehouse safety, fire prevention guidelines, and theft-prevention measures.'
    ],
    requirements: [
      'Minimum 1-2 years experience as a storekeeper, warehouse clerk, or inventory assistant.',
      'Good numerical skills and familiarity with inventory management software or MS Excel.',
      'High level of honesty, integrity, and diligence with company assets.',
      'Physically capable of manual lifting and managing stock movements inside the warehouse.',
      'Good communication skills in English and Kiswahili.'
    ],
    qualifications: [
      'Certificate or Diploma in Stores Management, Warehousing, Purchasing & Supplies, or Business Administration.',
      'Minimum KCSE mean grade of D+ (Plus) or above.'
    ],
    application_info: 'References from previous employers will be contacted during background verification.',
    closing_date: '2026-10-26',
    status: 'published',
    created_at: '2026-08-28T13:45:00.000Z',
    updated_at: '2026-08-28T13:45:00.000Z',
  },
  {
    id: 'vac-011',
    title: 'Digital Marketing Assistant',
    organization: 'Mwangaza Brand Studios Kenya',
    location: 'Nairobi',
    category: 'Technology / IT',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Mwangaza Brand Studios Kenya is looking for a creative, data-aware Digital Marketing Assistant to join our digital team in Kilimani, Nairobi. You will assist in content creation, social media community management (TikTok, Instagram, LinkedIn, Facebook), email newsletters, and running paid Meta/Google ad campaigns.',
    responsibilities: [
      'Create engaging social media posts, short reels, infographics, and copy for client brand channels.',
      'Manage day-to-day community engagement by responding promptly to comments, DMs, and mentions.',
      'Assist in setting up and monitoring targeted social ad campaigns on Meta Ads Manager and Google Ads.',
      'Write compelling blog posts, product descriptions, and promotional email broadcasts.',
      'Track key digital metrics (reach, impressions, click-through rates, conversions) and compile weekly performance reports.',
      'Stay updated with emerging viral trends, content formats, and algorithmic shifts across Kenyan social platforms.'
    ],
    requirements: [
      'Demonstrable experience managing professional social media accounts or digital campaigns.',
      'Proficiency with graphic design tools like Canva, Adobe Photoshop, or Illustrator, and video editors like CapCut.',
      'Excellent copy-writing skills in English and contemporary Sheng/Kiswahili for local audience engagement.',
      'Basic understanding of SEO principles, Google Analytics, and lead-generation techniques.',
      '1+ years experience in digital marketing, social media management, or content creation.'
    ],
    qualifications: [
      'Diploma or Degree in Digital Marketing, Mass Communication, Public Relations, Graphic Design, or IT.',
      'Portfolio of previous creative work, social pages managed, or graphic samples.'
    ],
    application_info: 'Please include links to social media accounts or creative portfolios you have managed.',
    closing_date: '2026-10-31',
    status: 'published',
    created_at: '2026-08-29T08:15:00.000Z',
    updated_at: '2026-08-29T08:15:00.000Z',
  },
  {
    id: 'vac-012',
    title: 'IT Support Technician',
    organization: 'ByteLink Network Solutions Kenya',
    location: 'Nairobi',
    category: 'Technology / IT',
    job_type: 'Full-time',
    salary_range: 'KSh 35,000 - KSh 55,000',
    description: 'ByteLink Network Solutions Kenya is seeking an experienced IT Support Technician to provide tier-1/2 technical support, LAN/WAN networking maintenance, PC hardware troubleshooting, and printer/VoIP setups for corporate clients across Nairobi.',
    responsibilities: [
      'Diagnose and resolve workstation hardware faults, operating system errors (Windows, macOS, Linux), and software glitches.',
      'Configure, install, and maintain office network equipment including routers, switches, access points, and LAN cabling.',
      'Set up new user accounts, Microsoft 365 / Google Workspace emails, and antivirus security configurations.',
      'Troubleshoot network printers, scanners, biometric access control systems, and CCTV IP cameras.',
      'Perform routine data backups, system patches, and security audits across client servers and endpoints.',
      'Document IT support tickets, asset inventories, and maintenance schedules in the helpdesk portal.'
    ],
    requirements: [
      'Solid working knowledge of computer hardware architecture, TCP/IP networking, DHCP, and DNS.',
      'Experience configuring Microsoft 365, Active Directory, Windows Server, and cloud backup utilities.',
      'Hands-on ability to crimp network cables, test patch panels, and configure wireless access points.',
      'Strong analytical problem-solving mindset and excellent customer communication skills.',
      '2+ years of practical IT support, desktop engineering, or networking experience.'
    ],
    qualifications: [
      'Diploma or Degree in Information Technology, Computer Science, or Electrical/Telecommunication Engineering.',
      'CompTIA A+, Network+, CCNA, or Microsoft Certified Associate certification is a strong advantage.',
      'Minimum KCSE mean grade of C (Plain) or above.'
    ],
    application_info: 'Practical network troubleshooting and PC assembly test will be administered during final interview.',
    closing_date: '2026-11-04',
    status: 'published',
    created_at: '2026-08-29T10:00:00.000Z',
    updated_at: '2026-08-29T10:00:00.000Z',
  },
  {
    id: 'vac-013',
    title: 'Sales & Marketing Executive',
    organization: 'Rift Valley Commercial Distributors Ltd',
    location: 'Nakuru',
    category: 'Sales',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Rift Valley Commercial Distributors Ltd is hiring an ambitious Sales & Marketing Executive based in Nakuru City. You will spearhead regional business development, establish relationships with agribusinesses, retail stockists, and hotels, and drive brand visibility across Nakuru County.',
    responsibilities: [
      'Prospect and onboard new commercial accounts, retailers, institutions, and hospitality clients across Nakuru.',
      'Conduct product demonstrations, prepare customized price proposals, and close sales contracts.',
      'Organize regional marketing activations, market day displays, and trade fair exhibitions.',
      'Maintain regular communication with existing clients to encourage repeat purchases and upsell new product lines.',
      'Monitor competitor marketing campaigns, market pricing changes, and consumer preferences in the South Rift.',
      'Submit weekly sales pipelines, customer visit reports, and revenue forecasts to the Regional Director.'
    ],
    requirements: [
      'Minimum 2 years of sales and business development experience in Nakuru or the wider Rift Valley region.',
      'Proven record of achieving sales targets in B2B or B2C environments.',
      'Excellent negotiation, public presentation, and relationship-building capabilities.',
      'Good knowledge of Nakuru business districts, sub-counties (Naivasha, Molo, Gilgil), and trading centers.',
      'Self-motivated with high energy and ability to work independently with minimal supervision.'
    ],
    qualifications: [
      'Diploma or Degree in Sales & Marketing, Commerce, Business Administration, or related discipline.',
      'Minimum KCSE mean grade of C- (Minus) or above.'
    ],
    application_info: 'Attractive monthly sales commissions and transport facilitation provided for field travel.',
    closing_date: '2026-11-02',
    status: 'published',
    created_at: '2026-08-29T14:30:00.000Z',
    updated_at: '2026-08-29T14:30:00.000Z',
  },
  {
    id: 'vac-014',
    title: 'Hotel Receptionist',
    organization: 'Nyali Breeze Coastal Resort & Spa',
    location: 'Mombasa',
    category: 'Hospitality',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 35,000',
    description: 'Nyali Breeze Coastal Resort & Spa in Mombasa is looking for a courteous, hospitable, and bilingual Hotel Receptionist. You will welcome international and domestic holidaymakers, manage check-in and check-out procedures, process guest payments, and assist with excursion and dining reservations.',
    responsibilities: [
      'Greet arriving resort guests warmly, verify reservations, assign rooms, and complete check-in formalities.',
      'Provide detailed orientation on hotel amenities, pool hours, dining options, and beach recreational activities.',
      'Answer front desk phone calls, attend to guest inquiries, and resolve room maintenance or service complaints swiftly.',
      'Process accommodation billing, room service charges, card payments, and M-Pesa receipts upon guest check-out.',
      'Coordinate with housekeeping, concierge, and food & beverage teams to accommodate special guest requests.',
      'Maintain accurate guest registration folios and foreign exchange conversion records.'
    ],
    requirements: [
      '1-2 years experience in front desk operations in a star-rated hotel, resort, or serviced apartments.',
      'Professional grooming, warm demeanour, and a genuine passion for coastal hospitality.',
      'Proficiency in hotel property management systems (PMS) like Opera, Micros, or Fidelio is an asset.',
      'Fluent in English and Kiswahili (fluency in basic German, French, or Italian is an added advantage).',
      'Flexibility to work day and night shifts, weekends, and public holidays as standard in hospitality.'
    ],
    qualifications: [
      'Certificate or Diploma in Front Office Operations, Hospitality Management from Kenya Utalii College or accredited college.',
      'Minimum KCSE mean grade of C- (Minus) or equivalent.'
    ],
    application_info: 'Duty meals and uniform provided while on shift at the resort.',
    closing_date: '2026-10-28',
    status: 'published',
    created_at: '2026-08-30T07:45:00.000Z',
    updated_at: '2026-08-30T07:45:00.000Z',
  },
  {
    id: 'vac-015',
    title: 'Accounts Assistant',
    organization: 'Highland Grain Millers Ltd',
    location: 'Eldoret',
    category: 'Accounting / Finance',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Highland Grain Millers Ltd, a major cereal processing company based in Eldoret, is recruiting an Accounts Assistant. You will support daily ledger postings, weighbridge purchase reconciliations, farmer payment vouchers, and statutory tax compliance.',
    responsibilities: [
      'Verify and process farmer grain delivery weighbridge tickets against purchase orders and approved buying rates.',
      'Post supplier invoices, expense vouchers, and bank payments into QuickBooks accounting software.',
      'Reconcile grain stock accounts, debtor ledgers, and bank statements at the end of every week.',
      'Prepare monthly statutory payroll deduction schedules (PAYE, NSSF, SHA/SHIF, and Housing Levy).',
      'Maintain petty cash records, disburse approved office funds, and conduct periodic cash counts.',
      'Assist internal and external auditors with supporting document retrieval during financial audits.'
    ],
    requirements: [
      'Working knowledge of bookkeeping, double-entry accounting, and inventory accounting concepts.',
      'Proficiency in computerized accounting systems (QuickBooks, Sage, or Tally) and MS Excel.',
      'Familiarity with KRA iTax returns and statutory deduction deadlines in Kenya.',
      'High level of personal integrity, reliability, and precision with numbers.',
      'At least 1-2 years experience in an accounting or cashier role (manufacturing/agro-processing experience preferred).'
    ],
    qualifications: [
      'CPA Part 2 (Section 3 or 4) or Diploma in Accounting / Finance / Business Management.',
      'Minimum KCSE mean grade of C (Plain) with good grades in Mathematics and English.',
      'Certificate of Good Conduct from DCI.'
    ],
    application_info: 'Candidates residing in Eldoret or Uasin Gishu County are strongly encouraged to apply.',
    closing_date: '2026-11-05',
    status: 'published',
    created_at: '2026-08-30T09:15:00.000Z',
    updated_at: '2026-08-30T09:15:00.000Z',
  },
  {
    id: 'vac-016',
    title: 'Customer Care Officer',
    organization: 'Victoria Water & Solar Solutions',
    location: 'Kisumu',
    category: 'Customer Service',
    job_type: 'Full-time',
    salary_range: 'KSh 28,000 - KSh 40,000',
    description: 'Victoria Water & Solar Solutions is looking for a proactive Customer Care Officer to join our regional branch in Kisumu CBD. You will handle customer inquiries, onboard water pump and solar kit buyers, handle warranty claims, and manage follow-ups across the Western Kenya region.',
    responsibilities: [
      'Receive client inquiries via walk-in front desk, telephone calls, and digital platforms.',
      'Guide customers on solar equipment, water filtration kits, pump capacities, and payment plans.',
      'Register customer warranty cards and book technical installation appointments for field engineers.',
      'Follow up with clients after system installation to evaluate satisfaction and collect feedback.',
      'Handle customer warranty complaints calmly, coordinate replacements, and maintain resolution logs.',
      'Prepare monthly customer engagement and retention reports for the Branch Manager.'
    ],
    requirements: [
      '1-2 years experience in customer service, front-office coordination, or client relations.',
      'Fluent in English, Kiswahili; local regional language knowledge (Dholuo) is an added communication advantage.',
      'Excellent interpersonal, problem-solving, and conflict resolution skills.',
      'Computer literate with proficiency in MS Word, Excel, and email software.',
      'Polite, empathetic, and patient attitude when dealing with challenging client queries.'
    ],
    qualifications: [
      'Diploma in Customer Relations, Public Relations, Marketing, Business Administration, or related field.',
      'Minimum KCSE mean grade of C- (Minus) or above.'
    ],
    application_info: 'Interviews will be conducted at our Kisumu CBD regional offices.',
    closing_date: '2026-11-08',
    status: 'published',
    created_at: '2026-08-30T11:00:00.000Z',
    updated_at: '2026-08-30T11:00:00.000Z',
  },
  {
    id: 'vac-017',
    title: 'Logistics Assistant',
    organization: 'Trans-East Cargo Express Ltd',
    location: 'Nairobi',
    category: 'Driving',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Trans-East Cargo Express Ltd, a courier and freight dispatch firm with depots across Kenya, is hiring a Logistics Assistant for our dispatch hub on Mombasa Road, Nairobi. You will coordinate daily vehicle route planning, track freight consignments, liaise with drivers, and maintain delivery manifests.',
    responsibilities: [
      'Plan daily delivery and collection routes for dispatch riders and van drivers across Nairobi and upcountry.',
      'Track vehicle GPS locations in real time to ensure timely consignment delivery and route adherence.',
      'Verify airway bills, cargo manifests, delivery notes, and gate clearance passes.',
      'Coordinate with warehouse loading teams to ensure consignments are safely packed and labeled.',
      'Communicate transit updates and ETA notifications to corporate clients and receiving depots.',
      'Monitor fleet fuel consumption, toll fees, vehicle maintenance logs, and driver shift rosters.'
    ],
    requirements: [
      '1-2 years experience in logistics, courier dispatch, transport fleet coordination, or freight forwarding.',
      'Familiarity with GPS fleet tracking software, logistics ERPs, and MS Excel spreadsheets.',
      'Good geographical knowledge of Kenyan transport corridors, bypasses, and county cargo hubs.',
      'Strong coordination, multi-tasking, and fast problem-solving abilities under pressure.',
      'High integrity, punctuality, and commitment to cargo safety standards.'
    ],
    qualifications: [
      'Diploma in Logistics & Supply Chain Management, Transport Management, or Business Administration.',
      'Minimum KCSE mean grade of C- (Minus) or equivalent.'
    ],
    application_info: 'Opportunity for career growth into Fleet Operations Supervisor within our logistics network.',
    closing_date: '2026-11-06',
    status: 'published',
    created_at: '2026-08-30T13:30:00.000Z',
    updated_at: '2026-08-30T13:30:00.000Z',
  },
  {
    id: 'vac-018',
    title: 'Farm Supervisor',
    organization: 'Menengai Agri-Ventures Kenya Ltd',
    location: 'Nakuru',
    category: 'Agriculture',
    job_type: 'Full-time',
    salary_range: 'KSh 30,000 - KSh 45,000',
    description: 'Menengai Agri-Ventures Kenya Ltd is looking for a hands-on and experienced Farm Supervisor to manage daily agricultural operations across our 30-acre mixed farming and dairy enterprise in Rongai, Nakuru County.',
    responsibilities: [
      'Supervise daily field activities including land preparation, seeding, drip irrigation, weeding, and crop harvesting.',
      'Oversee dairy cattle herd management, feeding rations, milking hygiene, and veterinary vaccination schedules.',
      'Allocate daily duties to farm casual laborers, track attendance, and submit weekly wage muster rolls.',
      'Monitor farm chemical and fertilizer applications in accordance with KEPHIS health and environmental standards.',
      'Maintain inventory of farm inputs, tractor fuel, tools, animal feeds, and produce harvest records.',
      'Submit weekly crop yield, milk production, and farm expenditure reports to the Farm Director.'
    ],
    requirements: [
      'Practical, hands-on experience in commercial crop farming and dairy livestock management.',
      'At least 2-3 years supervisory experience on a working farm or commercial agribusiness.',
      'Strong team leadership, communication, and labor management skills.',
      'Working knowledge of drip irrigation systems, tractor maintenance, and pest control.',
      'Willingness to reside on the farm in Nakuru County.'
    ],
    qualifications: [
      'Certificate or Diploma in General Agriculture, Animal Health & Production, Horticulture, or Agribusiness.',
      'Minimum KCSE mean grade of D+ (Plus) or above.'
    ],
    application_info: 'On-farm supervisor housing, electricity, and clean water are provided.',
    closing_date: '2026-11-10',
    status: 'published',
    created_at: '2026-08-31T08:00:00.000Z',
    updated_at: '2026-08-31T08:00:00.000Z',
  },
  {
    id: 'vac-019',
    title: 'Sales Agent',
    organization: 'Mara Solar & Micro-Energy Ltd',
    location: 'Narok',
    category: 'Sales',
    job_type: 'Full-time',
    salary_range: 'KSh 20,000 - KSh 35,000 + Commission',
    description: 'Mara Solar & Micro-Energy Ltd is expanding clean energy access in Narok County and seeks energetic Sales Agents. You will introduce off-grid pastoralist households, commercial agro-vets, and community businesses to affordable solar home systems, solar water pumps, and pay-as-you-go lighting kits.',
    responsibilities: [
      'Prospect and register new customers across Narok Town, Kilgoris, Ololulung\'a, and surrounding trading centers.',
      'Conduct live product demonstrations of solar kits, battery inverters, and clean energy appliances.',
      'Assist customers in completing pay-as-you-go mobile financing applications via M-Pesa.',
      'Achieve monthly units-sold targets for solar lighting kits and solar water pumping solutions.',
      'Participate in community barazas, market day activations, and livestock market promotional drives.',
      'Provide basic after-sales customer guidance and collect customer satisfaction feedback.'
    ],
    requirements: [
      'Strong interpersonal, persuasion, and door-to-door direct sales capabilities.',
      'High self-drive, resilience, and passion for rural community development and clean technology.',
      'Fluency in Kiswahili and English; ability to speak Maa is an added advantage for grassroots engagement.',
      'Good knowledge of Narok County trading centers, topography, and community settlements.',
      'Previous sales experience in microfinance, solar energy, FMCG, or insurance is a plus (entry-level applicants welcome).'
    ],
    qualifications: [
      'Minimum KCSE mean grade of D (Plain) or D+ (Plus).',
      'Certificate in Sales, Marketing, or Business is an asset.'
    ],
    application_info: 'Monthly base retainer plus uncapped commission on every solar unit sold and activated.',
    closing_date: '2026-11-12',
    status: 'published',
    created_at: '2026-08-31T09:30:00.000Z',
    updated_at: '2026-08-31T09:30:00.000Z',
  },
  {
    id: 'vac-020',
    title: 'Administrative Assistant',
    organization: 'Kyumbi Commercial Property Consultants',
    location: 'Machakos',
    category: 'Administration',
    job_type: 'Full-time',
    salary_range: 'KSh 25,000 - KSh 40,000',
    description: 'Kyumbi Commercial Property Consultants is hiring an organized and personable Administrative Assistant for our branch office in Machakos Town. You will handle front desk reception, draft tenant tenancy agreements, manage utility bills, maintain rent collection registers, and assist property managers.',
    responsibilities: [
      'Manage the reception desk, receive visiting property owners, tenants, and contractors courteously.',
      'Draft official business correspondence, tenancy agreements, inspection notices, and meeting minutes.',
      'Maintain rent collection records, issue M-Pesa/bank receipts, and assist in compiling monthly rental statements.',
      'Organize digital and physical property files, title deed records, and tenant lease documents securely.',
      'Coordinate office supplies procurement, printer maintenance, and utility bill settlements.',
      'Screen incoming calls, schedule property viewing appointments, and assist property caretakers with maintenance logs.'
    ],
    requirements: [
      '1-2 years experience in an administrative support, secretarial, or real estate office role.',
      'Proficient in MS Office (Word, Excel, PowerPoint) and general internet office tools.',
      'Excellent verbal and written communication skills in English and Kiswahili.',
      'Highly organized, trustworthy, and detail-oriented when handling financial records and contracts.',
      'Positive attitude, professional office demeanor, and strong customer service orientation.'
    ],
    qualifications: [
      'Diploma or Certificate in Business Administration, Office Management, Secretarial Studies, or Real Estate.',
      'Minimum KCSE mean grade of C- (Minus) or above.'
    ],
    application_info: 'Machakos and Mavoko/Athi River residents are encouraged to apply.',
    closing_date: '2026-11-15',
    status: 'published',
    created_at: '2026-08-31T10:45:00.000Z',
    updated_at: '2026-08-31T10:45:00.000Z',
  },
];
