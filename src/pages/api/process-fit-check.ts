import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase.server';
import { computeFitResult, fitQuestions, type FitAnswers } from '../../utils/process-fit/scoring';

export const prerender = false;

const MAX_BODY_BYTES = 12_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 6;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function getIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function allowRequest(ip: string) {
  const now = Date.now();
  const item = rateLimitMap.get(ip);
  if (!item || now > item.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (item.count >= RATE_LIMIT_MAX) return false;
  item.count += 1;
  return true;
}

function clamp(value: unknown, max = 180) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeAnswers(raw: unknown): FitAnswers | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const input = raw as Record<string, unknown>;
  const output: FitAnswers = {};

  for (const question of fitQuestions) {
    const value = clamp(input[question.key], 60);
    if (!question.options.some((option) => option.value === value)) return null;
    output[question.key] = value;
  }
  return output;
}

function answerLabel(key: string, value: string) {
  const q = fitQuestions.find((item) => item.key === key);
  return q?.options.find((item) => item.value === value)?.label ?? value;
}

async function notify(input: {
  contactName: string;
  email: string;
  phone: string;
  businessName: string;
  answers: FitAnswers;
}) {
  try {
    if (import.meta.env.VERCEL_ENV === 'preview' && import.meta.env.CONTACT_ALLOW_EMAIL_IN_PREVIEW !== 'true') {
      return false;
    }
    const key = import.meta.env.RESEND_API_KEY;
    const to = import.meta.env.CONTACT_TO_EMAIL || import.meta.env.MAIL_TO;
    const from = import.meta.env.CONTACT_FROM_EMAIL || import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    if (!key || !to) return false;

    const result = computeFitResult(input.answers);
    const lines = [
      'Nuovo Process Fit Check — LS Web Agency',
      '',
      `Nome: ${input.contactName}`,
      `Email: ${input.email}`,
      `Telefono: ${input.phone || '—'}`,
      `Attività: ${input.businessName || '—'}`,
      '',
      `Automation Fit Score: ${result.score}/100`,
      `Esito: ${result.outcome}`,
      `Rischio: ${result.risk}`,
      `Prossimo passo: ${result.nextStep}`,
      '',
      'Risposte:',
      ...fitQuestions.map((q) => `- ${q.label}: ${answerLabel(q.key, input.answers[q.key])}`),
      '',
      'Blocchi / prerequisiti:',
      ...(result.blockers.length ? result.blockers.map((item) => `- ${item}`) : ['- nessuno evidente']),
    ];

    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: input.email,
      subject: `Process Fit Check ${result.outcome} ${result.score}/100 — ${input.contactName}`,
      text: lines.join('\n'),
    });
    return !error;
  } catch (error) {
    console.error('[process-fit-check] notification error', error instanceof Error ? error.message.slice(0, 180) : 'unknown');
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!allowRequest(getIp(request))) return json({ ok: false, error: 'RATE_LIMIT' }, 429);
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return json({ ok: false, error: 'UNSUPPORTED_MEDIA_TYPE' }, 415);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'PAYLOAD_TOO_LARGE' }, 413);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw || '{}');
    } catch {
      return json({ ok: false, error: 'INVALID_JSON' }, 400);
    }

    const honeypot = clamp(body.honeypot, 120);
    if (honeypot) return json({ ok: true });

    const contactName = clamp(body.contactName, 120);
    const email = clamp(body.email, 180).toLowerCase();
    const phone = clamp(body.phone, 80);
    const businessName = clamp(body.businessName, 160);
    const privacyConsent = body.privacyConsent === true;
    const answers = sanitizeAnswers(body.answers);

    if (!contactName || !validEmail(email) || !privacyConsent || !answers) {
      return json({ ok: false, error: 'INVALID_INPUT' }, 400);
    }

    // Il client mostra un risultato immediato, ma score/esito vengono SEMPRE ricalcolati lato server.
    const result = computeFitResult(answers);
    const priority = result.outcome === 'GO' ? 'alta' : result.outcome === 'PREPARARE' ? 'media' : 'bassa';

    const notes = [
      'Lead generato dal Process Fit Check (AI Operations) — LS Web Agency.',
      'Origine: process-fit-check (mappata su source="altro").',
      '',
      `Automation Fit Score: ${result.score}/100`,
      `Esito: ${result.outcome}`,
      `Rischio: ${result.risk}`,
      `Prossimo passo: ${result.nextStep}`,
      '',
      'Dimensioni:',
      ...result.dimensions.map((item) => `- ${item.label}: ${item.points}/${item.max}`),
      '',
      'Risposte:',
      ...fitQuestions.map((q) => `- ${q.label}: ${answerLabel(q.key, answers[q.key])}`),
      '',
      'Punti favorevoli:',
      ...(result.strengths.length ? result.strengths.map((item) => `- ${item}`) : ['- nessuno']),
      '',
      'Blocchi / prerequisiti:',
      ...(result.blockers.length ? result.blockers.map((item) => `- ${item}`) : ['- nessuno evidente']),
    ].join('\n');

    const payload = {
      business_name: businessName || 'Lead da Process Fit Check',
      contact_name: contactName,
      email,
      phone: phone || null,
      sector: 'altro',
      service_interest: `AI Operations — Process Fit Check (${result.outcome})`,
      status: 'nuovo',
      priority,
      source: 'altro',
      problem_detected: [] as string[],
      notes,
      estimated_value: result.outcome === 'NO-GO' ? 0 : 290,
      archived: false,
    };

    const { error } = await supabaseAdmin.from('leads').insert(payload);
    if (error) {
      console.error('[process-fit-check] CRM insert error', error.message.slice(0, 180));
      return json({ ok: false, error: 'SAVE_ERROR' }, 500);
    }

    const emailSent = await notify({ contactName, email, phone, businessName, answers });
    return json({ ok: true, outcome: result.outcome, score: result.score, emailSent });
  } catch (error) {
    console.error('[process-fit-check] unexpected error', error instanceof Error ? error.message.slice(0, 180) : 'unknown');
    return json({ ok: false, error: 'SERVER_ERROR' }, 500);
  }
};
