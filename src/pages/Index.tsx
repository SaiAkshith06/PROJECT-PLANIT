import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripInputSection from "@/components/TripInputSection";
import MapSection from "@/components/MapSection";
import PopularDestinations from "@/components/PopularDestinations";
import HowItWorks from "@/components/HowItWorks";
import { Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TripInputSection />

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Explore the Map
          </h2>
          <div className="h-[450px]">
            <MapSection />
          </div>
        </div>
      </section>

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
