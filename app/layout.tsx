import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "WellAbroad | Healthcare, wherever life takes you",
    template: "%s | WellAbroad",
  },
  description:
    "WellAbroad helps you explain your symptoms, understand medical documents, and navigate local healthcare in a language you understand. No account required.",
  icons: {
    icon: "/icon.svg",
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
