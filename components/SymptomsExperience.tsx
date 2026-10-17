"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Phone,
  Printer,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { idiqlat } from "@/lib/utils";
import {
  COUNTRIES,
  LABELS,
  LANG_NAME,
  MISC,
  OPTIONS,
  WARNING_SIGNS,
  type Country,
  type CountryId,
  type Lang,
  type Opt,
  type T,
} from "../lib/symptoms-data";


type Answers = {
  area?: string;
  start?: string;
  onset?: string;
  sev?: number;
  pattern?: string;
  assoc: string[];
  allergies: string;
  meds: string;
  conditions: string;
  notes: string;
};

const EMPTY: Answers = { assoc: [], allergies: "", meds: "", conditions: "", notes: "" };

type Step =
  | { id: "area" | "start" | "onset" | "pattern"; q: string; kind: "single"; options: Opt[]; required?: boolean }
  | { id: "sev"; q: string; kind: "scale" }
  | { id: "assoc"; q: string; kind: "multi"; options: Opt[] }
  | { id: "details"; q: string; kind: "details" };

const STEPS: Step[] = [
  { id: "area", q: "What is the main problem?", kind: "single", options: OPTIONS.area, required: true },
  { id: "start", q: "When did it start?", kind: "single", options: OPTIONS.start },
  { id: "onset", q: "Did it start suddenly or gradually?", kind: "single", options: OPTIONS.onset },
  { id: "sev", q: "How strong is it, from 0 to 10?", kind: "scale" },
  { id: "pattern", q: "Is it constant, or does it come and go?", kind: "single", options: OPTIONS.pattern },
  { id: "assoc", q: "Any other symptoms? Choose all that apply.", kind: "multi", options: OPTIONS.assoc },
  { id: "details", q: "A few details for the doctor (optional)", kind: "details" },
];

/* ------------------------------ helpers ------------------------------ */

const same = (v: string): T => ({ en: v, fr: v, de: v, ur: v });
const find = (list: Opt[], id?: string) => list.find((x) => x.id === id)?.t;

function buildRows(a: Answers): { label: T; value: T }[] {
  const un = MISC.unanswered;
  const text = (v: string) => (v.trim() ? same(v.trim()) : un);
  const assocValue: T = a.assoc.length
    ? (Object.fromEntries(
        (["en", "fr", "de", "ur"] as Lang[]).map((l) => [
          l,
          a.assoc
            .map((id) => find(OPTIONS.assoc, id)?.[l])
            .filter(Boolean)
            .join(l === "ur" ? "، " : ", "),
        ]),
      ) as T)
    : un;
  const sevValue: T =
    a.sev === undefined
      ? un
      : (Object.fromEntries(
          (["en", "fr", "de", "ur"] as Lang[]).map((l) => [l, MISC.sev[l].replace("{n}", String(a.sev))]),
        ) as T);

  return [
    { label: LABELS.area, value: find(OPTIONS.area, a.area) ?? un },
    { label: LABELS.start, value: find(OPTIONS.start, a.start) ?? un },
    { label: LABELS.onset, value: find(OPTIONS.onset, a.onset) ?? un },
    { label: LABELS.sev, value: sevValue },
    { label: LABELS.pattern, value: find(OPTIONS.pattern, a.pattern) ?? un },
    { label: LABELS.assoc, value: assocValue },
    { label: LABELS.allergies, value: text(a.allergies) },
    { label: LABELS.meds, value: text(a.meds) },
    { label: LABELS.conditions, value: text(a.conditions) },
    { label: LABELS.notes, value: text(a.notes) },
  ];
}

const h2 = `${idiqlat.className} text-[30px] font-semibold leading-tight md:text-[40px]`;
const h3 = `${idiqlat.className} text-2xl font-semibold leading-tight md:text-[28px]`;

/* ------------------------------ pieces ------------------------------ */

function CallLink({ tel, children, className = "" }: { tel: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={`tel:${tel}`}
      className={`inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline ${className}`}
    >
      {children}
    </a>
  );
}

function EmergencyPanel({ country }: { country: Country | null }) {
  if (!country) {
    return (
      <p className="rounded-2xl border border-dashed p-6 text-center text-sm md:text-[15px]">
        Choose your country to see local emergency numbers.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-red-600/40 bg-red-50">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-1 size-5 shrink-0 text-red-700" aria-hidden />
          <div>
            <h3 className={`${h3} text-red-900`}>In an emergency, call now</h3>
            <p className="mt-1 text-sm text-red-900/80 md:text-[15px]">{country.primary.label}</p>
          </div>
        </div>
        <Button
          render={<a href={`tel:${country.primary.tel}`} />}
          nativeButton={false}
          className="h-14 gap-3 bg-red-700 px-8 text-lg text-white hover:bg-red-800"
        >
          <Phone className="size-5" aria-hidden />
          {country.primary.number}
        </Button>
      </div>

      <div className="grid gap-6 border-t border-red-600/20 bg-white p-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide md:text-sm">
            Call immediately if you have
          </p>
          <ul className="mt-3 space-y-2 text-sm md:text-[15px]">
            {WARNING_SIGNS.map((w) => (
              <li key={w} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-red-700" />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide md:text-sm">
            Other useful numbers in {country.name}
          </p>
          <ul className="mt-3 space-y-3 text-sm md:text-[15px]">
            {country.contacts.map((c) => (
              <li key={c.number + c.label}>
                <CallLink tel={c.tel}>
                  <Phone className="size-4" aria-hidden />
                  {c.number}
                </CallLink>
                <span className="ml-2">{c.label}</span>
                {c.note && <span className="block text-xs text-muted-foreground md:text-sm">{c.note}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground md:text-sm">{country.note}</p>
          <a
            href={country.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline md:text-sm"
          >
            Source: {country.source.label}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}

function Tile({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected ? "border-foreground bg-foreground text-background" : "bg-white hover:bg-muted"
      } ${className}`}
    >
      <span>{children}</span>
      {selected && <Check className="size-4 shrink-0" aria-hidden />}
    </button>
  );
}

const field =
  "w-full rounded-xl border bg-white px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/* ------------------------------ summary ------------------------------ */

function Summary({
  answers,
  country,
  onRestart,
}: {
  answers: Answers;
  country: Country;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const rows = buildRows(answers);
  const lang = country.lang;
  const bilingual = lang !== "en";
  const urgent = answers.area === "chest" || (answers.sev ?? 0) >= 8;

  async function copy() {
    const lines = rows.map((r) => `${r.label.en}: ${r.value.en}`);
    if (bilingual) lines.push("", ...rows.map((r) => `${r.label[lang]}: ${r.value[lang]}`));
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-6">
      {urgent && (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-600/40 bg-red-50 p-4 text-sm text-red-900 print:hidden md:text-[15px]"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>
            Some of your answers may need prompt medical attention. If you feel worse, or you are
            unsure, call{" "}
            <CallLink tel={country.primary.tel} className="text-red-900">
              {country.primary.number}
            </CallLink>{" "}
            now instead of waiting.
          </p>
        </div>
      )}

      <div>
        <h2 className={h2}>Your summary</h2>
        <p className="mt-2 text-sm md:text-[15px] print:hidden">
          {bilingual
            ? `Show this to a doctor or pharmacist. It is in English and ${LANG_NAME[lang]}.`
            : "Show this to a doctor or pharmacist."}{" "}
          Free-text answers are shown as you typed them and are not translated.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div
          className={`grid bg-muted text-xs font-semibold uppercase tracking-wide md:text-sm ${
            bilingual ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div className="px-4 py-3">English</div>
          {bilingual && (
            <div className="border-l px-4 py-3" dir={lang === "ur" ? "rtl" : "ltr"} lang={lang}>
              {LANG_NAME[lang]}
            </div>
          )}
        </div>
        {rows.map((r) => (
          <div key={r.label.en} className={`grid border-t ${bilingual ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground md:text-sm">{r.label.en}</p>
              <p className="text-base">{r.value.en}</p>
            </div>
            {bilingual && (
              <div className="border-l px-4 py-3" dir={lang === "ur" ? "rtl" : "ltr"} lang={lang}>
                <p className="text-xs text-muted-foreground md:text-sm">{r.label[lang]}</p>
                <p className="text-base">{r.value[lang]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row print:hidden">
        <Button onClick={() => window.print()} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          <Printer className="size-4" aria-hidden /> Print or save as PDF
        </Button>
        <Button variant="outline" onClick={copy} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy text"}
        </Button>
        <Button variant="ghost" onClick={onRestart} className="h-12 gap-2 px-6 text-[15px] md:text-base">
          <RotateCcw className="size-4" aria-hidden /> Start over
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------ main ------------------------------ */

export function SymptomsExperience() {
  const [countryId, setCountryId] = useState<CountryId | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  const country = COUNTRIES.find((c) => c.id === countryId) ?? null;
  const current = STEPS[step];
  const done = step >= STEPS.length;

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  function toggleAssoc(id: string) {
    setAnswers((a) => {
      if (id === "none") return { ...a, assoc: a.assoc.includes("none") ? [] : ["none"] };
      const without = a.assoc.filter((x) => x !== "none");
      return { ...a, assoc: without.includes(id) ? without.filter((x) => x !== id) : [...without, id] };
    });
  }

  function restart() {
    setAnswers(EMPTY);
    setStep(0);
  }

  const canNext = !(current && current.kind === "single" && current.required && !answers[current.id]);

  return (
    <section className="px-4 py-6 md:px-14 md:py-10 print:p-0 md:mb-40">
      <div className="mx-auto max-w-6xl">
        {/* banner */}
        <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-t-3xl px-6 text-center md:h-64 print:hidden">
          <Image src="/background.svg" alt="" fill priority sizes="100vw" className="object-cover" aria-hidden />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h1 className={`${idiqlat.className} text-[30px] font-semibold leading-tight md:text-[40px]`}>
              Be understood anywhere.
            </h1>
            <p className="mt-2 text-base md:text-lg">
              A 2-minute guided intake that turns how you feel into clear, local-language words for
              doctors and pharmacies abroad.
            </p>
          </div>
        </div>

        <div className="space-y-12 rounded-b-3xl bg-white px-6 py-10 shadow-lg md:px-10 md:py-14 print:p-0 print:shadow-none">
          {/* country */}
          <div className="print:hidden">
            <h2 className={h2}>Where are you?</h2>
            <p className="mt-2 text-base">
              We use this to show the right emergency numbers and to translate your summary.
            </p>
            <div role="group" aria-label="Country" className="mt-5 flex flex-wrap gap-3">
              {COUNTRIES.map((c) => (
                <Button
                  key={c.id}
                  variant={countryId === c.id ? "default" : "outline"}
                  aria-pressed={countryId === c.id}
                  onClick={() => setCountryId(c.id)}
                  className="h-11 px-5 text-[15px] md:text-base"
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="print:hidden">
            <EmergencyPanel country={country} />
          </div>

          {/* questionnaire / summary */}
          {country && (
            <div>
              {done ? (
                <Summary answers={answers} country={country} onRestart={restart} />
              ) : (
                <div className="mx-auto max-w-2xl print:hidden">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span>
                      Question {step + 1} of {STEPS.length}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted" aria-hidden>
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>

                  <h2 className={`${h2} mt-8`}>{current.q}</h2>

                  <div className="mt-6">
                    {current.kind === "single" && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {current.options.map((opt) => (
                          <Tile
                            key={opt.id}
                            selected={answers[current.id] === opt.id}
                            onClick={() => set(current.id, opt.id)}
                          >
                            {opt.t.en}
                          </Tile>
                        ))}
                      </div>
                    )}

                    {current.kind === "scale" && (
                      <div>
                        <div className="grid grid-cols-6 gap-2 md:grid-cols-11">
                          {Array.from({ length: 11 }, (_, n) => (
                            <Tile
                              key={n}
                              selected={answers.sev === n}
                              onClick={() => set("sev", n)}
                              className="justify-center px-0"
                            >
                              {n}
                            </Tile>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground md:text-sm">
                          <span>No discomfort</span>
                          <span>Worst imaginable</span>
                        </div>
                      </div>
                    )}

                    {current.kind === "multi" && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {current.options.map((opt) => (
                          <Tile key={opt.id} selected={answers.assoc.includes(opt.id)} onClick={() => toggleAssoc(opt.id)}>
                            {opt.t.en}
                          </Tile>
                        ))}
                      </div>
                    )}

                    {current.kind === "details" && (
                      <div className="space-y-4">
                        {(
                          [
                            ["allergies", "Allergies", "e.g. penicillin, peanuts"],
                            ["meds", "Medication right now", "Name and dose if you know it"],
                            ["conditions", "Known health conditions", ""],
                          ] as const
                        ).map(([key, label, ph]) => (
                          <label key={key} className="block">
                            <span className="text-sm md:text-[15px]">{label}</span>
                            <input
                              className={`${field} mt-1`}
                              value={answers[key]}
                              placeholder={ph}
                              onChange={(e) => set(key, e.target.value)}
                            />
                          </label>
                        ))}
                        <label className="block">
                          <span className="text-sm md:text-[15px]">Anything else to add?</span>
                          <textarea
                            className={`${field} mt-1 min-h-24`}
                            value={answers.notes}
                            onChange={(e) => set("notes", e.target.value)}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      disabled={step === 0}
                      onClick={() => setStep((s) => s - 1)}
                      className="h-12 gap-2 px-5 text-[15px] md:text-base"
                    >
                      <ArrowLeft className="size-4" aria-hidden /> Back
                    </Button>
                    <Button
                      disabled={!canNext}
                      onClick={() => setStep((s) => s + 1)}
                      className="h-12 gap-2 px-8 text-[15px] md:text-base"
                    >
                      {step === STEPS.length - 1 ? "Review my answers" : "Next"}
                      <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs italic md:flex-row md:justify-between print:mt-4">
          <p>
            WellAbroad is a medical communication aid, not a diagnostic service. In an emergency, call{" "}
            {country ? country.primary.number : "your local emergency number"}.
          </p>
          <p>© 2026 WellAbroad</p>
        </div>
      </div>
    </section>
  );
}