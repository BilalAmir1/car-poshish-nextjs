import type { Metadata } from "next";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services",
  description:
    "See all car detailing services at Car Poshish in Lahore — exterior wash & polish, interior deep clean, full detailing, engine bay cleaning, headlight restoration, and ceramic coating, with prices.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const siteConfig = await getSiteSettings();

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">What We Offer</span>
          <h1 style={{ fontSize: 38 }}>Our Services</h1>
          <p>
            Every service is done at our shop{siteConfig ? ` in ${siteConfig.address.city}` : ""} by
            an experienced team, with clear, upfront pricing.
          </p>
        </div>
      </section>

      <Services showViewAll={false} showHeading={false} />

      <Reveal>
        <HowItWorks />
      </Reveal>

      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
