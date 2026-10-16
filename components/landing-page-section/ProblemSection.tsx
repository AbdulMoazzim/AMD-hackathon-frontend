import Image from "next/image";
import { Card, CardContent } from "../ui/card";

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
    <section className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-serif mx-auto max-w-2xl  text-3xl font-semibold md:text-4xl">
            Getting healthcare abroad shouldn&apos;t feel overwhelming.
          </h2>
          <p className="mt-4 text-sm mx-auto max-w-5xl md:text-base">
            When you don&apos;t speak the local language, even simple healthcare
            interactions can become stressful. Explaining how you feel,
            understanding medical instructions, or knowing where to go
            shouldn&apos;t make getting care harder.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title} className="overflow-hidden p-2">
              <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-t-lg px-6 text-center text-sm italic">
                <Image
                  src="/card-bg.svg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                  aria-hidden
                />
                <span className="relative z-10">
                  &ldquo;{p.quote}&rdquo;
                </span>
              </div>
              <CardContent className="px-4 pb-4 pt-5">
                <h3 className="font-serif text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed">
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