import { useRef, useState, useEffect } from "react";
import SearchSection from "@/components/SearchSection";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationScroller from "@/components/DestinationScroller";
import AirplaneIntro from "@/components/AirplaneIntro";
import MapView from "@/components/map/MapView";
import { SITE_NAME } from "@/config/site";

type Location = {
  lat: number;
  lng: number;
};

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  // 🔹 Selected destination for map zoom
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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

      {/* Destination cards now send location to map */}
      <DestinationScroller
        onDestinationClick={(location: Location) =>
          setSelectedLocation(location)
        }
      />

      {/* Map Section */}
      <div className="mt-24 px-6">
        <MapView selectedLocation={selectedLocation} />
      </div>

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
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;