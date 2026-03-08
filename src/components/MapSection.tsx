import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultMarkers = [
  { pos: [15.2993, 74.124] as [number, number], name: "Goa", description: "Beach paradise with vibrant nightlife." },
  { pos: [32.2396, 77.1887] as [number, number], name: "Manali", description: "Mountain town for adventure lovers." },
  { pos: [10.8505, 76.2711] as [number, number], name: "Kerala", description: "God's Own Country — backwaters & spice gardens." },
  { pos: [28.6139, 77.209] as [number, number], name: "Delhi", description: "Capital city rich in Mughal heritage." },
  { pos: [19.076, 72.8777] as [number, number], name: "Mumbai", description: "City of dreams and Bollywood." },
  { pos: [27.1767, 78.0081] as [number, number], name: "Agra", description: "Home of the iconic Taj Mahal." },
  { pos: [26.9124, 75.7873] as [number, number], name: "Jaipur", description: "The Pink City of royal palaces." },
];

export interface MapMarker {
  pos: [number, number];
  name: string;
  description?: string;
}

export interface RouteSegment {
  positions: [number, number][];
  color: string;
  label?: string;
}

export interface MapSectionHandle {
  flyToMarker: (pos: [number, number], name: string, description?: string) => void;
  resetView: (center: [number, number], zoom: number) => void;
}

interface MapSectionProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  extraMarkers?: MapMarker[];
  routes?: RouteSegment[];
  onLocationClick?: (name: string) => void;
  interactive?: boolean;
}

const DAY_COLORS = [
  "#E67514",
  "#06923E",
  "#2563EB",
  "#9333EA",
  "#DC2626",
  "#0891B2",
  "#CA8A04",
];

const MapSection = forwardRef<MapSectionHandle, MapSectionProps>(({
  center = [22.5937, 78.9629],
  zoom = 5,
  className = "",
  extraMarkers,
  routes,
  onLocationClick,
  interactive = false,
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const routesLayer = useRef<L.LayerGroup | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const allMarkers = extraMarkers || defaultMarkers;

  useImperativeHandle(ref, () => ({
    flyToMarker(pos, name, description) {
      if (!leafletMap.current) return;
      leafletMap.current.flyTo(pos, 13, { duration: 1.5 });
      // Open the popup for this marker
      const key = `${pos[0]},${pos[1]}`;
      const marker = markerRefs.current.get(key);
      if (marker) {
        setTimeout(() => marker.openPopup(), 1600);
      } else {
        // Create a temporary popup
        setTimeout(() => {
          if (!leafletMap.current) return;
          L.popup({ className: "custom-popup" })
            .setLatLng(pos)
            .setContent(`
              <div style="font-family: 'Alfa Slab One', serif; min-width: 160px;">
                <strong style="font-size: 14px; color: #212121;">${name}</strong>
                ${description ? `<p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">${description}</p>` : ""}
              </div>
            `)
            .openOn(leafletMap.current);
        }, 1600);
      }
    },
    resetView(center, zoom) {
      if (!leafletMap.current) return;
      leafletMap.current.flyTo(center, zoom, { duration: 1.5 });
    },
  }));

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
      dragging: true,
    }).setView(center, zoom);
    leafletMap.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    routesLayer.current = L.layerGroup().addTo(map);

    if (interactive && onLocationClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        let nearestName = "";
        let nearestDist = Infinity;
        defaultMarkers.forEach((m) => {
          const dist = Math.sqrt(Math.pow(m.pos[0] - lat, 2) + Math.pow(m.pos[1] - lng, 2));
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestName = m.name;
          }
        });
        if (nearestDist < 3 && nearestName) {
          onLocationClick(nearestName);
        }
      });
    }

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    leafletMap.current.flyTo(center, zoom, { duration: 1.5 });
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();
    markerRefs.current.clear();

    allMarkers.forEach((m) => {
      const popupContent = `
        <div style="font-family: 'Alfa Slab One', serif; min-width: 160px;">
          <strong style="font-size: 14px; color: #212121;">${m.name}</strong>
          ${m.description ? `<p style="font-size: 12px; color: #555; margin: 4px 0 0 0;">${m.description}</p>` : ""}
        </div>
      `;
      const marker = L.marker(m.pos, { icon: defaultIcon })
        .bindPopup(popupContent, { className: "custom-popup" });

      if (interactive && onLocationClick) {
        marker.on("click", () => {
          onLocationClick(m.name);
        });
      }

      markersLayer.current!.addLayer(marker);
      markerRefs.current.set(`${m.pos[0]},${m.pos[1]}`, marker);
    });
  }, [allMarkers, interactive, onLocationClick]);

  useEffect(() => {
    if (!routesLayer.current) return;
    routesLayer.current.clearLayers();

    if (!routes) return;

    routes.forEach((route) => {
      if (route.positions.length < 2) return;

      const polyline = L.polyline(route.positions, {
        color: route.color,
        weight: 4,
        opacity: 0.8,
        dashArray: "8, 8",
        lineCap: "round",
      });

      if (route.label) {
        polyline.bindTooltip(route.label, {
          permanent: true,
          direction: "center",
          className: "route-label",
        });
      }

      routesLayer.current!.addLayer(polyline);

      route.positions.forEach((pos, i) => {
        if (i === 0 || i === route.positions.length - 1) return;
        L.circleMarker(pos, {
          radius: 4,
          color: route.color,
          fillColor: route.color,
          fillOpacity: 1,
          weight: 2,
        }).addTo(routesLayer.current!);
      });
    });
  }, [routes]);

  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-card ${className}`}>
      <div ref={mapRef} style={{ height: "100%", minHeight: 400 }} />
    </div>
  );
});

MapSection.displayName = "MapSection";

export { DAY_COLORS };
export default MapSection;
