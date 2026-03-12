import { useRef, useState, useEffect } from "react";
import SearchSection from "@/components/SearchSection";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularDestinations from "@/components/PopularDestinations";
import AirplaneIntro from "@/components/AirplaneIntro";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const introPlayed = sessionStorage.getItem("introPlayed");

    if (!introPlayed) {
      setShowIntro(true);
      sessionStorage.setItem("introPlayed", "true");
    } else {
      setIntroFinished(true);
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden bg-black">

      <Navbar />

      <HeroSection introFinished={introFinished} />

      <SearchSection />

      <PopularDestinations />

      {showIntro && (
        <AirplaneIntro
          onComplete={() => {
            setIntroFinished(true);
            setShowIntro(false);
          }}
        />
      )}

      <footer className="py-10 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PLANIT. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;