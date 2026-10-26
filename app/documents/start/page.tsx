import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { DocumentTranslator } from "@/components/DocumentTranslator";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return { title: t("documentsTitle"), description: t("documentsDescription") };
}

export default async function DocumentsPage() {
  const locale = await getLocale();
  return (
    <main>
      <DocumentTranslator key={locale} />
    </main>
  );
}