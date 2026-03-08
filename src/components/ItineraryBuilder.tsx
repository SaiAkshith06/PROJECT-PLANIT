import { useState } from "react";
import { MapPin, CheckCircle, Plus, X, Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Attraction } from "@/data/tripData";
import type { CustomItinerary } from "@/data/communityItineraries";

interface ItineraryBuilderProps {
  destination: string;
  attractions: Attraction[];
  onSave: (itinerary: CustomItinerary) => void;
  onClose: () => void;
}

const ItineraryBuilder = ({ destination, attractions, onSave, onClose }: ItineraryBuilderProps) => {
  const [name, setName] = useState("");
  const [startPoint, setStartPoint] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");
  const [selectedStops, setSelectedStops] = useState<Set<string>>(new Set());

  const toggleStop = (attrName: string) => {
    setSelectedStops((prev) => {
      const next = new Set(prev);
      if (next.has(attrName)) {
        next.delete(attrName);
      } else {
        next.add(attrName);
      }
      return next;
    });
  };

  const canSave = name.trim() && startPoint && endPoint && selectedStops.size > 0;

  const handleSave = () => {
    if (!canSave) return;

    const startAttr = attractions.find((a) => a.name === startPoint);
    const endAttr = attractions.find((a) => a.name === endPoint);
    const middleStops = attractions.filter(
      (a) => selectedStops.has(a.name) && a.name !== startPoint && a.name !== endPoint
    );

    const stops = [
      ...(startAttr ? [{ name: startAttr.name, coords: startAttr.coords, description: startAttr.description }] : []),
      ...middleStops.map((a) => ({ name: a.name, coords: a.coords, description: a.description })),
      ...(endAttr && endAttr.name !== startPoint
        ? [{ name: endAttr.name, coords: endAttr.coords, description: endAttr.description }]
        : []),
    ];

    const itinerary: CustomItinerary = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      destination,
      startPoint,
      endPoint,
      stops,
      createdAt: new Date().toISOString().split("T")[0],
      author: "You",
    };

    onSave(itinerary);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-hero w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" />
            Create Your Itinerary
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Itinerary Name</label>
            <Input
              placeholder="e.g. My Perfect Day in Agra"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Start Point */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-travel-forest text-primary-foreground flex items-center justify-center text-[10px] font-bold">S</span>
              Starting Point
            </label>
            <div className="grid grid-cols-2 gap-2">
              {attractions.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setStartPoint(a.name)}
                  className={`text-left text-xs p-2.5 rounded-lg border transition-all ${
                    startPoint === a.name
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{a.name}</span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{a.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* End Point */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-destructive text-primary-foreground flex items-center justify-center text-[10px] font-bold">E</span>
              End Point
            </label>
            <div className="grid grid-cols-2 gap-2">
              {attractions.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setEndPoint(a.name)}
                  className={`text-left text-xs p-2.5 rounded-lg border transition-all ${
                    endPoint === a.name
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{a.name}</span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{a.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stops to visit */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Places to Visit
            </label>
            <p className="text-[11px] text-muted-foreground">Select the places you want to include in your route</p>
            <div className="space-y-2">
              {attractions.map((a) => {
                const isSelected = selectedStops.has(a.name);
                return (
                  <button
                    key={a.name}
                    onClick={() => toggleStop(a.name)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-primary" : "border-muted"
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm text-foreground">{a.name}</span>
                      <span className="block text-[11px] text-muted-foreground truncate">{a.description}</span>
                    </div>
                    <span className="text-[10px] bg-muted/30 text-muted-foreground rounded px-1.5 py-0.5 flex-shrink-0">
                      {a.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {canSave && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs font-medium text-foreground mb-1">Your Route:</p>
              <p className="text-[11px] text-muted-foreground">
                {startPoint} → {[...selectedStops].filter((s) => s !== startPoint && s !== endPoint).join(" → ")}
                {[...selectedStops].filter((s) => s !== startPoint && s !== endPoint).length > 0 ? " → " : ""}
                {endPoint}
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-5 rounded-b-2xl">
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Create Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
