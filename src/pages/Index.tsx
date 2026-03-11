import { useRef, useState } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripInputSection from "@/components/TripInputSection";
import PopularDestinations from "@/components/PopularDestinations";
import HowItWorks from "@/components/HowItWorks";
import AirplaneIntro from "@/components/AirplaneIntro";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowIntro(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-white"
    >
      {/* HERO VIDEO loads immediately but only plays after intro */}
      <Navbar />
      <HeroSection introComplete={introComplete} />
      <TripInputSection />
      <PopularDestinations />
      <HowItWorks />

      {/* INTRO sits on top */}
      {showIntro && (
        <AirplaneIntro onComplete={handleIntroComplete} />
      )}

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 PLANIT. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;