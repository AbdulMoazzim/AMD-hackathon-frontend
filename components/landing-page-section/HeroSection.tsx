import Image from "next/image";
import { CtaButtons } from "./CTA-Buttons";

export function Hero() {
  return (
    <section className="relative md:flex md:min-h-[80vh] md:items-center md:justify-center">

      <div
        aria-hidden
        className="relative h-56 w-full overflow-hidden md:absolute md:inset-0 md:h-auto"
      >
        <Image
          src="/background.svg"
          alt="bg-hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto flex flex-col items-start gap-5 px-6 py-8 md:items-center md:gap-6 md:py-12 md:text-center">
        <h1 className="font-serif text-3xl font-semibold  md:text-6xl">
          Healthcare, wherever life takes you
        </h1>
        <p className="max-w-3xl text-sm md:text-xl">
          WellAbroad helps you explain your symptoms, understand medical
          documents, and navigate local healthcare in a language you understand.
        </p>
        <CtaButtons />
        <p className="text-sm">
          Designed with privacy in mind. No account required.
        </p>
      </div>
    </section>
  );
}