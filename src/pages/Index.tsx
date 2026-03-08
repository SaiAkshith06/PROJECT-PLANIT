import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripInputSection from "@/components/TripInputSection";
import PopularDestinations from "@/components/PopularDestinations";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
