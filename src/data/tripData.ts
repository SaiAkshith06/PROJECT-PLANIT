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
}

export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
}

export interface DestinationData {
  name: string;
  coords: [number, number];
  hotels: Hotel[];
  transport: TransportOption[];
  attractions: Attraction[];
  nearbyMarkers: { pos: [number, number]; name: string }[];
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
      { name: "Baga Beach", type: "Beach", rating: 4.5, entryFee: 0 },
      { name: "Fort Aguada", type: "Heritage", rating: 4.3, entryFee: 25 },
      { name: "Dudhsagar Falls", type: "Nature", rating: 4.7, entryFee: 400 },
      { name: "Basilica of Bom Jesus", type: "Church", rating: 4.6, entryFee: 0 },
    ],
    nearbyMarkers: [
      { pos: [15.5553, 73.7577], name: "Baga Beach" },
      { pos: [15.4909, 73.7736], name: "Fort Aguada" },
      { pos: [15.3144, 74.3143], name: "Dudhsagar Falls" },
      { pos: [15.5009, 73.9116], name: "Basilica of Bom Jesus" },
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
      { name: "Rohtang Pass", type: "Mountain Pass", rating: 4.8, entryFee: 550 },
      { name: "Solang Valley", type: "Adventure", rating: 4.6, entryFee: 0 },
      { name: "Hadimba Temple", type: "Temple", rating: 4.5, entryFee: 0 },
      { name: "Old Manali", type: "Town", rating: 4.4, entryFee: 0 },
    ],
    nearbyMarkers: [
      { pos: [32.3725, 77.2478], name: "Rohtang Pass" },
      { pos: [32.3166, 77.1575], name: "Solang Valley" },
      { pos: [32.2433, 77.1685], name: "Hadimba Temple" },
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
      { name: "Alleppey Backwaters", type: "Backwaters", rating: 4.9, entryFee: 0 },
      { name: "Munnar Tea Gardens", type: "Nature", rating: 4.7, entryFee: 0 },
      { name: "Periyar Wildlife Sanctuary", type: "Wildlife", rating: 4.6, entryFee: 350 },
    ],
    nearbyMarkers: [
      { pos: [9.4981, 76.3388], name: "Alleppey Backwaters" },
      { pos: [10.0889, 77.0595], name: "Munnar" },
      { pos: [9.4672, 77.2356], name: "Periyar Sanctuary" },
    ],
  },
  bali: {
    name: "Bali",
    coords: [-8.3405, 115.092],
    hotels: [
      { name: "Four Seasons Bali", rating: 4.9, pricePerNight: 25000, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400", amenities: ["Infinity Pool", "Spa", "Private Villa"] },
      { name: "Hanging Gardens of Bali", rating: 4.8, pricePerNight: 18000, image: "https://images.unsplash.com/photo-1559599238-308793637427?w=400", amenities: ["Jungle View", "Pool", "Restaurant"] },
      { name: "Ubud Village Resort", rating: 4.5, pricePerNight: 8500, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400", amenities: ["Rice Terrace View", "Yoga"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "AirAsia", price: 15000, duration: "6h" },
      { mode: "✈️ Flight", provider: "Singapore Airlines", price: 28000, duration: "5h 30m" },
    ],
    attractions: [
      { name: "Tanah Lot Temple", type: "Temple", rating: 4.7, entryFee: 600 },
      { name: "Ubud Monkey Forest", type: "Nature", rating: 4.5, entryFee: 500 },
      { name: "Tegallalang Rice Terraces", type: "Nature", rating: 4.8, entryFee: 200 },
    ],
    nearbyMarkers: [
      { pos: [-8.6215, 115.0868], name: "Tanah Lot" },
      { pos: [-8.5069, 115.2624], name: "Monkey Forest" },
      { pos: [-8.4312, 115.2795], name: "Rice Terraces" },
    ],
  },
  paris: {
    name: "Paris",
    coords: [48.8566, 2.3522],
    hotels: [
      { name: "Le Meurice", rating: 4.9, pricePerNight: 45000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400", amenities: ["Luxury", "Spa", "Michelin Restaurant"] },
      { name: "Hôtel Plaza Athénée", rating: 4.8, pricePerNight: 38000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", amenities: ["Eiffel View", "Spa", "Bar"] },
      { name: "Ibis Paris Montmartre", rating: 4.0, pricePerNight: 8000, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400", amenities: ["WiFi", "Central Location"] },
    ],
    transport: [
      { mode: "✈️ Flight", provider: "Air France", price: 42000, duration: "8h 30m" },
      { mode: "✈️ Flight", provider: "Emirates", price: 55000, duration: "10h (via Dubai)" },
    ],
    attractions: [
      { name: "Eiffel Tower", type: "Landmark", rating: 4.9, entryFee: 2200 },
      { name: "Louvre Museum", type: "Museum", rating: 4.8, entryFee: 1500 },
      { name: "Notre-Dame Cathedral", type: "Cathedral", rating: 4.7, entryFee: 0 },
      { name: "Champs-Élysées", type: "Boulevard", rating: 4.6, entryFee: 0 },
    ],
    nearbyMarkers: [
      { pos: [48.8584, 2.2945], name: "Eiffel Tower" },
      { pos: [48.8606, 2.3376], name: "Louvre Museum" },
      { pos: [48.853, 2.3499], name: "Notre-Dame" },
    ],
  },
};

export function getDestinationData(dest: string): DestinationData {
  const key = dest.toLowerCase().trim();
  return destinationDatabase[key] || destinationDatabase.goa;
}

export function generateItinerary(dest: DestinationData, numDays: number): DayPlan[] {
  const plans: DayPlan[] = [];
  const allActivities = [
    `Arrive in ${dest.name} and check into hotel`,
    ...dest.attractions.map(a => `Visit ${a.name} (${a.type})`),
    `Explore local markets and cuisine in ${dest.name}`,
    `Relax at the hotel — use spa or pool amenities`,
    `Take a guided walking tour of ${dest.name}`,
    `Try local street food and café hopping`,
    `Visit nearby viewpoints and scenic spots`,
    `Shopping for souvenirs`,
    `Checkout and departure from ${dest.name}`,
  ];

  for (let d = 1; d <= numDays; d++) {
    const dayActivities: string[] = [];
    if (d === 1) {
      dayActivities.push(allActivities[0]);
      if (allActivities[1]) dayActivities.push(allActivities[1]);
      dayActivities.push("Dinner at a popular local restaurant");
    } else if (d === numDays) {
      dayActivities.push("Pack and checkout");
      dayActivities.push(allActivities[allActivities.length - 1]);
    } else {
      const idx = Math.min(d, allActivities.length - 2);
      dayActivities.push(allActivities[idx] || `Explore ${dest.name}`);
      dayActivities.push(allActivities[idx + 1] || "Free time to explore");
      dayActivities.push("Lunch at a local spot");
    }

    plans.push({
      day: d,
      title: d === 1 ? "Arrival Day" : d === numDays ? "Departure Day" : `Day ${d} — Explore`,
      activities: dayActivities,
    });
  }
  return plans;
}
