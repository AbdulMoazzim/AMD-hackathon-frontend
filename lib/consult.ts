import type { CountryId, Lang } from "./symptoms-data";

export type Question = {
  target: string;
  question: string;
  quick_options?: string[] | null;
  done?: boolean;
  red_flag?: boolean;
};

export type AnswerResult = {
  done: boolean;
  question: Question | null;
  red_flag: boolean;
  urgent_message: string | null;
};

export type ConsultSummary = {
  english: string;
  local_language: string;
  user_language: string;
  skipped: string[];
  red_flag: boolean;
  disclaimer: string;
};

export type SessionInput = {
  ui_lang: string; // language of the agent's questions: the site's selected language
  country: string;
  local_lang: string; // language of the doctor-facing summary
  preferred_lang: string; // the person's own language (the "user_language" part of the summary)
};

export class ApiError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export const COUNTRY_EN: Record<CountryId, string> = {
  PK: "Pakistan",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
};
export const LANG_EN: Record<Lang, string> = {
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
  ur: "Urdu",
};

// One place that turns a failed response into an error code (FastAPI sends { detail }, our proxy sends { code }). 
export function codeFromResponse(status: number, json: unknown): string {
  const o = typeof json === "object" && json !== null ? (json as Record<string, unknown>) : {};
  if (typeof o.code === "string") return o.code;
  if (typeof o.detail === "string" && /^[a-z_]+$/.test(o.detail)) return o.detail; // e.g. "session_expired"
  if (status === 404 || status === 410) return "session_expired"; // unknown / expired session id
  if (status === 413) return "too_large";
  return "generic"; // includes 422 validation errors
}

async function call<T>(url: string, init?: RequestInit, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal });
  } catch {
    throw new ApiError("network");
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) throw new ApiError(codeFromResponse(res.status, json));
  return json as T;
}

const post = (body?: unknown): RequestInit => ({
  method: "POST",
  ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
});

export const createSession = (p: SessionInput) =>
  call<{ session_id: string; expires_in_seconds: number }>("/api/session", post(p));

export const startConsult = (sid: string) =>
  call<AnswerResult>(`/api/consult/${encodeURIComponent(sid)}/start`, post());

export const sendAnswer = (sid: string, answer: string | null, skip = false) =>
  call<AnswerResult>(`/api/consult/${encodeURIComponent(sid)}/answer`, post({ answer, skip }));

export const getSummary = (sid: string) =>
  call<ConsultSummary>(`/api/consult/${encodeURIComponent(sid)}/summary`);