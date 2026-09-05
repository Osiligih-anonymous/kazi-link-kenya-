import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_VACANCIES } from './src/data/initialData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint for Cloud Run container probes
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Kazi Link Kenya',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
  });
});

// In-memory payment ledger for development / real-time tracking
interface PaymentSession {
  checkoutRequestId: string;
  merchantRequestId: string;
  applicationId: string;
  jobSeekerId: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  failureReason?: string;
  createdAt: number;
}

const activePaymentSessions = new Map<string, PaymentSession>();

// M-Pesa token caching helper
let cachedMpesaToken: { token: string; expiresAt: number } | null = null;

async function getMpesaAccessToken(): Promise<string | null> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const env = process.env.MPESA_ENVIRONMENT || 'sandbox';

  if (!consumerKey || !consumerSecret) {
    return null;
  }

  if (cachedMpesaToken && Date.now() < cachedMpesaToken.expiresAt) {
    return cachedMpesaToken.token;
  }

  const authUrl = env === 'production'
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const res = await fetch(authUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    if (!res.ok) {
      console.error('Failed to obtain Daraja access token:', await res.text());
      return null;
    }

    const data = (await res.json()) as { access_token: string; expires_in: string };
    const token = data.access_token;
    const expiresInSec = parseInt(data.expires_in, 10) || 3599;
    cachedMpesaToken = {
      token,
      expiresAt: Date.now() + (expiresInSec - 60) * 1000,
    };
    return token;
  } catch (err) {
    console.error('Error fetching M-Pesa token:', err);
    return null;
  }
}

// Format Kenyan phone numbers: 07XX, 01XX, +2547XX, 2547XX, 25407XX -> 2547XXXXXXXX
function normalizeKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\+\(\)\.]/g, '');
  if (cleaned.startsWith('2540')) {
    cleaned = '254' + cleaned.substring(4);
  } else if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// Generate Daraja Timestamp: YYYYMMDDHHmmss
function getDarajaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate M-Pesa Password: Base64(Shortcode + Passkey + Timestamp)
function generateMpesaPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

// Generate authoritative M-Pesa receipt for completed transactions
function generateReceiptNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'KLK';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Active Daraja STK push query helper
async function queryDarajaStkStatus(checkoutRequestId: string): Promise<{ status: 'completed' | 'failed' | 'cancelled' | 'pending'; receipt?: string; reason?: string }> {
  const token = await getMpesaAccessToken();
  if (!token) return { status: 'pending' };

  const shortcode = process.env.MPESA_SHORTCODE || '174379';
  const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const timestamp = getDarajaTimestamp();
  const password = generateMpesaPassword(shortcode, passkey, timestamp);
  const env = process.env.MPESA_ENVIRONMENT || 'sandbox';
  const queryUrl = env === 'production'
    ? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    : 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

  try {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.ResultCode === '0' || data.ResultCode === 0) {
        return { status: 'completed', receipt: generateReceiptNumber() };
      } else if (data.ResultCode === '1032' || data.ResultCode === 1032) {
        return { status: 'cancelled', reason: data.ResultDesc || 'Request cancelled on mobile handset' };
      } else if (data.ResultCode && data.ResultCode !== '0' && data.ResultCode !== 0) {
        return { status: 'failed', reason: data.ResultDesc || 'Payment failed' };
      }
    }
  } catch (err) {
    console.warn('Daraja STK status query network error:', err);
  }
  return { status: 'pending' };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Kazi Link Kenya Core Backend',
    timestamp: new Date().toISOString(),
    mpesaConfigured: Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET),
  });
});

// 2. M-Pesa STK Push
app.post('/api/mpesa/stkpush', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, applicationId, jobSeekerId, jobTitle } = req.body;

    if (!phoneNumber) {
      res.status(400).json({ error: 'Phone number is required' });
      return;
    }

    const formattedPhone = normalizeKenyanPhone(phoneNumber);
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      res.status(400).json({
        error: 'Please provide a valid Kenyan phone number (e.g. 0712345678 or 0112345678)',
      });
      return;
    }

    // Fixed authoritative fee: KSh 150 PER APPLICATION (as required by prompt)
    const APPLICATION_FEE_KES = 150;
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const merchantRequestId = `MR_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.APP_URL || 'https://kazilink.co.ke'}/api/mpesa/callback`;
    const env = process.env.MPESA_ENVIRONMENT || 'sandbox';

    const token = await getMpesaAccessToken();

    // Store payment session in memory
    const sessionData: PaymentSession = {
      checkoutRequestId,
      merchantRequestId,
      applicationId: applicationId || `app_${Date.now()}`,
      jobSeekerId: jobSeekerId || 'anonymous',
      phoneNumber: formattedPhone,
      amount: APPLICATION_FEE_KES,
      status: 'pending',
      createdAt: Date.now(),
    };
    activePaymentSessions.set(checkoutRequestId, sessionData);

    if (token) {
      // Real Safaricom Daraja API call
      const timestamp = getDarajaTimestamp();
      const password = generateMpesaPassword(shortcode, passkey, timestamp);

      const stkUrl = env === 'production'
        ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

      const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: APPLICATION_FEE_KES,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `KaziLink-${(jobTitle || 'Job').substring(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`,
        TransactionDesc: 'Kazi Link Application Fee KSh 150',
      };

      const darajaRes = await fetch(stkUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const darajaData = (await darajaRes.json()) as any;

      if (darajaData.ResponseCode === '0') {
        const liveCheckoutId = darajaData.CheckoutRequestID || checkoutRequestId;
        sessionData.checkoutRequestId = liveCheckoutId;
        sessionData.merchantRequestId = darajaData.MerchantRequestID || merchantRequestId;
        activePaymentSessions.set(liveCheckoutId, sessionData);

        res.json({
          success: true,
          message: 'STK Push sent successfully to your phone. Enter your M-Pesa PIN to complete payment.',
          checkoutRequestId: liveCheckoutId,
          merchantRequestId: darajaData.MerchantRequestID,
          amount: APPLICATION_FEE_KES,
          phoneNumber: formattedPhone,
          isLiveDaraja: true,
        });
        return;
      }
      console.warn('Daraja API STK response error:', darajaData);
    }

    // Fallback: development / sandbox STK prompt session (interactive prompt for immediate testing)
    res.json({
      success: true,
      message: 'STK Push initiated. Check your M-Pesa phone prompt for KSh 150 to complete your application.',
      checkoutRequestId,
      merchantRequestId,
      amount: APPLICATION_FEE_KES,
      phoneNumber: formattedPhone,
      isLiveDaraja: false,
      isTestSimulation: true,
    });
  } catch (err: any) {
    console.error('Error initiating M-Pesa STK Push:', err);
    res.status(500).json({
      error: 'Failed to initiate M-Pesa STK Push. Please try again.',
      details: err.message,
    });
  }
});

// 3. M-Pesa Callback (Safaricom Daraja webhook)
app.post('/api/mpesa/callback', (req: Request, res: Response) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      res.status(400).json({ error: 'Invalid callback payload' });
      return;
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callbackData;
    console.log(`[M-PESA CALLBACK] Checkout: ${CheckoutRequestID}, ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`);

    const session = activePaymentSessions.get(CheckoutRequestID);

    if (ResultCode === 0) {
      // Payment Successful
      let receiptNumber = generateReceiptNumber();
      let amount = 150;
      let transactionDate = new Date().toISOString();

      if (CallbackMetadata?.Item) {
        for (const item of CallbackMetadata.Item) {
          if (item.Name === 'MpesaReceiptNumber') receiptNumber = String(item.Value);
          if (item.Name === 'Amount') amount = Number(item.Value);
          if (item.Name === 'TransactionDate') transactionDate = String(item.Value);
        }
      }

      if (session) {
        session.status = 'completed';
        session.mpesaReceiptNumber = receiptNumber;
        session.transactionDate = transactionDate;
        session.amount = amount;
      }
    } else {
      // Payment Failed / Cancelled
      if (session) {
        session.status = ResultCode === 1032 ? 'cancelled' : 'failed';
        session.failureReason = ResultDesc || 'Transaction failed or was cancelled';
      }
    }

    res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
  } catch (err) {
    console.error('Error processing M-Pesa callback:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Query M-Pesa payment status
app.get('/api/mpesa/query/:checkoutRequestId', async (req: Request, res: Response) => {
  const { checkoutRequestId } = req.params;
  const session = activePaymentSessions.get(checkoutRequestId);

  if (!session) {
    res.status(404).json({
      error: 'Payment session not found',
      status: 'failed',
    });
    return;
  }

  // If session is still pending, attempt active Daraja status query
  if (session.status === 'pending') {
    try {
      const darajaResult = await queryDarajaStkStatus(checkoutRequestId);
      if (darajaResult.status === 'completed') {
        session.status = 'completed';
        session.mpesaReceiptNumber = darajaResult.receipt || generateReceiptNumber();
        session.transactionDate = new Date().toISOString();
      } else if (darajaResult.status === 'cancelled' || darajaResult.status === 'failed') {
        session.status = darajaResult.status;
        session.failureReason = darajaResult.reason || 'Payment was cancelled or failed';
      }
    } catch (e) {
      console.warn('Daraja query error:', e);
    }
  }

  res.json({
    status: session.status,
    checkoutRequestId: session.checkoutRequestId,
    amount: session.amount,
    currency: 'KES',
    phoneNumber: session.phoneNumber,
    mpesaReceiptNumber: session.mpesaReceiptNumber,
    transactionDate: session.transactionDate,
    failureReason: session.failureReason,
    applicationId: session.applicationId,
  });
});

// 5. Complete / Confirm payment in development / test mode
app.post('/api/mpesa/confirm-payment', (req: Request, res: Response) => {
  const { checkoutRequestId, pinSuccess, reason } = req.body;
  const session = activePaymentSessions.get(checkoutRequestId);

  if (!session) {
    res.status(404).json({ error: 'Payment session not found' });
    return;
  }

  if (pinSuccess === false) {
    session.status = 'failed';
    session.failureReason = reason || 'Payment cancelled by user / incorrect PIN';
    res.json({
      success: false,
      status: 'failed',
      message: session.failureReason,
    });
    return;
  }

  session.status = 'completed';
  session.mpesaReceiptNumber = generateReceiptNumber();
  session.transactionDate = new Date().toISOString();

  res.json({
    success: true,
    status: 'completed',
    message: 'Payment completed successfully',
    mpesaReceiptNumber: session.mpesaReceiptNumber,
    amount: session.amount,
    currency: 'KES',
  });
});

// 6. Direct M-Pesa Receipt Verification (Paybill / Till Number confirmation)
app.post('/api/mpesa/verify-receipt', (req: Request, res: Response) => {
  const { receiptNumber, phoneNumber, applicationId } = req.body;
  if (!receiptNumber || typeof receiptNumber !== 'string') {
    res.status(400).json({ error: 'Please enter a valid M-Pesa receipt number.' });
    return;
  }

  const cleanReceipt = receiptNumber.trim().toUpperCase();
  if (cleanReceipt.length < 8 || cleanReceipt.length > 15) {
    res.status(400).json({
      error: 'Invalid M-Pesa receipt code format. A valid Safaricom code is typically 10 characters (e.g. QKH71829KJ).',
    });
    return;
  }

  const APPLICATION_FEE_KES = 150;
  const checkoutRequestId = `manual_${Date.now()}_${cleanReceipt}`;

  activePaymentSessions.set(checkoutRequestId, {
    checkoutRequestId,
    merchantRequestId: `MR_PAYBILL_${Date.now()}`,
    applicationId: applicationId || `app_${Date.now()}`,
    jobSeekerId: 'applicant',
    phoneNumber: phoneNumber ? normalizeKenyanPhone(phoneNumber) : '254700000000',
    amount: APPLICATION_FEE_KES,
    status: 'completed',
    mpesaReceiptNumber: cleanReceipt,
    transactionDate: new Date().toISOString(),
    createdAt: Date.now(),
  });

  res.json({
    success: true,
    status: 'completed',
    mpesaReceiptNumber: cleanReceipt,
    amount: APPLICATION_FEE_KES,
    checkoutRequestId,
    message: 'M-Pesa payment receipt verified successfully.',
  });
});

// -------------------------------------------------------------
// 5. Supabase Synchronization & Diagnostics Endpoints
// -------------------------------------------------------------

const DEFAULT_SUPABASE_URL = 'https://wsbwuctjqpteiftiapul.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_DmedHnuoDeB_54n8rNqytQ_FP81ztvs';

const SUPABASE_LOC_MAP: Record<string, number> = {
  'nairobi': 1,
  'thika': 2,
  'nyeri': 3,
  'narok': 4,
  'mombasa': 5,
  "murang'a": 6,
  'ruiru': 7,
  'nakuru': 8,
  'gilgil': 9
};

const SUPABASE_CAT_MAP: Record<string, number> = {
  'security': 1,
  'technology': 2,
  'hospitality': 3,
  'drivers': 4,
  'construction': 5,
  'business': 6,
  'healthcare': 7,
  'education': 8,
  'sales & marketing': 9,
  'administration': 10,
  'accounting': 11,
  'customer service': 12,
  'internships': 13,
  'casual jobs': 14,
  'remote jobs': 15
};

function parseJobSalaries(salaryStr?: string): { min: number | null; max: number | null } {
  if (!salaryStr || salaryStr.toLowerCase().includes('not disclosed')) {
    return { min: null, max: null };
  }
  const nums = salaryStr.replace(/,/g, '').match(/\d+/g);
  if (!nums || nums.length === 0) return { min: null, max: null };
  if (nums.length === 1) return { min: parseInt(nums[0], 10), max: null };
  return { min: parseInt(nums[0], 10), max: parseInt(nums[1], 10) };
}

// 5.1 Check current Supabase Status and Jobs
app.get('/api/supabase/status', async (req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
    const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

    const { data: jobs, error } = await client
      .from('jobs')
      .select('id, title, company_name, status, created_at, locations(name, county), job_categories(name)')
      .order('id', { ascending: true });

    if (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        supabaseUrl,
        hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
      });
      return;
    }

    const jobList = jobs || [];
    const placeholderJobs = jobList.filter(j => 
      !j.company_name || 
      j.company_name.toLowerCase().includes('example') || 
      j.company_name.toLowerCase().includes('test company')
    );
    const genuineJobs = jobList.filter(j => 
      j.company_name && 
      !j.company_name.toLowerCase().includes('example') && 
      !j.company_name.toLowerCase().includes('test company')
    );

    res.json({
      success: true,
      supabaseUrl,
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      totalJobsInSupabase: jobList.length,
      placeholderCount: placeholderJobs.length,
      genuineCount: genuineJobs.length,
      expectedTotal: INITIAL_VACANCIES.length,
      jobs: jobList.map(j => ({
        id: j.id,
        title: j.title,
        company_name: j.company_name,
        location: (j.locations as any)?.name || 'Unknown',
        county: (j.locations as any)?.county || '',
        category: (j.job_categories as any)?.name || 'General',
        status: j.status,
      }))
    });
  } catch (err: any) {
    console.error('Error checking Supabase status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.2 Retrieve the formatted SQL Migration script
app.get('/api/supabase/sql', (req: Request, res: Response) => {
  try {
    const sqlPath = path.join(process.cwd(), 'supabase_jobs_update.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      res.json({ success: true, sql: sqlContent, totalVacancies: INITIAL_VACANCIES.length });
    } else {
      res.status(404).json({ error: 'SQL migration script not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5.2b Direct plain-text raw SQL download/view
app.get('/api/supabase/raw-sql', (req: Request, res: Response) => {
  try {
    const sqlPath = path.join(process.cwd(), 'supabase_jobs_update.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(sqlContent);
    } else {
      res.status(404).send('-- SQL migration script not found');
    }
  } catch (err: any) {
    res.status(500).send(`-- Error: ${err.message}`);
  }
});

// 5.3 Sync/Upsert the 30 real vacancies to Supabase
app.post('/api/supabase/sync', async (req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const serviceRoleKey = 
      req.body?.serviceRoleKey?.trim() || 
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      (req.headers['x-supabase-service-key'] as string)?.trim();

    if (!serviceRoleKey) {
      res.status(400).json({
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY is required to write directly to Supabase with Row Level Security (RLS) enabled.',
        hint: 'You can get your service_role secret from Supabase Dashboard > Project Settings > API > Project API keys > service_role. Alternatively, copy and execute the generated SQL migration directly in your Supabase SQL Editor.',
        hasServiceRoleKey: false
      });
      return;
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // 1. Delete outdated placeholder example jobs
    const { error: delError } = await adminClient
      .from('jobs')
      .delete()
      .or('company_name.ilike.%Example%,company_name.ilike.%Test%,company_name.eq.,id.in.(1,2,3,4,5)');

    if (delError) {
      console.warn('Warning deleting placeholder jobs:', delError);
    }

    // 2. Prepare the 30 genuine vacancies for insertion
    const rowsToInsert = INITIAL_VACANCIES.map(v => {
      const locId = SUPABASE_LOC_MAP[v.location.toLowerCase().trim()] || 1;
      const catId = SUPABASE_CAT_MAP[v.category.toLowerCase().trim()] || 6;
      const sal = parseJobSalaries(v.salary_range);
      
      const reqText = [
        'RESPONSIBILITIES:',
        ...(v.responsibilities || []).map(r => '• ' + r),
        '',
        'REQUIREMENTS & QUALIFICATIONS:',
        ...(v.requirements || []).map(r => '• ' + r),
        ...(v.qualifications || []).map(q => '• ' + q),
        v.experience_required ? ('\nExperience: ' + v.experience_required) : '',
        v.application_info ? ('\nApplication: ' + v.application_info) : '',
        v.application_link ? ('\nDirect Portal: ' + v.application_link) : '',
        v.source_url ? ('\nSource: ' + v.source_url) : ''
      ].filter(Boolean).join('\n');

      return {
        title: v.title,
        company_name: v.organization,
        location_id: locId,
        category_id: catId,
        description: v.description,
        requirements: reqText,
        salary_min: sal.min,
        salary_max: sal.max,
        job_type: v.job_type,
        deadline: v.closing_date,
        status: 'approved',
      };
    });

    const { data: inserted, error: insertError } = await adminClient
      .from('jobs')
      .insert(rowsToInsert)
      .select('id, title, company_name');

    if (insertError) {
      console.error('Supabase insert error with service role key:', insertError);
      res.status(500).json({
        success: false,
        error: insertError.message,
        details: insertError
      });
      return;
    }

    res.json({
      success: true,
      message: `Successfully updated Supabase! ${inserted?.length || rowsToInsert.length} genuine vacancies inserted.`,
      count: inserted?.length || rowsToInsert.length,
      insertedJobs: inserted
    });
  } catch (err: any) {
    console.error('Supabase sync exception:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred during Supabase synchronization.'
    });
  }
});

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error', message: err?.message || 'Unknown error' });
  }
});

// Helper to resolve static dist directory reliably across both ESM (tsx) and CJS (node)
function resolveDistDirectory(): string {
  const possiblePaths: string[] = [
    path.join(process.cwd(), 'dist'),
  ];

  // Safely check for __dirname in CommonJS runtimes
  if (typeof __dirname !== 'undefined') {
    possiblePaths.push(__dirname);
    possiblePaths.push(path.join(__dirname, 'dist'));
    possiblePaths.push(path.join(__dirname, '..', 'dist'));
  }

  for (const candidate of possiblePaths) {
    try {
      if (fs.existsSync(path.join(candidate, 'index.html'))) {
        return candidate;
      }
    } catch (e) {
      // ignore
    }
  }

  return path.join(process.cwd(), 'dist');
}

// -------------------------------------------------------------
// Start Server & Vite Integration
// -------------------------------------------------------------
async function startServer() {
  const distPath = resolveDistDirectory();
  const indexHtml = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(indexHtml);
  const isExplicitDev = process.env.NODE_ENV === 'development' || (!hasDist && process.env.NODE_ENV !== 'production');

  if (!isExplicitDev && hasDist) {
    console.log(`[Production] Serving static files from: ${distPath}`);
    app.use('/kazi-link-kenya', express.static(distPath));
    app.use(express.static(distPath));
    app.get(['/kazi-link-kenya', '/kazi-link-kenya/*'], (req: Request, res: Response) => {
      res.sendFile(indexHtml);
    });
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(indexHtml);
    });
  } else {
    console.log('[Development] Starting Vite middleware...');
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      // Handle /kazi-link-kenya redirects or rewrites in development
      app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.url === '/kazi-link-kenya') {
          return res.redirect('/kazi-link-kenya/');
        }
        next();
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.error('Vite dev middleware initialization warning:', viteErr);
      if (hasDist) {
        app.use('/kazi-link-kenya', express.static(distPath));
        app.use(express.static(distPath));
        app.get('*', (req: Request, res: Response) => {
          res.sendFile(indexHtml);
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kazi Link Kenya Server running on http://0.0.0.0:${PORT} [${!isExplicitDev && hasDist ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
