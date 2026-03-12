import { useState } from "react";
import { useParams } from "react-router-dom";
import { destinationDetails } from "../data/destinationDetails";
import MapView from "../components/map/MapView";

const DestinationPage = () => {
  const { name } = useParams<{ name: string }>();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  
  // New state for Itinerary Builder
  const [showPlanner, setShowPlanner] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [days, setDays] = useState(1);
  const [itinerary, setItinerary] = useState<{ day: number; places: string[] }[]>([]);
  const [saved, setSaved] = useState(false);

  const destination = name ? destinationDetails[name.toLowerCase()] : null;

  // Dictionary for destination descriptions
  const descriptions: Record<string, string> = {
    goa: "Goa is known for its beaches, vibrant nightlife, Portuguese heritage, and scenic coastal landscapes.",
    mumbai: "Mumbai, the City of Dreams, is a bustling metropolis known for its historic landmarks, vibrant street food, and as the heart of Bollywood.",
    manali: "Manali is a breathtaking hill station nestled in the Himalayas, famous for its snow-capped mountains, adventure sports, and scenic beauty.",
    kerala: "Kerala, known as God's Own Country, offers serene backwaters, lush tea plantations, and tranquil beaches.",
    jaipur: "Jaipur, the Pink City, is renowned for its magnificent forts, royal palaces, and rich cultural heritage.",
    ladakh: "Ladakh is a high-altitude desert known for its stunning landscapes, Buddhist monasteries, and crystal-clear lakes."
  };

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Destination not found</h1>
      </div>
    );
  }

  const description = name ? descriptions[name.toLowerCase()] : "Explore the beautiful destination and its unique experiences.";

  // Pre-mapping sights to Marker format for the map
  const markers = destination.sights.map(sight => ({
    name: sight.name,
    position: [sight.lat, sight.lng] as [number, number]
  }));

  const handleTogglePlace = (placeName: string) => {
    setSelectedPlaces(prev => 
      prev.includes(placeName) 
        ? prev.filter(p => p !== placeName) 
        : [...prev, placeName]
    );
  };

  const handleGenerateItinerary = () => {
    if (selectedPlaces.length === 0) return;
    
    const newItinerary: { day: number; places: string[] }[] = [];
    const placesPerDay = Math.ceil(selectedPlaces.length / days);
    
    for (let i = 0; i < days; i++) {
      const dayPlaces = selectedPlaces.slice(i * placesPerDay, (i + 1) * placesPerDay);
      if (dayPlaces.length > 0) {
        newItinerary.push({ day: i + 1, places: dayPlaces });
      }
    }
    
    setItinerary(newItinerary);
    setSaved(false); // Reset saved state when new itinerary is generated

    // Generate map route from selected places
    const route = selectedPlaces.map(placeName => {
      const sight = destination.sights.find(s => s.name === placeName);
      return sight ? [sight.lat, sight.lng] as [number, number] : null;
    }).filter((coord): coord is [number, number] => coord !== null);

    setRouteCoordinates(route);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-zinc-100 border-2 border-black">
          <span className="text-sm font-black uppercase tracking-widest">Destination Guide</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight uppercase leading-none">{destination.name}</h1>
        <p className="max-w-2xl mx-auto text-xl font-medium text-zinc-500 mb-12 leading-relaxed italic">
          "{description}"
        </p>
        <div className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative">
          <img 
            src={destination.heroImage} 
            alt={destination.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      </section>

      <div className="space-y-32">
        {/* Map Section */}
        <section>
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Explore the Map</h2>
            <div className="h-2 flex-grow bg-black rounded-full" />
          </div>
          <div className="rounded-[3rem] overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <MapView 
              selectedLocation={selectedLocation} 
              markers={markers}
              routeCoordinates={routeCoordinates}
              center={[destination.sights[0].lat, destination.sights[0].lng]}
              zoom={12}
              height="550px"
            />
          </div>
        </section>

        {/* Transport Section */}
        <section className="bg-zinc-50 p-12 rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(228,228,231,1)]">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">Transport</h2>
          
          <div className="max-w-md mb-16">
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Plan from Your Location</label>
            <input 
              type="text" 
              placeholder="Enter your origin city" 
              className="w-full p-6 bg-white border-4 border-black rounded-2xl font-black text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Flights */}
            <div className="bg-white p-10 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all">
              <h3 className="text-2xl font-black mb-8 border-b-4 border-zinc-50 pb-4 flex items-center gap-3">
                <span className="text-3xl">✈️</span> Flights
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <p className="font-black text-xl group-hover:text-blue-600 transition-colors">IndiGo</p>
                  <div className="text-right">
                    <p className="font-black text-lg">₹4500</p>
                    <p className="text-xs font-bold text-zinc-400 uppercase">1h 20m</p>
                  </div>
                </div>
                <div className="flex justify-between items-center group">
                  <p className="font-black text-xl group-hover:text-sky-600 transition-colors">Air India</p>
                  <div className="text-right">
                    <p className="font-black text-lg">₹5200</p>
                    <p className="text-xs font-bold text-zinc-400 uppercase">1h 30m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trains */}
            <div className="bg-white p-10 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all">
              <h3 className="text-2xl font-black mb-8 border-b-4 border-zinc-50 pb-4 flex items-center gap-3">
                <span className="text-3xl">🚂</span> Trains
              </h3>
              <div className="flex justify-between items-center group mb-8">
                <p className="font-black text-xl group-hover:text-orange-600 transition-colors">Konark Exp</p>
                <div className="text-right">
                  <p className="font-black text-lg">₹1200</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase">14h</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Terminus</p>
                <p className="font-bold text-zinc-600">{destination.transport.trainStation || "Central Station"}</p>
              </div>
            </div>

            {/* Bus */}
            <div className="bg-white p-10 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] transition-all md:col-span-1">
              <h3 className="text-2xl font-black mb-8 border-b-4 border-zinc-50 pb-4 flex items-center gap-3">
                <span className="text-3xl">🚌</span> Bus
              </h3>
              <div className="flex justify-between items-center group">
                <p className="font-black text-xl group-hover:text-green-600 transition-colors">Luxury Sleeper</p>
                <div className="text-right">
                  <p className="font-black text-lg">₹1800</p>
                  <p className="text-xs font-bold text-zinc-400 uppercase">12h</p>
                </div>
              </div>
            </div>

            {/* Drive */}
            <div 
              onClick={() => {
                const sampleRoute: [number, number][] = [
                  [17.3850, 78.4867], // Hyderabad
                  [16.5, 77.2],
                  [15.8, 75.5],
                  [destination.sights[0].lat, destination.sights[0].lng] // Destination
                ];
                setRouteCoordinates(sampleRoute);
                setSelectedLocation({ 
                  lat: 17.3850, 
                  lng: 78.4867, 
                  name: "Start: Hyderabad" 
                });
              }}
              className="bg-black text-white p-10 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform cursor-pointer group"
            >
              <h3 className="text-2xl font-black mb-8 border-b-2 border-zinc-800 pb-4 flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span className="text-3xl text-white">🚗</span> Drive
                </span>
                <span className="text-xs uppercase font-black bg-white text-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Show Route</span>
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Distance</p>
                  <p className="text-4xl font-black">670<span className="text-sm ml-1 text-zinc-500">KM</span></p>
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Est. Time</p>
                  <p className="text-4xl font-black">11<span className="text-sm ml-1 text-zinc-500">H</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hotels Section */}
        <section>
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Luxury Stays</h2>
            <div className="h-2 flex-grow bg-black rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {destination.hotels.map((hotel, index) => (
              <div key={index} className="p-8 border-4 border-black rounded-[2.5rem] bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group h-full">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-black uppercase leading-tight">{hotel.name}</h3>
                    <div className="bg-zinc-100 px-3 py-1 rounded-full border-2 border-black flex items-center gap-1">
                      <span className="text-xs">⭐</span>
                      <span className="text-sm font-black">{(hotel as any).rating || "4.5"}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-zinc-900 mb-8">{hotel.price}</p>
                </div>

                <button 
                  onClick={() => {
                    const lat = (hotel as any).lat || destination.sights[0].lat;
                    const lng = (hotel as any).lng || destination.sights[0].lng;
                    setSelectedLocation({ lat, lng, name: hotel.name });
                  }}
                  className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all"
                >
                  View on Map
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sightseeing Section */}
        <section className="pb-16">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Top Sights</h2>
            <div className="h-2 flex-grow bg-black rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destination.sights.map((sight, index) => (
              <div key={index} className="p-10 bg-white rounded-[2.5rem] border-4 border-black shadow-[10px_10px_0px_0px_rgba(244,244,245,1)] flex flex-col justify-between hover:bg-black hover:text-white transition-all group cursor-pointer"
                   onClick={() => setSelectedLocation({ lat: sight.lat, lng: sight.lng, name: sight.name })}>
                <div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📍</div>
                  <h3 className="text-2xl font-black uppercase mb-6 leading-tight">{sight.name}</h3>
                </div>
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest opacity-60 group-hover:opacity-100">
                  <span>Pin to Map</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Create Itinerary Section */}
        <section className="pb-32 text-center">
          <div className="bg-white border-4 border-black p-12 md:p-20 rounded-[3.5rem] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-12 tracking-tighter leading-none">Create Your Trip</h2>
            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              <button className="w-full md:w-auto px-16 py-8 bg-black text-white text-2xl font-black uppercase tracking-widest rounded-[2rem] border-4 border-black hover:bg-white hover:text-black transition-all shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] hover:shadow-none focus:translate-x-1 focus:translate-y-1">
                Generate Itinerary
              </button>
              <button 
                onClick={() => setShowPlanner(true)}
                className="w-full md:w-auto px-16 py-8 bg-zinc-100 text-black text-2xl font-black uppercase tracking-widest rounded-[2rem] border-4 border-black hover:bg-black hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(249,115,22,1)] hover:shadow-none focus:translate-x-1 focus:translate-y-1"
              >
                Create Your Own
              </button>
            </div>
            <p className="mt-12 text-zinc-400 font-bold uppercase tracking-widest text-sm">Experience {destination.name} like never before</p>
          </div>
        </section>

        {showPlanner && (
          <section className="pb-32">
            <div className="bg-white border-4 border-black p-12 rounded-[3.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter">Your Trip Planner</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <div className="mb-10">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Trip Duration (Days)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="14"
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                      className="w-full p-6 bg-zinc-50 border-4 border-black rounded-2xl font-black text-2xl outline-none focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Select Places to Visit</label>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {destination.sights.map((sight) => (
                        <label 
                          key={sight.name} 
                          className={`flex items-center gap-4 p-5 border-4 rounded-2xl cursor-pointer transition-all ${
                            selectedPlaces.includes(sight.name) 
                              ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]" 
                              : "border-zinc-100 bg-zinc-50 hover:border-black"
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedPlaces.includes(sight.name)}
                            onChange={() => handleTogglePlace(sight.name)}
                          />
                          <span className="text-lg font-bold">{sight.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateItinerary}
                    className="w-full mt-12 py-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                  >
                    Generate Trip Plan
                  </button>
                </div>

                <div className="bg-zinc-50 rounded-[2.5rem] p-10 border-4 border-black overflow-hidden relative">
                  <h3 className="text-2xl font-black uppercase mb-8 border-b-4 border-black inline-block pb-2">Your Itinerary</h3>
                  
                  {itinerary.length > 0 ? (
                    <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4">
                      {itinerary.map((item) => (
                        <div key={item.day} className="relative pl-10 border-l-4 border-black">
                          <div className="absolute -left-[14px] top-0 w-6 h-6 bg-black rounded-full border-4 border-white" />
                          <h4 className="text-xl font-black uppercase mb-4">Day {item.day}</h4>
                          <div className="space-y-4">
                            {item.places.map((place, idx) => (
                              <div key={idx} className="bg-white p-4 border-2 border-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {place}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-12 pt-8 border-t-4 border-black">
                        {saved ? (
                          <div className="bg-green-500 text-white p-6 rounded-2xl border-4 border-black font-black uppercase tracking-widest text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                            ✓ Itinerary saved!
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSaved(true)}
                            className="w-full py-6 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                          >
                            Save Itinerary
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-10 opacity-30 select-none">
                      <p className="font-black uppercase tracking-widest">Select places and click generate to see your plan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};


export default DestinationPage;


