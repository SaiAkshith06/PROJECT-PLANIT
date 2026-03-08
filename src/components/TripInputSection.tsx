import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Wallet, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import GlobeMapSection from "@/components/GlobeMapSection";
import DetailedMapView from "@/components/DetailedMapView";
import { Globe } from "lucide-react";

const TripInputSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [showRestriction, setShowRestriction] = useState(false);
  const [mapMode, setMapMode] = useState(false);
  const [mapTarget, setMapTarget] = useState<{ name: string; lat: number; lng: number } | null>(null);

  const handleGenerate = () => {
    const params = new URLSearchParams();
    params.set("dest", destination || "Goa");
    if (days) params.set("days", days);
    if (budget) params.set("budget", budget);
    navigate(`/planner?${params.toString()}`);
  };

  const handleMapClick = useCallback((_name: string, isInIndia: boolean) => {
    if (isInIndia) {
      setShowRestriction(false);
    } else {
      setDestination("");
      setShowRestriction(true);
      setTimeout(() => setShowRestriction(false), 4000);
    }
  }, []);

  const handleZoomComplete = useCallback((name: string, lat: number, lng: number) => {
    setDestination(name);
    setMapTarget({ name, lat, lng });
    setMapMode(true);
  }, []);

  const handleBackToGlobe = useCallback(() => {
    setMapMode(false);
    setMapTarget(null);
  }, []);

  const handleMapDestinationSelect = useCallback((name: string) => {
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
                  placeholder="Click the globe or map to select"
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

      <section className="pb-20 pt-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                {mapMode ? "Detailed Map" : "Interactive Globe"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              {mapMode ? "Select Your Destination" : "Explore the World"}
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              {mapMode
                ? "Click anywhere on the map to choose your exact destination in India"
                : "Spin the globe and click anywhere in India to fly into the region"}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {mapMode && mapTarget ? (
              <DetailedMapView
                key="map"
                initialLat={mapTarget.lat}
                initialLng={mapTarget.lng}
                initialName={mapTarget.name}
                onBack={handleBackToGlobe}
                onDestinationSelect={handleMapDestinationSelect}
              />
            ) : (
              <motion.div
                key="globe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <GlobeMapSection
                  onLocationClick={handleMapClick}
                  onZoomComplete={handleZoomComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Restriction message */}
          <AnimatePresence>
            {showRestriction && !mapMode && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 mx-auto max-w-md"
              >
                <div
                  className="rounded-2xl p-4 flex items-center gap-3 border border-destructive/30"
                  style={{
                    background: "hsl(var(--card) / 0.85)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px hsl(0 0% 0% / 0.08)",
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4.5 h-4.5 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trip planning is currently available only for destinations within{" "}
                    <span className="font-semibold text-foreground">India</span>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default TripInputSection;
