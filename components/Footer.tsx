import Image from "next/image";
import { Logo } from "./Navbar";
import Link from "next/link";

const footerColumns = [
    {
        heading: "Product",
        links: [
            "Symptom Explainer",
            "Medical Documents Lens",
            "PDF Export",
            "Local Health Guidance",
        ],
    },
    {
        heading: "Governance",
        links: [
            "Privacy Notice",
            "Terms of Service",
            "Clinical Disclaimer",
            "Security Overview",
        ],
    },
    {
        heading: "Team",
        links: ["Fakhir Khan", "Abdul Moazzam", "Asiya Sohail", "Ahiam Afraas"],
    },
];

export function Footer() {
    return (
        <footer className="relative overflow-hidden rounded-t-2xl px-8 pt-24 pb-10">
            <Image
                src="/background.svg"
                alt="bg-footer"
                fill
                sizes="100vw"
                className="-z-10 object-cover"
                aria-hidden
            />

            <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] pb-10">
                <div className="md:px-12">
                    <Logo />
                    <p className="mt-3 text-sm md:text-base">
                        Empowering travelers, international residents, and students to
                        navigate foreign healthcare environments safely, clearly, and with
                        human dignity.
                    </p>
                </div>

                {footerColumns.map((col) => (
                    <div key={col.heading}>
                        <h4 className="font-serif text-lg font-semibold">{col.heading}</h4>
                        <ul className="mt-3 space-y-2 text-sm md:text-base">
                            {col.links.map((l) => (
                                <li key={l}>
                                    <Link href="#" className="hover:text-foreground">
                                        {l}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <p className="mt-12 text-center text-[11px] italic">
                © 2026 WellAbroad Inc. Not a medical diagnostic tool or substitute for
                direct professional medical advice.
            </p>
        </footer>
    );
}