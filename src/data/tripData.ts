export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
}

export interface TransportOption {
  mode: string;
  provider: string;
  price: number;
  duration: string;
}

export interface Attraction {
  name: string;
  type: string;
  rating: number;
  entryFee: number;
  coords: [number, number];
  description: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  locations: { pos: [number, number]; name: string; description: string }[];
}

export interface DestinationData {
  name: string;
  coords: [number, number];
  hotels: Hotel[];
  transport: TransportOption[];
  attractions: Attraction[];
  nearbyMarkers: { pos: [number, number]; name: string; description: string }[];
}

export const destinationDatabase: Record<string, DestinationData> = {
  goa: {
    name: "Goa",
    coords: [15.2993, 74.124],
    hotels: [
      { name: "Taj Exotica Resort", rating: 4.8, pricePerNight: 8500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Pool", "Spa", "Beach Access"] },
      { name: "Alila Diwa Goa", rating: 4.6, pricePerNight: 6200, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Pool", "Restaurant", "WiFi"] },
      { name: "Goa Marriott Resort", rating: 4.5, pricePerNight: 5800, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["Gym", "Pool", "Bar"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "IndiGo", price: 4500, duration: "2h 15m" },
      { mode: "🚆 Train", provider: "Konkan Railway", price: 1200, duration: "12h" },
      { mode: "🚌 Bus", provider: "RedBus", price: 800, duration: "14h" },
      { mode: "🚗 Rental Car", provider: "Zoomcar", price: 2500, duration: "10h" },
    ],
    attractions: [
      { name: "Baga Beach", type: "Beach", rating: 4.5, entryFee: 0, coords: [15.5553, 73.7577], description: "Famous beach known for nightlife, water sports, and shacks." },
      { name: "Fort Aguada", type: "Heritage", rating: 4.3, entryFee: 25, coords: [15.4909, 73.7736], description: "17th-century Portuguese fort with a lighthouse and ocean views." },
      { name: "Dudhsagar Falls", type: "Nature", rating: 4.7, entryFee: 400, coords: [15.3144, 74.3143], description: "One of India's tallest waterfalls, nestled in lush forest." },
      { name: "Basilica of Bom Jesus", type: "Church", rating: 4.6, entryFee: 0, coords: [15.5009, 73.9116], description: "UNESCO World Heritage Site housing the remains of St. Francis Xavier." },
    ],
    nearbyMarkers: [
      { pos: [15.5553, 73.7577], name: "Baga Beach", description: "Famous beach known for nightlife and water sports." },
      { pos: [15.4909, 73.7736], name: "Fort Aguada", description: "17th-century Portuguese fort with lighthouse." },
      { pos: [15.3144, 74.3143], name: "Dudhsagar Falls", description: "One of India's tallest waterfalls." },
      { pos: [15.5009, 73.9116], name: "Basilica of Bom Jesus", description: "UNESCO World Heritage church." },
    ],
  },
  manali: {
    name: "Manali",
    coords: [32.2396, 77.1887],
    hotels: [
      { name: "The Himalayan", rating: 4.7, pricePerNight: 7200, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400", amenities: ["Mountain View", "Spa", "Fireplace"] },
      { name: "Solang Valley Resort", rating: 4.4, pricePerNight: 4500, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400", amenities: ["Valley View", "Restaurant"] },
      { name: "Snow Valley Resorts", rating: 4.3, pricePerNight: 3800, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400", amenities: ["Heating", "WiFi", "Parking"] },
    ],
    transport: [
      { mode: "✈️ Flight + Cab", provider: "Via Kullu Airport", price: 6500, duration: "3h + 1h" },
      { mode: "🚌 Volvo Bus", provider: "HRTC", price: 1400, duration: "14h" },
      { mode: "🚗 Rental Car", provider: "Savaari", price: 3500, duration: "12h" },
    ],
    attractions: [
      { name: "Rohtang Pass", type: "Mountain Pass", rating: 4.8, entryFee: 550, coords: [32.3725, 77.2478], description: "High-altitude pass with stunning snow-capped views." },
      { name: "Solang Valley", type: "Adventure", rating: 4.6, entryFee: 0, coords: [32.3166, 77.1575], description: "Adventure hub for paragliding, zorbing, and skiing." },
      { name: "Hadimba Temple", type: "Temple", rating: 4.5, entryFee: 0, coords: [32.2433, 77.1685], description: "Ancient cave temple surrounded by cedar forest." },
      { name: "Old Manali", type: "Town", rating: 4.4, entryFee: 0, coords: [32.2590, 77.1890], description: "Charming village with cafés, shops, and backpacker culture." },
    ],
    nearbyMarkers: [
      { pos: [32.3725, 77.2478], name: "Rohtang Pass", description: "High-altitude pass with snow-capped views." },
      { pos: [32.3166, 77.1575], name: "Solang Valley", description: "Adventure hub for paragliding and skiing." },
      { pos: [32.2433, 77.1685], name: "Hadimba Temple", description: "Ancient cave temple in cedar forest." },
    ],
  },
  kerala: {
    name: "Kerala",
    coords: [10.8505, 76.2711],
    hotels: [
      { name: "Kumarakom Lake Resort", rating: 4.9, pricePerNight: 12000, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400", amenities: ["Lake View", "Ayurveda Spa", "Pool"] },
      { name: "Brunton Boatyard", rating: 4.7, pricePerNight: 9500, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", amenities: ["Heritage", "Pool", "Restaurant"] },
      { name: "Coconut Lagoon", rating: 4.5, pricePerNight: 7800, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400", amenities: ["Backwaters", "Boat Rides"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "Air India", price: 5200, duration: "2h 40m" },
      { mode: "🚆 Train", provider: "Kerala Express", price: 1800, duration: "24h" },
      { mode: "🚌 Bus", provider: "KSRTC", price: 1500, duration: "20h" },
    ],
    attractions: [
      { name: "Alleppey Backwaters", type: "Backwaters", rating: 4.9, entryFee: 0, coords: [9.4981, 76.3388], description: "Serene houseboat cruises through palm-lined backwaters." },
      { name: "Munnar Tea Gardens", type: "Nature", rating: 4.7, entryFee: 0, coords: [10.0889, 77.0595], description: "Rolling hills carpeted with lush green tea plantations." },
      { name: "Periyar Wildlife Sanctuary", type: "Wildlife", rating: 4.6, entryFee: 350, coords: [9.4672, 77.2356], description: "Tiger reserve with boat rides and nature walks." },
    ],
    nearbyMarkers: [
      { pos: [9.4981, 76.3388], name: "Alleppey Backwaters", description: "Houseboat cruises through palm-lined canals." },
      { pos: [10.0889, 77.0595], name: "Munnar", description: "Rolling hills with lush tea plantations." },
      { pos: [9.4672, 77.2356], name: "Periyar Sanctuary", description: "Tiger reserve with boat rides." },
    ],
  },
  delhi: {
    name: "Delhi",
    coords: [28.6139, 77.209],
    hotels: [
      { name: "The Imperial", rating: 4.8, pricePerNight: 15000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Heritage", "Spa", "Pool"] },
      { name: "The Oberoi", rating: 4.9, pricePerNight: 22000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Luxury", "Restaurant", "Bar"] },
      { name: "Zostel Delhi", rating: 4.2, pricePerNight: 800, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["WiFi", "Common Area", "Budget"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "IndiGo", price: 3500, duration: "2h" },
      { mode: "🚆 Train", provider: "Rajdhani Express", price: 2200, duration: "16h" },
      { mode: "🚌 Bus", provider: "RedBus", price: 1000, duration: "18h" },
    ],
    attractions: [
      { name: "Red Fort", type: "Heritage", rating: 4.7, entryFee: 35, coords: [28.6562, 77.241], description: "Iconic Mughal-era fort and UNESCO World Heritage Site." },
      { name: "Qutub Minar", type: "Monument", rating: 4.6, entryFee: 30, coords: [28.5245, 77.1855], description: "73-metre tall minaret, the tallest brick minaret in the world." },
      { name: "India Gate", type: "Landmark", rating: 4.5, entryFee: 0, coords: [28.6129, 77.2295], description: "War memorial and iconic landmark of New Delhi." },
      { name: "Humayun's Tomb", type: "Heritage", rating: 4.8, entryFee: 35, coords: [28.5933, 77.2507], description: "Stunning Mughal garden tomb, precursor to the Taj Mahal." },
    ],
    nearbyMarkers: [
      { pos: [28.6562, 77.241], name: "Red Fort", description: "Iconic Mughal-era fort." },
      { pos: [28.5245, 77.1855], name: "Qutub Minar", description: "World's tallest brick minaret." },
      { pos: [28.6129, 77.2295], name: "India Gate", description: "Iconic war memorial." },
      { pos: [28.5933, 77.2507], name: "Humayun's Tomb", description: "Stunning Mughal garden tomb." },
    ],
  },
  mumbai: {
    name: "Mumbai",
    coords: [19.076, 72.8777],
    hotels: [
      { name: "Taj Mahal Palace", rating: 4.9, pricePerNight: 20000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Heritage", "Sea View", "Pool"] },
      { name: "The Oberoi Mumbai", rating: 4.8, pricePerNight: 18000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Ocean View", "Spa", "Restaurant"] },
      { name: "FabHotel Prime", rating: 4.0, pricePerNight: 2500, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["WiFi", "AC", "Budget"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "Air India", price: 4000, duration: "2h" },
      { mode: "🚆 Train", provider: "Duronto Express", price: 1500, duration: "16h" },
      { mode: "🚌 Bus", provider: "VRL Travels", price: 900, duration: "12h" },
    ],
    attractions: [
      { name: "Gateway of India", type: "Landmark", rating: 4.7, entryFee: 0, coords: [18.9220, 72.8347], description: "Iconic arch monument overlooking the Arabian Sea." },
      { name: "Marine Drive", type: "Promenade", rating: 4.6, entryFee: 0, coords: [18.9432, 72.8235], description: "Queen's Necklace — a stunning curved seafront promenade." },
      { name: "Elephanta Caves", type: "Heritage", rating: 4.5, entryFee: 40, coords: [18.9633, 72.9315], description: "Ancient rock-cut cave temples on an island." },
    ],
    nearbyMarkers: [
      { pos: [18.9220, 72.8347], name: "Gateway of India", description: "Iconic arch monument by the sea." },
      { pos: [18.9432, 72.8235], name: "Marine Drive", description: "Stunning curved seafront promenade." },
      { pos: [18.9633, 72.9315], name: "Elephanta Caves", description: "Ancient rock-cut cave temples." },
    ],
  },
  agra: {
    name: "Agra",
    coords: [27.1767, 78.0081],
    hotels: [
      { name: "The Oberoi Amarvilas", rating: 4.9, pricePerNight: 30000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Taj View", "Spa", "Pool"] },
      { name: "ITC Mughal", rating: 4.7, pricePerNight: 12000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Mughal Gardens", "Pool", "Restaurant"] },
      { name: "Hotel Atulyaa Taj", rating: 4.3, pricePerNight: 3500, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["Taj View", "WiFi", "Restaurant"] },
    ],
    transport: [
      { mode: "🚆 Train", provider: "Gatimaan Express", price: 750, duration: "1h 40m" },
      { mode: "🚗 Rental Car", provider: "Savaari", price: 2500, duration: "3h 30m" },
      { mode: "🚌 Bus", provider: "UPSRTC", price: 400, duration: "5h" },
    ],
    attractions: [
      { name: "Taj Mahal", type: "Wonder", rating: 5.0, entryFee: 50, coords: [27.1751, 78.0421], description: "One of the Seven Wonders of the World, a symbol of love." },
      { name: "Agra Fort", type: "Heritage", rating: 4.7, entryFee: 40, coords: [27.1795, 78.0211], description: "Massive red sandstone fort with palatial chambers." },
      { name: "Fatehpur Sikri", type: "Heritage", rating: 4.6, entryFee: 40, coords: [27.0945, 77.6679], description: "Abandoned Mughal city with stunning architecture." },
    ],
    nearbyMarkers: [
      { pos: [27.1751, 78.0421], name: "Taj Mahal", description: "One of the Seven Wonders of the World." },
      { pos: [27.1795, 78.0211], name: "Agra Fort", description: "Massive red sandstone Mughal fort." },
      { pos: [27.0945, 77.6679], name: "Fatehpur Sikri", description: "Abandoned Mughal city." },
    ],
  },
  jaipur: {
    name: "Jaipur",
    coords: [26.9124, 75.7873],
    hotels: [
      { name: "Rambagh Palace", rating: 4.9, pricePerNight: 25000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Palace", "Spa", "Pool"] },
      { name: "ITC Rajputana", rating: 4.6, pricePerNight: 8000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Pool", "Restaurant", "Gym"] },
      { name: "Zostel Jaipur", rating: 4.2, pricePerNight: 700, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["WiFi", "Common Area", "Budget"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "IndiGo", price: 3800, duration: "1h 45m" },
      { mode: "🚆 Train", provider: "Shatabdi Express", price: 900, duration: "4h 30m" },
      { mode: "🚌 Bus", provider: "RSRTC", price: 600, duration: "6h" },
    ],
    attractions: [
      { name: "Hawa Mahal", type: "Palace", rating: 4.7, entryFee: 50, coords: [26.9239, 75.8267], description: "Palace of Winds with 953 honeycomb windows." },
      { name: "Amber Fort", type: "Fort", rating: 4.8, entryFee: 100, coords: [26.9855, 75.8513], description: "Majestic hilltop fort with elephant rides." },
      { name: "City Palace", type: "Palace", rating: 4.6, entryFee: 200, coords: [26.9258, 75.8237], description: "Royal palace complex blending Mughal and Rajasthani architecture." },
      { name: "Jantar Mantar", type: "Observatory", rating: 4.5, entryFee: 50, coords: [26.9247, 75.8245], description: "UNESCO-listed astronomical observation site." },
    ],
    nearbyMarkers: [
      { pos: [26.9239, 75.8267], name: "Hawa Mahal", description: "Palace of Winds with 953 windows." },
      { pos: [26.9855, 75.8513], name: "Amber Fort", description: "Majestic hilltop fort." },
      { pos: [26.9258, 75.8237], name: "City Palace", description: "Royal palace complex." },
      { pos: [26.9247, 75.8245], name: "Jantar Mantar", description: "Astronomical observation site." },
    ],
  },
};

// Keep Bali and Paris as hidden aliases that redirect to Goa (India-only focus)
export function getDestinationData(dest: string): DestinationData {
  const key = dest.toLowerCase().trim();
  return destinationDatabase[key] || destinationDatabase.goa;
}

export function generateItinerary(dest: DestinationData, numDays: number): DayPlan[] {
  const plans: DayPlan[] = [];
  const attractions = dest.attractions;

  for (let d = 1; d <= numDays; d++) {
    const dayActivities: string[] = [];
    const dayLocations: { pos: [number, number]; name: string; description: string }[] = [];

    if (d === 1) {
      dayActivities.push(`Arrive in ${dest.name} and check into hotel`);
      dayLocations.push({ pos: dest.coords, name: dest.name, description: `Starting point — ${dest.name}` });
      if (attractions[0]) {
        dayActivities.push(`Visit ${attractions[0].name} (${attractions[0].type})`);
        dayLocations.push({ pos: attractions[0].coords, name: attractions[0].name, description: attractions[0].description });
      }
      dayActivities.push("Dinner at a popular local restaurant");
    } else if (d === numDays) {
      dayActivities.push("Pack and checkout");
      dayActivities.push(`Departure from ${dest.name}`);
      dayLocations.push({ pos: dest.coords, name: dest.name, description: `Departure — ${dest.name}` });
    } else {
      const attrIdx = Math.min(d - 1, attractions.length - 1);
      const attr = attractions[attrIdx];
      if (attr) {
        dayActivities.push(`Visit ${attr.name} (${attr.type})`);
        dayLocations.push({ pos: attr.coords, name: attr.name, description: attr.description });
      }
      const nextAttr = attractions[Math.min(attrIdx + 1, attractions.length - 1)];
      if (nextAttr && nextAttr !== attr) {
        dayActivities.push(`Explore ${nextAttr.name}`);
        dayLocations.push({ pos: nextAttr.coords, name: nextAttr.name, description: nextAttr.description });
      }
      dayActivities.push("Lunch at a local spot");
    }

    plans.push({
      day: d,
      title: d === 1 ? "Arrival Day" : d === numDays ? "Departure Day" : `Day ${d} — Explore`,
      activities: dayActivities,
      locations: dayLocations,
    });
  }
  return plans;
}
