import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Before-and-after examples of car detailing work by Car Poshish in Lahore.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">Our Work</span>
          <h1 style={{ fontSize: 38 }}>See the Difference</h1>
          <p>A few examples of cars we&apos;ve recently given a fresh Poshish.</p>
        </div>
      </section>

      <Gallery showHeading={false} />

      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
