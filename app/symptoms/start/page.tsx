import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SymptomsExperience } from "@/components/SymptomsExperience";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return { title: t("symptomsTitle"), description: t("symptomsDescription") };
}

export default async function SymptomsPage() {
  const locale = await getLocale();
  return (
    <main>
      <SymptomsExperience key={locale} />
    </main>
  );
}