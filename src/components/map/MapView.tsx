import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";

export interface MapMarker {
    name: string;
    position: [number, number];
}

interface MapViewProps {
    selectedLocation?: {
        lat: number;
        lng: number;
        name?: string;
    } | null;
    markers?: MapMarker[];
    routeCoordinates?: [number, number][];
    center?: [number, number];
    zoom?: number;
    height?: string;
}

// Internal component to access the map instance and handle animations
const MapController = ({ selectedLocation }: { selectedLocation?: MapViewProps["selectedLocation"] }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedLocation) {
            const { lat, lng } = selectedLocation;
            
            // Fly to destination smoothly
            map.flyTo([lat, lng], 13, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [selectedLocation, map]);

    return null;
};

const MapView = ({ 
    selectedLocation, 
    markers = [], 
    routeCoordinates = [],
    center = [20.5937, 78.9629], 
    zoom = 5,
    height = "600px" 
}: MapViewProps) => {
    const selectedMarkerRef = useRef<L.Marker | null>(null);

    // Effect to open popup when selectedLocation changes
    useEffect(() => {
        if (selectedLocation && selectedMarkerRef.current) {
            const timeoutId = setTimeout(() => {
                selectedMarkerRef.current?.openPopup();
            }, 1000); // Wait for flight animation to get close
            return () => clearTimeout(timeoutId);
        }
    }, [selectedLocation]);

    return (
        <div 
            className="w-full rounded-xl overflow-hidden shadow-sm border border-border bg-muted/30"
            style={{ height }}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                zoomControl={true}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController selectedLocation={selectedLocation} />
                
                {/* Route drawing */}
                {routeCoordinates && routeCoordinates.length > 0 && (
                    <Polyline 
                        positions={routeCoordinates} 
                        color="blue" 
                        weight={5} 
                        opacity={0.7}
                    />
                )}

                {/* Regular Markers (e.g. Sights) */}
                {markers.map((marker) => (
                    <Marker 
                        key={marker.name} 
                        position={marker.position}
                    >
                        <Popup>
                            <span className="font-medium text-primary text-base">{marker.name}</span>
                        </Popup>
                    </Marker>
                ))}

                {/* dynamic selectedLocation Marker */}
                {selectedLocation && (
                    <Marker 
                        position={[selectedLocation.lat, selectedLocation.lng]}
                        ref={(ref) => { selectedMarkerRef.current = ref; }}
                    >
                        {selectedLocation.name && (
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold text-lg m-0 text-black">{selectedLocation.name}</h4>
                                    <p className="text-xs text-zinc-500 m-0">Currently Selected</p>
                                </div>
                            </Popup>
                        )}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};



export default MapView;