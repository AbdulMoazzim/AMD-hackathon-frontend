"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Camera,
  Check,
  Copy,
  FileText,
  Loader2,
  Lock,
  Printer,
  RotateCcw,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { idiqlat } from "@/lib/utils";
import {
  ACCEPTED_TYPES,
  ApiError,
  MAX_MB,
  TARGET_LANGS,
  translateDocument,
  validateFile,
  type DocumentResult,
  type TargetLang,
} from "@/lib/translate-document";

const h2 = `${idiqlat.className} text-[30px] font-semibold leading-tight md:text-[40px]`;
const h3 = `${idiqlat.className} text-2xl font-semibold leading-tight md:text-[28px]`;

type Status = "idle" | "loading" | "done" | "error";

/* ------------------------------ result view ------------------------------ */

function Result({
  result,
  lang,
  onReset,
}: {
  result: DocumentResult;
  lang: TargetLang;
  onReset: () => void;
}) {
  const t = useTranslations("documents.result");
  const [copied, setCopied] = useState(false);
  const dir = lang === "ur" ? "rtl" : "ltr";
  const languageName = TARGET_LANGS.find((l) => l.id === lang)?.label;

  async function copy() {
    const parts = [
      result.summary,
      ...result.medications.map((m) =>
        [m.name, m.dosage, m.frequency, m.instructions].filter(Boolean).join(" · "),
      ),
      result.translation,
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join("\n\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className={h2}>{t("title")}</h2>
        <p className="mt-2 text-sm md:text-[15px]">
          {[
            result.documentType,
            result.detectedLanguage && t("original", { language: result.detectedLanguage }),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      {result.summary && (
        <div>
          <h3 className={h3}>{t("plain")}</h3>
          <p className="mt-3 text-base leading-relaxed" dir={dir} lang={lang}>
            {result.summary}
          </p>
        </div>
      )}

      {result.medications.length > 0 && (
        <div>
          <h3 className={h3}>{t("meds")}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {result.medications.map((m, i) => (
              <div key={m.name + i} className="rounded-2xl border p-5" dir={dir} lang={lang}>
                <p className="text-lg font-semibold">{m.name}</p>
                <div className="mt-3 space-y-1 text-sm md:text-[15px]">
                  {m.dosage && <p>{m.dosage}</p>}
                  {m.frequency && <p>{m.frequency}</p>}
                  {m.instructions && <p className="text-muted-foreground">{m.instructions}</p>}
                </div>
                {m.warnings.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-amber-900 md:text-sm">
                    {m.warnings.map((w) => (
                      <li key={w} className="flex gap-2">
                        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-5" dir={dir} lang={lang}>
          <p className="flex items-center gap-2 font-semibold text-amber-900">
            <TriangleAlert className="size-4" aria-hidden /> {t("precautions")}
          </p>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-amber-900 md:text-[15px]">
            {result.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {result.translation && (
        <div>
          <h3 className={h3}>
            {t("full")}
            {languageName ? ` · ${languageName}` : ""}
          </h3>
          <div
            className="mt-3 whitespace-pre-wrap rounded-2xl bg-muted p-5 text-base leading-relaxed"
            dir={dir}
            lang={lang}
          >
            {result.translation}
          </div>
        </div>
      )}

      <p className="text-xs italic md:text-sm">{t("note")}</p>

      <div className="flex flex-col gap-3 md:flex-row print:hidden">
        <Button onClick={() => window.print()} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          <Printer className="size-4" aria-hidden /> {t("print")}
        </Button>
        <Button variant="outline" onClick={copy} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? t("copied") : t("copy")}
        </Button>
        <Button variant="ghost" onClick={onReset} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          <RotateCcw className="size-4" aria-hidden /> {t("another")}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------ main ------------------------------ */

export function DocumentTranslator() {
  const t = useTranslations("documents");
  const common = useTranslations("common");

  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<TargetLang>("en");
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [dragging, setDragging] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const preview = useMemo(
    () => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Error codes come from validateFile / the API route; unknown codes fall back to "generic".
  const errorText = (code: string) =>
    t.has(`errors.${code}`) ? t(`errors.${code}`, { max: MAX_MB }) : t("errors.generic");

  function pick(f: File | undefined | null) {
    if (!f) return;
    const problem = validateFile(f);
    if (problem) {
      setErrorCode(problem);
      setStatus("error");
      return;
    }
    setFile(f);
    setErrorCode(null);
    setStatus("idle");
  }

  async function submit() {
    if (!file) return;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus("loading");
    setErrorCode(null);
    try {
      const r = await translateDocument(file, target, ctrl.signal);
      setResult(r);
      setStatus("done");
    } catch (e) {
      if (ctrl.signal.aborted) {
        setStatus("idle");
        return;
      }
      setErrorCode(e instanceof ApiError ? e.code : "unexpected");
      setStatus("error");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setFile(null);
    setResult(null);
    setErrorCode(null);
    setStatus("idle");
  }

  const loading = status === "loading";

  return (
    <section className="px-4 py-6 md:px-14 md:py-10 print:p-0">
      <div className="mx-auto max-w-6xl">
        {/* banner */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-t-3xl px-6 text-center h-80 print:hidden">
          <Image src="/background.svg" alt="" fill priority sizes="100vw" className="object-cover" aria-hidden />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h1 className={`${idiqlat.className} text-[30px] font-semibold leading-tight md:text-[40px]`}>
              {t("banner.title")}
            </h1>
            <p className="mt-2 text-base md:text-lg">{t("banner.subtitle")}</p>
          </div>
        </div>

        <div className="rounded-b-3xl bg-white px-6 py-10 shadow-lg md:px-10 md:py-14 print:p-0 print:shadow-none">
          {status === "done" && result ? (
            <Result result={result} lang={target} onReset={reset} />
          ) : (
            <div className="mx-auto max-w-2xl space-y-8 print:hidden">
              <div>
                <h2 className={h2}>{t("upload.title")}</h2>
                <p className="mt-2 text-base">{t("upload.body")}</p>
              </div>

              {/* drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  pick(e.dataTransfer.files?.[0]);
                }}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors md:p-10 ${
                  dragging ? "border-foreground bg-muted" : "border-border"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-4">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt={t("upload.previewAlt")} className="max-h-64 rounded-xl border object-contain" />
                    ) : (
                      <FileText className="size-14" aria-hidden />
                    )}
                    <p className="break-all text-sm md:text-[15px]">
                      {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFile(null);
                        setStatus("idle");
                      }}
                      disabled={loading}
                      className="gap-2 text-[15px] md:text-base"
                    >
                      <X className="size-4" aria-hidden /> {t("upload.remove")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="size-10" aria-hidden />
                    <p className="text-base">{t("upload.drag")}</p>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <Button onClick={() => fileInput.current?.click()} className="h-12 gap-2 px-6 text-[15px] md:text-base">
                        <Upload className="size-4" aria-hidden /> {t("upload.choose")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => cameraInput.current?.click()}
                        className="h-12 gap-2 px-6 text-[15px] md:text-base"
                      >
                        <Camera className="size-4" aria-hidden /> {t("upload.photo")}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      {t("upload.formats", { max: MAX_MB })}
                    </p>
                  </div>
                )}

                <input
                  ref={fileInput}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => {
                    pick(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <input
                  ref={cameraInput}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    pick(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* language */}
              <label className="block">
                <span className="text-base font-semibold">{t("upload.translateInto")}</span>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as TargetLang)}
                  disabled={loading}
                  className="mt-2 h-12 w-full rounded-xl border bg-white px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {TARGET_LANGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* status */}
              <div aria-live="polite">
                {loading && (
                  <p className="flex items-center gap-3 rounded-xl bg-muted p-4 text-sm md:text-[15px]">
                    <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
                    {t("upload.reading")}
                  </p>
                )}
                {status === "error" && errorCode && (
                  <p role="alert" className="flex gap-3 rounded-xl border border-red-600/40 bg-red-50 p-4 text-sm text-red-900 md:text-[15px]">
                    <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
                    {errorText(errorCode)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {loading ? (
                  <Button
                    variant="outline"
                    onClick={() => abortRef.current?.abort()}
                    className="h-14 w-full text-[15px] md:text-base"
                  >
                    {t("upload.cancel")}
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={!file}
                    className="h-14 w-full text-[15px] md:text-base"
                  >
                    {t("upload.submit")}
                  </Button>
                )}

                {/* TODO: adjust this wording to match what your backend actually does with uploads */}
                <p className="flex items-start gap-2 text-xs md:text-sm">
                  <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {t("upload.privacy")}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs italic md:flex-row md:justify-between print:hidden">
          <p>{common("disclaimer")}</p>
          <p>© 2026 WellAbroad</p>
        </div>
      </div>
    </section>
  );
}