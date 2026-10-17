import { CtaButtons } from "./CTA-Buttons";
import { idiqlat } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="px-6 py-32 md:py-44 text-center">
      <div className="mx-auto flex flex-col items-center gap-6">
        <h1
          className={`${idiqlat.className} text-[40px] font-semibold leading-tight md:text-[64px]`}
        >
          Feel less lost
          <br />
          when you need care abroad.
        </h1>
        <p className="max-w-2xl text-base md:text-lg">
          WellAbroad helps you explain your symptoms, understand medical
          documents, and navigate local healthcare in a language you understand.
        </p>
        <CtaButtons />
      </div>
    </section>
  );
}