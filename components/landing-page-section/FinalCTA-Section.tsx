import { CtaButtons } from "./CTA-Buttons";

export function FinalCta() {
  return (
    <section className="px-6 py-28 text-center">
      <div className="mx-auto flex flex-col items-center gap-6">
        <h2 className="font-serif text-4xl font-semibold md:text-5xl">
          Feel less lost
          <br />
          when you need care abroad.
        </h2>
        <p className="max-w-xl text-sm md:text-base">
          WellAbroad helps you explain your symptoms, understand medical
          documents, and navigate local healthcare in a language you understand.
        </p>
        <CtaButtons />
      </div>
    </section>
  );
}