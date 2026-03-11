import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      {showIntro && <AirplaneIntro onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <HeroSection />
      <TripInputSection />
      <PopularDestinations />
      <HowItWorks />

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 PLANIT. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
