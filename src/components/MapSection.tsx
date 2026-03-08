import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const defaultMarkers = [
  { pos: [15.2993, 74.124] as [number, number], name: "Goa" },
  { pos: [32.2396, 77.1887] as [number, number], name: "Manali" },
  { pos: [10.8505, 76.2711] as [number, number], name: "Kerala" },
  { pos: [-8.3405, 115.092] as [number, number], name: "Bali" },
  { pos: [48.8566, 2.3522] as [number, number], name: "Paris" },
];

interface MapSectionProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  extraMarkers?: { pos: [number, number]; name: string }[];
}

const MapSection = ({
  center = [20.5937, 78.9629],
  zoom = 4,
  className = "",
  extraMarkers,
}: MapSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  const allMarkers = extraMarkers || defaultMarkers;

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    leafletMap.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    allMarkers.forEach((m) => {
      L.marker(m.pos, { icon: defaultIcon }).addTo(map).bindPopup(m.name);
    });

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card ${className}`}>
      <div ref={mapRef} style={{ height: "100%", minHeight: 400 }} />
    </div>
  );
};

export default MapSection;
