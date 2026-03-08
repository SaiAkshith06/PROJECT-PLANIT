import { useSearchParams } from "react-router-dom";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MapSection, { DAY_COLORS } from "@/components/MapSection";
import type { MapMarker, RouteSegment, MapSectionHandle } from "@/components/MapSection";
import { getDestinationData, generateItinerary } from "@/data/tripData";
import { Star, Hotel, Plane, Camera, Calendar, IndianRupee, Play, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TripPlanner = () => {
  const [params] = useSearchParams();
  const dest = params.get("dest") || "Goa";
  const daysParam = params.get("days");
  const budgetParam = params.get("budget");
  const days = daysParam ? parseInt(daysParam) : null;
  const budget = budgetParam ? parseInt(budgetParam) : null;

  const data = useMemo(() => getDestinationData(dest), [dest]);
  const itinerary = useMemo(() => (days ? generateItinerary(data, days) : null), [data, days]);

  const mapSectionRef = useRef<MapSectionHandle>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimStep, setCurrentAnimStep] = useState<string>("");
  const animationRef = useRef<NodeJS.Timeout[]>([]);

  // Collect all locations from itinerary for animation
  const allLocations = useMemo(() => {
    if (!itinerary) return [];
    const locs: { pos: [number, number]; name: string; description: string; dayLabel: string }[] = [];
    itinerary.forEach((day) => {
      day.locations.forEach((loc) => {
        locs.push({ ...loc, dayLabel: day.title });
      });
    });
    return locs;
  }, [itinerary]);

  const stopAnimation = useCallback(() => {
    animationRef.current.forEach(clearTimeout);
    animationRef.current = [];
    setIsAnimating(false);
    setCurrentAnimStep("");
    // Reset view
    mapSectionRef.current?.resetView(data.coords, 10);
  }, [data.coords]);

  const startAnimation = useCallback(() => {
    if (allLocations.length === 0) return;
    stopAnimation();
    setIsAnimating(true);

    const timeouts: NodeJS.Timeout[] = [];
    const DELAY_PER_LOCATION = 3500;

    allLocations.forEach((loc, i) => {
      const t = setTimeout(() => {
        setCurrentAnimStep(`${loc.dayLabel} — ${loc.name}`);
        mapSectionRef.current?.flyToMarker(loc.pos, loc.name, loc.description);
      }, i * DELAY_PER_LOCATION);
      timeouts.push(t);
    });

    // End animation
    const endT = setTimeout(() => {
      setIsAnimating(false);
      setCurrentAnimStep("");
      mapSectionRef.current?.resetView(data.coords, 10);
    }, allLocations.length * DELAY_PER_LOCATION + 2000);
    timeouts.push(endT);

    animationRef.current = timeouts;
  }, [allLocations, data.coords, stopAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationRef.current.forEach(clearTimeout);
    };
  }, []);

  const mapMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = [
      { pos: data.coords, name: data.name, description: `Your destination — ${data.name}` },
    ];
    data.nearbyMarkers.forEach((m) => {
      markers.push({ pos: m.pos, name: m.name, description: m.description });
    });
    return markers;
  }, [data]);

  const routes: RouteSegment[] = useMemo(() => {
    if (!itinerary) return [];
    return itinerary
      .filter((day) => day.locations.length >= 2)
      .map((day, i) => ({
        positions: day.locations.map((loc) => loc.pos),
        color: DAY_COLORS[i % DAY_COLORS.length],
        label: `Day ${day.day}`,
      }));
  }, [itinerary]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-8">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Trip to {data.name}
            </h1>
            {days && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="w-3 h-3" /> {days} Days
              </Badge>
            )}
            {budget && (
              <Badge variant="secondary" className="gap-1">
                <IndianRupee className="w-3 h-3" /> ₹{budget.toLocaleString()}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map */}
            <div className={`h-[500px] lg:h-auto lg:min-h-[700px] ${itinerary ? "lg:col-span-5" : "lg:col-span-6"}`}>
              <MapSection
                ref={mapSectionRef}
                center={data.coords}
                zoom={10}
                className="h-full"
                extraMarkers={mapMarkers}
                routes={routes}
              />
              {/* Animate step indicator */}
              {isAnimating && currentAnimStep && (
                <div className="mt-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{currentAnimStep}</span>
                </div>
              )}
              {/* Route legend */}
              {routes.length > 0 && !isAnimating && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {routes.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="w-4 h-1 rounded-full inline-block"
                        style={{ backgroundColor: r.color }}
                      />
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className={itinerary ? "lg:col-span-4" : "lg:col-span-6"}>
              <Tabs defaultValue="hotels" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="hotels" className="gap-1.5">
                    <Hotel className="w-4 h-4" /> Hotels
                  </TabsTrigger>
                  <TabsTrigger value="transport" className="gap-1.5">
                    <Plane className="w-4 h-4" /> Transport
                  </TabsTrigger>
                  <TabsTrigger value="sights" className="gap-1.5">
                    <Camera className="w-4 h-4" /> Sights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hotels" className="space-y-4 mt-4">
                  {data.hotels.map((h) => (
                    <div key={h.name} className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex">
                      <img src={h.image} alt={h.name} className="w-32 h-32 object-cover flex-shrink-0" />
                      <div className="p-4 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-foreground truncate">{h.name}</h3>
                          <div className="flex items-center gap-1 text-accent flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-medium">{h.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {h.amenities.map((a) => (
                            <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                        <p className="mt-3 text-primary font-semibold">₹{h.pricePerNight.toLocaleString()}<span className="text-muted-foreground font-normal text-xs"> /night</span></p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="transport" className="mt-4">
                  <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left p-3 font-medium text-muted-foreground">Mode</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Provider</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Price</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.transport.map((t, i) => (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-medium text-foreground">{t.mode}</td>
                            <td className="p-3 text-muted-foreground">{t.provider}</td>
                            <td className="p-3 text-right font-semibold text-primary">₹{t.price.toLocaleString()}</td>
                            <td className="p-3 text-right text-muted-foreground">{t.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="sights" className="space-y-3 mt-4">
                  {data.attractions.map((a) => (
                    <div key={a.name} className="bg-card rounded-xl border border-border shadow-card p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{a.name}</h3>
                          <p className="text-sm text-muted-foreground">{a.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-accent justify-end">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-medium">{a.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {a.entryFee > 0 ? `₹${a.entryFee}` : "Free"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{a.description}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Itinerary */}
            {itinerary && (
              <div className="lg:col-span-3">
                <div className="bg-card rounded-xl border border-border shadow-card p-5 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Your Itinerary
                    </h2>
                    {allLocations.length > 0 && (
                      <Button
                        size="sm"
                        variant={isAnimating ? "destructive" : "default"}
                        onClick={isAnimating ? stopAnimation : startAnimation}
                        className="gap-1.5 text-xs"
                      >
                        {isAnimating ? (
                          <>
                            <Square className="w-3 h-3" /> Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" /> Animate Plan
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="space-y-5">
                    {itinerary.map((day, dayIdx) => (
                      <div key={day.day} className="relative pl-6 border-l-2" style={{ borderColor: DAY_COLORS[dayIdx % DAY_COLORS.length] }}>
                        <div
                          className="absolute left-[-7px] top-0 w-3 h-3 rounded-full"
                          style={{ backgroundColor: DAY_COLORS[dayIdx % DAY_COLORS.length] }}
                        />
                        <h3 className="font-display font-semibold text-sm text-foreground mb-1.5">{day.title}</h3>
                        <ul className="space-y-1">
                          {day.activities.map((act, i) => (
                            <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                              • {act}
                            </li>
                          ))}
                        </ul>
                        {day.locations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {day.locations.map((loc, i) => (
                              <span key={i} className="text-[10px] bg-muted/30 text-muted-foreground rounded px-1.5 py-0.5">
                                📍 {loc.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
