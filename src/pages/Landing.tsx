import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/blocks/hero-section-1";
import { TrustSection } from "../components/TrustSection";
import { Services } from "../components/Services";
import { HowWeWork } from "../components/HowWeWork";
import { Portfolio } from "../components/Portfolio";
import { About } from "../components/About";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { Testimonials } from "../components/Testimonials";
import { Pricing } from "../components/Pricing";
import { ImageMarquee } from "../components/ImageMarquee";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { Preloader } from "../components/Preloader";
import { LivingCanvas } from "../components/LivingCanvas";
import { AIAutomation } from "../components/AIAutomation";
import { SERPSection } from "../components/SERPSection";
import { BackToTop } from "../components/BackToTop";
import { MetaTags } from "../components/MetaTags";

export default function Landing() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="min-h-screen text-cream selection:bg-mint selection:text-base overflow-x-hidden w-full">
      <MetaTags
        title="OXERFY | Digital Agency — Web, AI \& Marketing"
        description="Grow your business with expert WordPress development, AI automation, Meta marketing \& social media management. Based in Dhaka — serving clients worldwide."
        url="https://oxerfy.com/"
      />
      <Preloader onComplete={() => setLoading(false)} />
      
      {!loading && (
        <>
          <LivingCanvas />
          <Navbar />
          <HeroSection />
          <TrustSection />
          <Services />
          <AIAutomation />
          <HowWeWork />
          <Portfolio />
          <About />
          <WhyChooseUs />
          <SERPSection />
          <Testimonials />
          <ImageMarquee />
          <Pricing />
          <FAQ />
          <Footer />
          <BackToTop />
        </>
      )}
    </main>
  );
}
