import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TripInputSection = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");

  const handleGenerate = () => {
    navigate(`/planner?dest=${encodeURIComponent(destination || "Goa")}&days=${days || 3}&budget=${budget || 50000}`);
  };

  return (
    <section className="relative -mt-16 z-10 pb-16">
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
                placeholder="Where do you want to go?"
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
  );
};

export default TripInputSection;
