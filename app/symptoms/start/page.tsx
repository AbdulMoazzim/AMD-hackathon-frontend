import { SymptomsExperience } from "@/components/SymptomsExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Describe your symptoms",
  description:
    "A 2-minute guided intake that turns how you feel into clear, local-language words, with emergency numbers for Pakistan, the US, UK, Germany and France.",
};

export default function SymptomsPage() {
  return (
      <main>
        <SymptomsExperience />
      </main>
  );
}