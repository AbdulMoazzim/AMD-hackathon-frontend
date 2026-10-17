export type TargetLang = "en" | "ur" | "fr" | "de";

// Language names are shown in their own language on purpose.
export const TARGET_LANGS: { id: TargetLang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ur", label: "اردو (Urdu)" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
];

export const MAX_MB = 10;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export type Medication = {
  name: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
  warnings: string[];
};

export type DocumentResult = {
  documentType?: string;
  detectedLanguage?: string;
  summary?: string; // plain-language explanation
  translation: string; // full translated text
  medications: Medication[];
  warnings: string[];
};

export class ApiError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export function validateFile(file: File): "type" | "size" | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "type";
  if (file.size > MAX_MB * 1024 * 1024) return "size";
  return null;
}


export async function translateDocument(
  file: File,
  target: TargetLang,
  signal?: AbortSignal,
): Promise<DocumentResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("target_language", target);

  const res = await fetch("/api/translate-document", { method: "POST", body, signal });

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) throw new ApiError(str(obj(json).code) ?? "generic");

  const result = normalize(json);
  if (!result.translation && !result.summary && result.medications.length === 0) {
    throw new ApiError("empty");
  }
  return result;
}


const obj = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const pick = (r: Record<string, unknown>, ...keys: string[]) => keys.map((k) => r[k]).find((v) => v !== undefined);

function normalize(raw: unknown): DocumentResult {
  const r = obj(raw);
  const meds = pick(r, "medications", "medicines");
  return {
    documentType: str(pick(r, "documentType", "document_type")),
    detectedLanguage: str(pick(r, "detectedLanguage", "detected_language", "source_language")),
    summary: str(pick(r, "summary", "explanation")),
    translation: str(pick(r, "translation", "translated_text")) ?? "",
    medications: Array.isArray(meds)
      ? meds.map((m) => {
          const x = obj(m);
          return {
            name: str(x.name) ?? "—",
            dosage: str(x.dosage),
            frequency: str(x.frequency),
            instructions: str(x.instructions),
            warnings: strs(x.warnings),
          };
        })
      : [],
    warnings: strs(pick(r, "warnings", "precautions")),
  };
}