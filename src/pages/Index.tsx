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

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">

      {/* Landing page loads immediately */}
      <Navbar />
      <HeroSection />
      <TripInputSection />
      <PopularDestinations />
      <HowItWorks />

      {/* Intro sits on top */}
      {showIntro && (
        <AirplaneIntro onComplete={() => setShowIntro(false)} />
      )}

    </div>
  );
};

export default Index;