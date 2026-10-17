import { getTranslations } from "next-intl/server";
import { FinalCta } from "@/components/landing-page-section/FinalCTA-Section";
import { Privacy } from "@/components/landing-page-section/PrivacySection";
import { ServiceSection } from "@/components/ServiceSection";

async function DescribeSymptomsPage() {
    const t = await getTranslations("symptomsLanding");
    const common = await getTranslations("common");

    return (
        <main>
            <ServiceSection
                bannerTitle={t("bannerTitle")}
                bannerSubtitle={t("bannerSubtitle")}
                title={t("title")}
                description={t("description")}
                features={[{ text: t("feature1") }, { text: t("feature2") }]}
                cta={{ label: t("cta"), href: "/symptoms/start" }}
                ctaNote={t("ctaNote")}
                disclaimer={common("disclaimer")}
                copyright="© 2026 WellAbroad"
            />
        </main>
    );
}

export default DescribeSymptomsPage;