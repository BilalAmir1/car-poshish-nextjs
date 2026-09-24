import type { Metadata } from "next";
import { getSeatCoverConfig, getSiteSettings } from "@/lib/cms";
import SeatCoverCustomizer from "@/components/SeatCoverCustomizer";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Custom Seat Covers",
  description:
    "Design custom car seat covers in Lahore — choose your car type, material, color, and stitching, and see a live price estimate.",
  alternates: { canonical: "/seat-covers" },
};

export default async function SeatCoversPage() {
  const [config, siteConfig] = await Promise.all([getSeatCoverConfig(), getSiteSettings()]);

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">Made For Your Car</span>
          <h1 style={{ fontSize: 38 }}>{config?.title || "Custom Seat Covers"}</h1>
          <p>
            {config?.description ||
              "Design a seat cover set made for your car — pick your car type, material, color, and stitching."}
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          {config && siteConfig ? (
            <SeatCoverCustomizer config={config} whatsapp={siteConfig.whatsapp} />
          ) : (
            <p className="content-unavailable">
              The seat cover designer is temporarily unavailable. Please
              check back shortly, or call/WhatsApp us directly.
            </p>
          )}
        </div>
      </section>

      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
