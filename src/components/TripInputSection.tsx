import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import GlobeMapSection from "@/components/GlobeMapSection";
import { Globe } from "lucide-react";

const TripInputSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");

  const handleGenerate = () => {
    const params = new URLSearchParams();
    params.set("dest", destination || "Goa");
    if (days) params.set("days", days);
    if (budget) params.set("budget", budget);
    navigate(`/planner?${params.toString()}`);
  };

  const handleMapClick = useCallback((name: string) => {
    setDestination(name);
  }, []);

  return (
    <>
      <section className="relative -mt-16 z-10 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl shadow-hero p-6 md:p-8 max-w-4xl mx-auto border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Destination
                </label>
                <Input
                  placeholder="Click the map or type here"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" /> Number of Days
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-primary" /> Budget (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>
            <Button onClick={handleGenerate} size="lg" className="w-full h-12 text-base font-semibold gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Trip Plan
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Explore India
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Click any location on the map to select it as your destination
          </p>
          <div className="h-[500px]">
            <MapSection
              interactive
              onLocationClick={handleMapClick}
            />
          </div>
          {destination && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-card rounded-xl border border-border shadow-card p-4 flex items-center justify-between max-w-md"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-display font-semibold text-foreground">{destination}</span>
                <span className="text-muted-foreground text-sm">selected</span>
              </div>
              <Button size="sm" onClick={handleGenerate} className="gap-1.5">
                <Sparkles className="w-4 h-4" />
                Plan Trip
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default TripInputSection;
