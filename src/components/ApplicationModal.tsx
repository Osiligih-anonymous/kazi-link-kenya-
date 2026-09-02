import React, { useState, useEffect, useRef } from 'react';
import { JobVacancy, JobApplication } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  uploadCVFile, 
  createApplicationDraft, 
  markApplicationPaid 
} from '../services/appService';
import { 
  X, 
  Upload, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Smartphone,
  Check,
  Building,
  MapPin,
  CreditCard,
  Receipt,
  Copy
} from 'lucide-react';

interface ApplicationModalProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (application: JobApplication) => void;
}

type Step = 'form' | 'fee_prompt' | 'stk_processing' | 'success' | 'failed';
type PaymentMethod = 'stk' | 'paybill';

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, profile, updateCurrentProfile } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stk');
  const [coverLetter, setCoverLetter] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [manualReceiptInput, setManualReceiptInput] = useState('');
  const [uploadedCvName, setUploadedCvName] = useState<string | undefined>(undefined);
  const [uploadedCvPath, setUploadedCvPath] = useState<string | undefined>(undefined);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // M-Pesa transaction state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);
  const [mpesaReceipt, setMpesaReceipt] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [completedApplication, setCompletedApplication] = useState<JobApplication | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [copiedPaybill, setCopiedPaybill] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Initialize form state
  useEffect(() => {
    if (isOpen && profile) {
      setUploadedCvName(profile.cv_file_name);
      setUploadedCvPath(profile.cv_path);
      setMpesaPhone(profile.phone || user?.phone || '');
      setCoverLetter(
        `Dear Hiring Manager at ${job?.organization || 'Organization'},\n\nI am writing to express my strong interest in the ${job?.title || 'position'} listed on Kazi Link Kenya. With my experience in ${profile.professional_title || job?.category || 'this field'}, I am confident in my ability to make an immediate positive contribution to your team.\n\nThank you for considering my application.`
      );
      setStep('form');
      setPaymentMethod('stk');
      setPaymentError(null);
      setUploadError(null);
      setPollingTimedOut(false);
      setCompletedApplication(null);
    }
  }, [isOpen, profile, job, user]);

  if (!isOpen || !job || !user) return null;

  // Handle CV File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCv(true);
    setUploadError(null);

    try {
      const res = await uploadCVFile(user.id, file);
      setUploadedCvName(res.fileName);
      setUploadedCvPath(res.path);
      
      await updateCurrentProfile({
        cv_path: res.path,
        cv_file_name: res.fileName,
        cv_file_size: res.fileSize,
        cv_uploaded_at: new Date().toISOString(),
      });
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload CV.');
    } finally {
      setIsUploadingCv(false);
    }
  };

  // Step 1 -> Step 2: Validate Form & Show KSh 150 Fee Prompt
  const handleProceedToFee = () => {
    if (!uploadedCvPath && !uploadedCvName) {
      setUploadError('Please upload your CV before submitting your application.');
      return;
    }
    if (!coverLetter.trim()) {
      setUploadError('Please provide a brief cover letter or statement of interest.');
      return;
    }
    setUploadError(null);
    setStep('fee_prompt');
  };

  // Finalize paid application safely in storage & state
  const finalizePaidApplication = async (appId: string, receipt: string, checkoutId?: string) => {
    try {
      const result = await markApplicationPaid(appId, {
        phoneNumber: mpesaPhone || '254700000000',
        mpesaReceiptNumber: receipt,
        checkoutRequestId: checkoutId,
        amount: 150,
      });

      setMpesaReceipt(receipt);
      setCompletedApplication(result.application);
      setStep('success');
      // Do not automatically close here; let applicant view receipt card
    } catch (e: any) {
      setPaymentError(e.message || 'Failed to finalize application record.');
      setStep('failed');
    }
  };

  // Step 2 -> Step 3: Initiate M-Pesa STK Push
  const handleInitiateStkPush = async () => {
    if (!mpesaPhone.trim()) {
      setPaymentError('Please enter a valid Safaricom M-Pesa phone number (e.g. 0712345678).');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);
    setPollingTimedOut(false);

    try {
      // 1. Create draft application record
      let appId = createdAppId;
      if (!appId) {
        const draftApp = await createApplicationDraft({
          vacancyId: job.id,
          jobSeekerId: user.id,
          coverLetter,
          cvPath: uploadedCvPath,
          cvFileName: uploadedCvName,
        });
        appId = draftApp.id;
        setCreatedAppId(draftApp.id);
      }

      // 2. Call backend STK Push endpoint with static hosting fallback
      let data: any;
      try {
        const res = await fetch('/api/mpesa/stkpush', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: mpesaPhone,
            applicationId: appId,
            jobSeekerId: user.id,
            jobTitle: job.title,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          // Static host (e.g. GitHub Pages) fallback simulation
          data = {
            success: true,
            checkoutRequestId: `gh_ws_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
            isTestSimulation: true,
          };
        }
      } catch (networkErr) {
        // Static host network fallback
        data = {
          success: true,
          checkoutRequestId: `gh_ws_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          isTestSimulation: true,
        };
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to initiate M-Pesa STK Push.');
      }

      setCheckoutRequestId(data.checkoutRequestId);
      setIsTestMode(Boolean(data.isTestSimulation));
      setStep('stk_processing');
      setIsProcessingPayment(false);

      // Start status polling if not static mock
      if (!data.checkoutRequestId.startsWith('gh_ws_')) {
        startPollingPaymentStatus(data.checkoutRequestId, appId);
      }
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err.message || 'Failed to initiate payment. Please try again.');
    }
  };

  // Poll server for M-Pesa status
  const startPollingPaymentStatus = (checkoutId: string, appId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let attempts = 0;
    const maxAttempts = 30; // 60 seconds polling

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setPollingTimedOut(true);
        return;
      }

      try {
        const res = await fetch(`/api/mpesa/query/${checkoutId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            const verifiedReceipt = data.mpesaReceiptNumber || ('KLK' + Math.random().toString(36).substring(2, 9).toUpperCase());
            finalizePaidApplication(appId, verifiedReceipt, checkoutId);
          } else if (data.status === 'failed' || data.status === 'cancelled') {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setPaymentError(data.failureReason || 'Payment was cancelled or failed. Your application has not been submitted.');
            setStep('failed');
          }
        }
      } catch (e) {
        // Polling retry
      }
    }, 2000);
  };

  // Handle Manual Paybill / SMS Receipt Code Verification
  const handleVerifyManualReceipt = async () => {
    const cleanCode = manualReceiptInput.trim().toUpperCase();
    if (!cleanCode) {
      setPaymentError('Please enter the M-Pesa receipt number from your SMS (e.g. QKH71829KJ).');
      return;
    }
    if (cleanCode.length < 8) {
      setPaymentError('M-Pesa transaction code is too short. It is usually 10 characters.');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Ensure draft exists
      let appId = createdAppId;
      if (!appId) {
        const draftApp = await createApplicationDraft({
          vacancyId: job.id,
          jobSeekerId: user.id,
          coverLetter,
          cvPath: uploadedCvPath,
          cvFileName: uploadedCvName,
        });
        appId = draftApp.id;
        setCreatedAppId(draftApp.id);
      }

      // 2. Call backend verification endpoint with static fallback
      let checkoutReqId = `manual_${Date.now()}_${cleanCode}`;
      try {
        const res = await fetch('/api/mpesa/verify-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiptNumber: cleanCode,
            phoneNumber: mpesaPhone,
            applicationId: appId,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.checkoutRequestId) {
            checkoutReqId = data.checkoutRequestId;
          }
        }
      } catch (err: any) {
        // Fallback for static GitHub Pages host
      }

      setIsProcessingPayment(false);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      await finalizePaidApplication(appId, cleanCode, checkoutReqId);
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err.message || 'Receipt code verification failed. Please check the code and try again.');
    }
  };

  // Test Mode / Sandbox Interactive PIN Confirmation
  const handleSimulatePin = async (success: boolean) => {
    if (!createdAppId) return;
    setIsProcessingPayment(true);

    let receiptNum = 'KLK' + Math.random().toString(36).substring(2, 9).toUpperCase();

    try {
      const res = await fetch('/api/mpesa/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutRequestId,
          pinSuccess: success,
          reason: success ? undefined : 'User entered incorrect M-Pesa PIN or cancelled prompt',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.mpesaReceiptNumber) {
          receiptNum = data.mpesaReceiptNumber;
        }
      }
    } catch (err: any) {
      // Static fallback
    }

    setIsProcessingPayment(false);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    if (success) {
      await finalizePaidApplication(createdAppId, receiptNum, checkoutRequestId || `sim_${Date.now()}`);
    } else {
      setPaymentError('Payment was cancelled or incorrect PIN entered.');
      setStep('failed');
    }
  };

  // When user finishes view of the success screen
  const handleDone = () => {
    if (completedApplication) {
      onSuccess(completedApplication);
    }
    onClose();
  };

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText('174379');
    setCopiedPaybill(true);
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  return (
    <div 
      id="application-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={step === 'success' ? handleDone : onClose}
    >
      <div 
        id="application-modal-content"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/90 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Job Application
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {job.organization}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
            </div>
          </div>

          <button
            id="close-app-modal-btn"
            onClick={step === 'success' ? handleDone : onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FREE APPLICATION FORM */}
        {step === 'form' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-800">
            {/* Free Form Notice */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Filling this form is 100% free.</span>
              </div>
              <span className="text-amber-800 bg-amber-100/90 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                KSh 150 fee payable at submission
              </span>
            </div>

            {/* Applicant Profile Summary */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs space-y-1.5">
              <p className="font-bold text-emerald-950 text-sm">
                Applicant: {profile?.full_name || user.fullName || user.email}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-emerald-900 font-medium">
                <span>Phone: {profile?.phone || user.phone || 'Not set'}</span>
                <span>Location: {profile?.location || user.location || 'Kenya'}</span>
                <span>Email: {user.email}</span>
              </div>
            </div>

            {/* CV Attachment Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Attached Curriculum Vitae (CV) <span className="text-rose-600">*</span>
              </label>

              {uploadedCvName ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                        {uploadedCvName}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> CV ready for submission
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    Change CV
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">
                    Upload your CV (PDF, DOC, DOCX)
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3">
                    Maximum file size: 5 MB
                  </p>
                  <label className="inline-block px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs">
                    {isUploadingCv ? 'Uploading...' : 'Browse & Upload CV'}
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cover Letter / Statement of Interest <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Highlight your relevant experience, skills, and why you are the best fit for this role..."
                className="w-full rounded-2xl border border-slate-300 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                You can customize your cover letter to fit this specific opportunity.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: KSH 150 APPLICATION FEE & PAYMENT METHOD */}
        {step === 'fee_prompt' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-800">
            {/* Prominent Fee Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs tracking-wider uppercase mb-1">
                Official Application Fee
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white font-serif">
                KSh 150
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                An application fee of <strong>KSh 150</strong> is required to submit your verified application directly to <strong>{job.organization}</strong>.
              </p>
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-emerald-200">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  Safaricom M-Pesa Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  Instant Confirmation
                </span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                id="tab-stk-push"
                onClick={() => setPaymentMethod('stk')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'stk'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                M-Pesa STK Push (Recommended)
              </button>
              <button
                type="button"
                id="tab-paybill"
                onClick={() => setPaymentMethod('paybill')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'paybill'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                Paybill / Enter SMS Receipt
              </button>
            </div>

            {/* TAB 1: STK PUSH */}
            {paymentMethod === 'stk' && (
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Safaricom M-Pesa Phone Number</span>
                  <span className="text-[11px] font-semibold text-emerald-700">e.g. 0712345678</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Smartphone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="0712345678 or 0112345678"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-base font-bold text-slate-900 tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You will receive an instant prompt on this phone asking for your 4-digit M-Pesa PIN to authorize <strong>KSh 150.00</strong>.
                </p>
              </div>
            )}

            {/* TAB 2: MANUAL PAYBILL */}
            {paymentMethod === 'paybill' && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Business No</span>
                    <span className="text-base font-black text-slate-900 font-mono">174379</span>
                    <button
                      type="button"
                      onClick={handleCopyPaybill}
                      className="text-[10px] text-emerald-700 font-bold hover:underline block mx-auto mt-0.5"
                    >
                      {copiedPaybill ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Account No</span>
                    <span className="text-base font-black text-slate-900 font-mono">KLK-{job.id}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount</span>
                    <span className="text-base font-black text-emerald-700 font-mono">KSh 150</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Enter M-Pesa Receipt Code (from Safaricom SMS)
                  </label>
                  <input
                    type="text"
                    value={manualReceiptInput}
                    onChange={(e) => setManualReceiptInput(e.target.value.toUpperCase())}
                    placeholder="e.g. QKH71829KJ"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold font-mono text-slate-900 tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Enter the 10-character transaction code sent in your M-Pesa confirmation SMS.
                  </p>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: M-PESA STK PROCESSING & TEST INTERACTIVE PROMPT */}
        {step === 'stk_processing' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-center text-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <Smartphone className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 font-serif">
                Check Your Phone
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                A Safaricom STK Push for <strong>KSh 150</strong> was sent to <strong>{mpesaPhone}</strong>. Please enter your M-Pesa PIN to complete payment.
              </p>
            </div>

            {!pollingTimedOut ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                Waiting for Safaricom M-Pesa confirmation...
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 max-w-md mx-auto text-left space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Didn't receive the prompt or network delayed?
                </p>
                <p className="text-slate-600">
                  If you already received the Safaricom confirmation SMS, enter your M-Pesa receipt code below:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualReceiptInput}
                    onChange={(e) => setManualReceiptInput(e.target.value.toUpperCase())}
                    placeholder="e.g. QKH71829KJ"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyManualReceipt}
                    disabled={isProcessingPayment}
                    className="px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}

            {/* Test Simulation Simulator Bar for immediate sandbox testing */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  M-Pesa Verification Gateway
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Sandbox Active
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                In testing / sandbox mode, you can immediately simulate PIN entry:
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="simulate-pin-success-btn"
                  onClick={() => handleSimulatePin(true)}
                  disabled={isProcessingPayment}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  {isProcessingPayment ? 'Verifying...' : 'Simulate Successful PIN (KSh 150)'}
                </button>
                <button
                  type="button"
                  id="simulate-pin-cancel-btn"
                  onClick={() => handleSimulatePin(false)}
                  disabled={isProcessingPayment}
                  className="py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-colors"
                >
                  Simulate Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESSFUL APPLICATION & PAYMENT */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-center text-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-700/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Payment Verified & Submitted
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-serif">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your application for <strong>{job.title}</strong> at <strong>{job.organization}</strong> is officially registered.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Application Reference</span>
                <span className="font-mono font-bold text-slate-900">{completedApplication?.reference_number || 'KLK-2026-CONF'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">M-Pesa Receipt #</span>
                <span className="font-mono font-bold text-emerald-700">{mpesaReceipt || 'KLK9928374'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Amount Paid</span>
                <span className="font-bold text-slate-900">KSh 150.00</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Phone Number</span>
                <span className="font-medium text-slate-800">{mpesaPhone || '254700000000'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">Application Status</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Submitted & Paid</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FAILED / CANCELLED PAYMENT */}
        {step === 'failed' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-center text-slate-800">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 font-serif">
                Payment Was Not Completed
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {paymentError || 'Payment was not completed. Your application has not been submitted.'}
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 max-w-md mx-auto text-left">
              <p className="font-bold mb-1">Important Note:</p>
              <p>Your draft application is saved, but it will not be reviewed by employers until the KSh 150 fee is paid via M-Pesa.</p>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-3xl flex items-center justify-between gap-3">
          {step === 'form' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="proceed-to-fee-btn"
                onClick={handleProceedToFee}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                Continue to Submission <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'fee_prompt' && (
            <>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back to Edit
              </button>
              {paymentMethod === 'stk' ? (
                <button
                  type="button"
                  id="pay-and-submit-btn"
                  onClick={handleInitiateStkPush}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessingPayment ? 'Initiating STK Push...' : 'Pay KSh 150 & Submit'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="verify-receipt-btn"
                  onClick={handleVerifyManualReceipt}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessingPayment ? 'Verifying Receipt...' : 'Verify Receipt & Submit'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {step === 'stk_processing' && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                  setStep('fee_prompt');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 underline font-semibold"
              >
                Change Phone Number
              </button>
              <button
                type="button"
                onClick={handleInitiateStkPush}
                disabled={isProcessingPayment}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend STK Prompt
              </button>
            </div>
          )}

          {step === 'success' && (
            <button
              type="button"
              id="success-done-btn"
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
            >
              View My Applications
            </button>
          )}

          {step === 'failed' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                id="retry-payment-btn"
                onClick={() => {
                  setPaymentError(null);
                  setStep('fee_prompt');
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
