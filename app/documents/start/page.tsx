import type { Metadata } from "next";
import { DocumentTranslator } from "@/components/DocumentTranslator";

export const metadata: Metadata = {
  title: "Understand your document",
  description:
    "Upload a foreign prescription, lab report or medical note to get a translation and a clear, plain-language explanation.",
};

export default function DocumentsPage() {
  return (
      <main>
        <DocumentTranslator />
      </main>
  );
}