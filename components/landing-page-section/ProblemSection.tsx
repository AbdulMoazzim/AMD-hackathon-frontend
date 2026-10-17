import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { idiqlat } from "@/lib/utils";

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

export function Problem() {
  return (
    <section className="lg:px-14 px-6 py-32 md:py-60">
      <div className="mx-auto max-w-360">
        <div className="text-center">
          <h2
            className={`${idiqlat.className} mx-auto max-w-2xl text-[30px] font-semibold leading-tight md:text-[40px]`}
          >
            Getting healthcare abroad shouldn&apos;t feel overwhelming.
          </h2>
          <p className="mx-auto mt-4 max-w-5xl text-lg md:text-xl">
            When you don&apos;t speak the local language, even simple healthcare
            interactions can become stressful. Explaining how you feel,
            understanding medical instructions, or knowing where to go
            shouldn&apos;t make getting care harder.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:gap-14 md:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title} className="overflow-hidden p-4 rounded-3xl shadow-xl">
              <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-t-3xl px-6 text-center text-sm italic md:text-[15px]">
                <Image
                  src="/card-bg.svg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                  aria-hidden
                />
                <span className="relative z-10">&ldquo;{p.quote}&rdquo;</span>
              </div>
              <CardContent className="px-7 pb-10 pt-8">
                <h3
                  className={`${idiqlat.className} text-2xl font-semibold leading-tight md:text-[28px]`}
                >
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed md:text-[15px]">
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