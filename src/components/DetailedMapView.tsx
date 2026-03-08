import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DetailedMapViewProps {
  initialLat: number;
  initialLng: number;
  initialName: string;
  onBack: () => void;
  onDestinationSelect: (name: string) => void;
}

const DetailedMapView = ({
  initialLat,
  initialLng,
  initialName,
  onBack,
  onDestinationSelect,
}: DetailedMapViewProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string>(initialName);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  const isInIndia = useCallback((lat: number, lng: number) => {
    return lat >= 6.5 && lat <= 35.5 && lng >= 68.0 && lng <= 97.5;
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Custom marker icon
    const icon = L.divIcon({
      className: "custom-map-marker",
      html: `<div style="
        width: 20px; height: 20px; border-radius: 50%;
        background: hsl(27 90% 49%);
        border: 3px solid white;
        box-shadow: 0 0 12px hsl(27 90% 49% / 0.6), 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([initialLat, initialLng], { icon }).addTo(map);
    markerRef.current = marker;

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (!isInIndia(lat, lng)) return;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      setSelectedLatLng({ lat, lng });

      // Reverse geocode
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      )
        .then((r) => r.json())
        .then((data) => {
          const name =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state_district ||
            data.address?.state ||
            "Selected Location";
          setSelectedPlace(name);
        })
        .catch(() => setSelectedPlace("Selected Location"));
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialLat, initialLng, isInIndia]);

  const handlePlanTrip = () => {
    const params = new URLSearchParams();
    params.set("dest", selectedPlace);
    navigate(`/planner?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-[2rem]"
      style={{
        height: "560px",
        boxShadow:
          "0 0 60px 10px hsl(var(--primary) / 0.08), 0 20px 50px -10px hsl(0 0% 0% / 0.15), inset 0 0 0 1px hsl(var(--border) / 0.5)",
      }}
    >
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 left-4 z-[1000]"
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="gap-1.5 rounded-xl shadow-lg backdrop-blur-md bg-card/80 border border-border/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Globe
        </Button>
      </motion.div>

      {/* Navigation hint */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 z-[1000]"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border/50 shadow-md">
          <Navigation className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground font-medium">
            Click anywhere to select destination
          </span>
        </div>
      </motion.div>

      {/* Bottom destination card */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm"
          >
            <div
              className="rounded-2xl p-4 flex items-center justify-between border border-border/60"
              style={{
                background: "hsl(var(--card) / 0.85)",
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 8px 32px hsl(0 0% 0% / 0.12), 0 0 0 1px hsl(var(--border) / 0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <span className="font-display font-semibold text-foreground text-sm">
                    {selectedPlace}
                  </span>
                  <span className="block text-muted-foreground text-xs">
                    Selected destination
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handlePlanTrip}
                className="gap-1.5 rounded-xl shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Plan Trip
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-[2rem]"
        style={{
          boxShadow: "inset 0 0 40px 10px hsl(var(--background) / 0.15)",
        }}
      />
    </motion.div>
  );
};

export default DetailedMapView;
