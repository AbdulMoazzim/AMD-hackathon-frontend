// app/page.tsx
// Setup: npx shadcn@latest add button card sheet separator
// Backgrounds/gradients and fonts are left as marked hooks (search "BG:" and "font-serif").

import Link from "next/link";
import { Command, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Idiqlat } from "next/font/google";

const idiqlat = Idiqlat({
  weight: ['400'], // Choose '200' for ExtraLight, '300' for Light, or '400' for Regular
  subsets: ['latin'], // Idiqlat primarily supports the Syriac script style
  display: 'swap',
  fallback: ["inter"]
})

/* ----------------------------- content ----------------------------- */

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Privacy & safety", href: "#privacy" },
];

const problems = [
  {
    quote: "I don't know how to explain what I'm feeling.",
    title: "Finding the right words",
    body: "Describing symptoms in another language can be difficult, especially when you're already feeling unwell and anxious. Nuance often gets lost in auto-translation apps.",
  },
  {
    quote: "What does this prescription say?",
    title: "Understanding medical information",
    body: "Prescriptions, consultation notes, and discharge instructions can be hard to understand in an unfamiliar script, leaving patients uncertain about dosaging and aftercare.",
  },
  {
    quote: "Should I visit a pharmacy or a doctor?",
    title: "Knowing where to go",
    body: "Every country has its own healthcare system, referral expectations, and triage levels. Knowing where to start is not always straightforward for an outsider.",
  },
];

const steps = [
  {
    title: "The right questions help you find the right words.",
    body: "Guided questions help users describe their symptoms, organise relevant information, and prepare a structured bilingual summary to show a doctor or pharmacist. Users can review their answers before generating or sharing the summary.",
  },
  {
    title: "Make sense of your medical information.",
    body: "Upload or scan a prescription, medical report, or consultation note to get a translation and a plain-language explanation of active ingredients, dosages, and precautions. WellAbroad helps you understand your documents with clarity, without diagnosing or replacing healthcare advice.",
  },
  {
    title: "Take your summary with you.",
    body: "Export or print a clear, bilingual clinical intake sheet ready for reception or the attending doctor, ensuring your medical history and current concerns are communicated accurately.",
  },
];

const useCases = [
  {
    title: "When you're travelling",
    body: "You feel unwell abroad and need to explain your symptoms at a local pharmacy or clinic quickly and clearly without misinterpretations.",
    href: "#how-it-works",
  },
  {
    title: "After a consultation",
    body: "You receive a document in a language you don't fully understand and need help making sense of dosages, active ingredients, and care steps.",
    href: "#how-it-works",
  },
  {
    title: "Settling into a new country",
    body: "You need to understand how to navigate the local healthcare system, find reliable primary care, and register your health history accurately.",
    href: "#how-it-works",
  },
];

const footerColumns = [
  {
    heading: "Product",
    links: [
      "Symptom Explainer",
      "Medical Documents Lens",
      "PDF Export",
      "Local Health Guidance",
    ],
  },
  {
    heading: "Governance",
    links: [
      "Privacy Notice",
      "Terms of Service",
      "Clinical Disclaimer",
      "Security Overview",
    ],
  },
  {
    heading: "Team",
    links: ["Fakhir Khan", "Abdul Moazzam", "Asiya Sohail", "Ahiam Afraas"],
  },
];

/* ----------------------------- shared bits ----------------------------- */

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/icon.svg" alt="icon" width={40} height={40} className="w-6" />
      <span className={`${idiqlat.className} text-3xl font-semibold leading-none pt-1.25`}>WellAbroad</span>
    </Link>
  );
}


/* ----------------------------- sections ----------------------------- */

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-14">
        <Logo />

        {/* desktop */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* mobile */}
        <div className="md:hidden">

          <Sheet>
            <SheetTrigger aschild="true">
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col gap-6 px-6 text-lg">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function CtaButtons() {
  return (
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:justify-center">
      <Button aschild="true" className="px-5 py-">
        <Link href="/symptoms">Describe my symptoms</Link>
      </Button>
      <Button aschild="true" variant="outline" className="px-5 py-" >
        <Link href="/documents">Understand my document</Link>
      </Button>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative md:flex md:min-h-[70vh] md:items-center md:justify-center">

      <div
        aria-hidden
        className="relative h-56 w-full overflow-hidden md:absolute md:inset-0 md:h-auto"
      >
        <Image
          src="/background-hero.svg"
          alt="bg-hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-5 px-6 py-8 md:items-center md:gap-6 md:py-24 md:text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-6xl">
          Healthcare, wherever life takes you
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          WellAbroad helps you explain your symptoms, understand medical
          documents, and navigate local healthcare in a language you understand.
        </p>
        <CtaButtons />
        <p className="text-xs text-muted-foreground">
          Designed with privacy in mind. No account required.
        </p>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">
            Getting healthcare abroad shouldn&apos;t feel overwhelming.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            When you don&apos;t speak the local language, even simple healthcare
            interactions can become stressful. Explaining how you feel,
            understanding medical instructions, or knowing where to go
            shouldn&apos;t make getting care harder.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title} className="overflow-hidden p-2">
              {/* BG: card image gradient */}
              <div className="flex h-36 items-center justify-center rounded-lg px-6 text-center text-sm italic">
                &ldquo;{p.quote}&rdquo;
              </div>
              <CardContent className="px-4 pb-4 pt-5">
                <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    // BG: mint gradient
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">
            Making healthcare easier to understand, wherever you are.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            WellAbroad helps you explain your symptoms in another language,
            understand medical documents, and feel more prepared when navigating
            healthcare abroad.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              {/* text */}
              <div
                className={`max-w-sm ${i % 2 === 1 ? "md:order-2 md:justify-self-end" : "md:justify-self-center"
                  }`}
              >
                <h3 className="font-serif text-2xl font-semibold">{s.title}</h3>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>

              {/* image placeholder: swap for <Image /> or a product mockup */}
              <Card
                className={`aspect-[7/5] w-full ${i % 2 === 1 ? "md:order-1" : ""
                  }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section id="use-cases" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">
            Different situations. One less language barrier.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Whether you are traveling for a week, recovering from a doctor&apos;s
            visit, or relocating long-term, WellAbroad adapts to your medical
            context.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {useCases.map((u, i) => (
            <Link key={u.title} href={u.href} className="group">
              <Card className="h-full overflow-hidden p-0">
                <CardContent className="p-6">
                  <span className="flex size-6 items-center justify-center rounded border text-xs">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-semibold">
                    {u.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {u.body}
                  </p>
                </CardContent>
                {/* BG: card image gradient */}
                <div className="h-36" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    // BG: mint
    <section id="privacy" className="px-6 py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Image src="/icon.svg" alt="icon" width={40} height={40} className="size-16" />
        <h2 className="mt-8 font-serif text-3xl font-semibold">
          Health data that never leaves your hands.
        </h2>
        <p className="mt-8 text-sm italic leading-relaxed">
          We believe medical privacy shouldn&apos;t require technical expertise
          or blind trust. WellAbroad is built without accounts, without cloud
          retention, and without diagnostic pretensions. Your symptoms and
          prescriptions are deciphered locally in your browser, helping you
          communicate clearly in a foreign clinic; and vanishing completely the
          moment your conversation ends.
        </p>
        <Separator className="my-10 max-w-sm" />
        <p className="text-[11px] text-muted-foreground">
          Designed for travelers and expats · Zero persistent data · Ephemeral
          by default
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 py-28 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h2 className="font-serif text-4xl font-semibold md:text-5xl">
          Feel less lost
          <br />
          when you need care abroad.
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          WellAbroad helps you explain your symptoms, understand medical
          documents, and navigate local healthcare in a language you understand.
        </p>
        <CtaButtons />
      </div>
    </section>
  );
}

function Footer() {
  return (
    // BG: footer gradient
    <footer className="mx-4 mb-4 rounded-2xl px-8 py-10 md:mx-auto md:max-w-6xl">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-xs text-muted-foreground">
            Empowering travelers, international residents, and students to
            navigate foreign healthcare environments safely, clearly, and with
            human dignity.
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.heading}>
            <h4 className="font-serif text-sm font-semibold">{col.heading}</h4>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-foreground">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-[11px] italic text-muted-foreground">
        © 2026 WellAbroad Inc. Not a medical diagnostic tool or substitute for
        direct professional medical advice.
      </p>
    </footer>
  );
}

/* ----------------------------- page ----------------------------- */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <UseCases />
        <Privacy />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}