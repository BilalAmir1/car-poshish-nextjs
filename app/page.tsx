import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";

// Home inherits its <title>/description/OG tags from the default metadata
// in app/layout.tsx.

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Reveal>
        <Services limit={3} showViewAll />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
