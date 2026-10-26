import { ApiError, codeFromResponse, createSession, LANG_EN } from "./consult";
import type { Lang } from "./symptoms-data";

export { ApiError };

export type TargetLang = Lang;

export const TARGET_LANGS: { id: TargetLang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ur", label: "اردو (Urdu)" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "es", label: "Español" },
];

export const MAX_MB = 4;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export type DocumentResult = {
  docId: string;
  explanation: string;
  extracted: Record<string, unknown>;
  unreadable: string[];
  disclaimer?: string;
};

export type ChatReply = { answer: string; urgent: boolean; disclaimer?: string };

// A document session is tied to one language, so it is replaced when the language changes. 
export type DocSession = { sid: string; lang: Lang };

// Returns an error code ("type" | "size") or null when the file is fine.
export function validateFile(file: File): "type" | "size" | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "type";
  if (file.size > MAX_MB * 1024 * 1024) return "size";
  return null;
}

const obj = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
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

// The documents page has no country picker, so everything follows the language the person chose.
const newSession = async (lang: Lang): Promise<DocSession> => ({
  sid: (
    await createSession({
      ui_lang: LANG_EN[lang],
      country: "Not specified",
      local_lang: LANG_EN[lang],
      preferred_lang: LANG_EN[lang],
    })
  ).session_id,
  lang,
});


async function upload(file: File, sid: string, lang: Lang, signal?: AbortSignal) {
  const body = new FormData();
  body.append("file", file);
  body.append("session_id", sid);
  body.append("ui_lang", LANG_EN[lang]);

  const r = obj(await request<unknown>("/api/docs", { method: "POST", body, signal }));
  const result: DocumentResult = {
    docId: str(r.doc_id) ?? "",
    explanation: str(r.explanation) ?? "",
    extracted: obj(r.extracted),
    unreadable: strs(r.unreadable_parts),
    disclaimer: str(r.disclaimer),
  };
  if (!result.docId || (!result.explanation && Object.keys(result.extracted).length === 0)) {
    throw new ApiError("empty");
  }
  return result;
}

// Reuses the session while the target language stays the same, creates a new one when it changes (so follow-up chat answers match), and recreates it once if it expired.
export async function analyzeDocument(
  file: File,
  target: Lang,
  session: DocSession | null,
  signal?: AbortSignal,
): Promise<{ session: DocSession; result: DocumentResult }> {
  let current = session && session.lang === target ? session : await newSession(target);
  try {
    return { session: current, result: await upload(file, current.sid, target, signal) };
  } catch (e) {
    if (e instanceof ApiError && e.code === "session_expired") {
      current = await newSession(target);
      return { session: current, result: await upload(file, current.sid, target, signal) };
    }
    throw e;
  }
}


export async function askDocument(docId: string, sid: string, message: string, signal?: AbortSignal): Promise<ChatReply> {
  const r = obj(
    await request<unknown>(`/api/docs/${encodeURIComponent(docId)}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sid }),
      signal,
    }),
  );
  return { answer: str(r.answer) ?? "", urgent: r.urgent === true, disclaimer: str(r.disclaimer) };
}

export const getExplanation = (docId: string, sid: string) =>
  request<string>(`/api/docs/${encodeURIComponent(docId)}/explanation?session_id=${encodeURIComponent(sid)}`);