import Image from "next/image";
import { Separator } from "../ui/separator";

export function Privacy() {
  return (
    <section id="privacy" className="px-6 py-24 bg-[#D2FFF5]">
      <div className="flex flex-col items-center text-center">
        <Image src="/icon.svg" alt="icon" width={40} height={40} className="size-16" />
        <h2 className="mt-12 font-serif mx-auto max-w-2xl text-3xl font-semibold">
          Health data that never leaves your hands.
        </h2>
        <p className="mt-8 text-sm md:text-base mx-auto max-w-5xl italic leading-relaxed">
          We believe medical privacy shouldn&apos;t require technical expertise
          or blind trust. WellAbroad is built without accounts, without cloud
          retention, and without diagnostic pretensions. Your symptoms and
          prescriptions are deciphered locally in your browser, helping you
          communicate clearly in a foreign clinic; and vanishing completely the
          moment your conversation ends.
        </p>
        <Separator className="my-10 max-w-sm bg-[#b3b4af]" />
        <p className="text-[11px] text-muted-foreground">
          Designed for travelers and expats · Zero persistent data · Ephemeral
          by default
        </p>
      </div>
    </section>
  );
}