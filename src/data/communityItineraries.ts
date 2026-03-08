import type { Attraction } from "@/data/tripData";

export interface CustomItinerary {
  id: string;
  name: string;
  destination: string;
  startPoint: string;
  endPoint: string;
  stops: { name: string; coords: [number, number]; description: string }[];
  createdAt: string;
  author: string;
}

export interface CommunityItinerary extends CustomItinerary {
  likes: number;
  avatar: string;
}

// Mock community itineraries per destination
export const communityItineraries: Record<string, CommunityItinerary[]> = {
  goa: [
    {
      id: "c1",
      name: "Beach Hopper's Paradise",
      destination: "Goa",
      startPoint: "Baga Beach",
      endPoint: "Basilica of Bom Jesus",
      stops: [
        { name: "Baga Beach", coords: [15.5553, 73.7577], description: "Start at the famous Baga Beach." },
        { name: "Fort Aguada", coords: [15.4909, 73.7736], description: "Explore the historic fort." },
        { name: "Basilica of Bom Jesus", coords: [15.5009, 73.9116], description: "End at the UNESCO heritage church." },
      ],
      createdAt: "2026-02-15",
      author: "Priya S.",
      likes: 42,
      avatar: "PS",
    },
    {
      id: "c2",
      name: "Nature & Heritage Walk",
      destination: "Goa",
      startPoint: "Dudhsagar Falls",
      endPoint: "Fort Aguada",
      stops: [
        { name: "Dudhsagar Falls", coords: [15.3144, 74.3143], description: "Marvel at the towering waterfall." },
        { name: "Basilica of Bom Jesus", coords: [15.5009, 73.9116], description: "Visit the heritage church." },
        { name: "Fort Aguada", coords: [15.4909, 73.7736], description: "Sunset at the fort." },
      ],
      createdAt: "2026-01-20",
      author: "Rahul M.",
      likes: 28,
      avatar: "RM",
    },
  ],
  manali: [
    {
      id: "c3",
      name: "Adventure Seeker's Route",
      destination: "Manali",
      startPoint: "Solang Valley",
      endPoint: "Rohtang Pass",
      stops: [
        { name: "Solang Valley", coords: [32.3166, 77.1575], description: "Paragliding and adventure sports." },
        { name: "Hadimba Temple", coords: [32.2433, 77.1685], description: "Visit the ancient temple." },
        { name: "Rohtang Pass", coords: [32.3725, 77.2478], description: "Snow-capped mountain pass." },
      ],
      createdAt: "2026-02-28",
      author: "Ankit K.",
      likes: 35,
      avatar: "AK",
    },
  ],
  kerala: [
    {
      id: "c4",
      name: "Backwater Bliss",
      destination: "Kerala",
      startPoint: "Alleppey Backwaters",
      endPoint: "Periyar Sanctuary",
      stops: [
        { name: "Alleppey Backwaters", coords: [9.4981, 76.3388], description: "Houseboat cruise." },
        { name: "Munnar", coords: [10.0889, 77.0595], description: "Tea garden exploration." },
        { name: "Periyar Sanctuary", coords: [9.4672, 77.2356], description: "Wildlife boat ride." },
      ],
      createdAt: "2026-03-01",
      author: "Deepa R.",
      likes: 51,
      avatar: "DR",
    },
  ],
  delhi: [
    {
      id: "c5",
      name: "Mughal Trail",
      destination: "Delhi",
      startPoint: "Red Fort",
      endPoint: "India Gate",
      stops: [
        { name: "Red Fort", coords: [28.6562, 77.241], description: "Start at the iconic fort." },
        { name: "Humayun's Tomb", coords: [28.5933, 77.2507], description: "Beautiful Mughal tomb." },
        { name: "Qutub Minar", coords: [28.5245, 77.1855], description: "The tallest brick minaret." },
        { name: "India Gate", coords: [28.6129, 77.2295], description: "End at the war memorial." },
      ],
      createdAt: "2026-02-10",
      author: "Vikram J.",
      likes: 63,
      avatar: "VJ",
    },
  ],
  agra: [
    {
      id: "c6",
      name: "Wonder of the World Tour",
      destination: "Agra",
      startPoint: "Taj Mahal",
      endPoint: "Fatehpur Sikri",
      stops: [
        { name: "Taj Mahal", coords: [27.1751, 78.0421], description: "Sunrise at the Taj." },
        { name: "Agra Fort", coords: [27.1795, 78.0211], description: "Explore the massive fort." },
        { name: "Fatehpur Sikri", coords: [27.0945, 77.6679], description: "Abandoned Mughal city." },
      ],
      createdAt: "2026-01-05",
      author: "Sneha T.",
      likes: 78,
      avatar: "ST",
    },
    {
      id: "c7",
      name: "Quick Heritage Walk",
      destination: "Agra",
      startPoint: "Agra Fort",
      endPoint: "Taj Mahal",
      stops: [
        { name: "Agra Fort", coords: [27.1795, 78.0211], description: "Start with the fort." },
        { name: "Taj Mahal", coords: [27.1751, 78.0421], description: "End with sunset at Taj." },
      ],
      createdAt: "2026-02-22",
      author: "Arun P.",
      likes: 34,
      avatar: "AP",
    },
  ],
  mumbai: [
    {
      id: "c8",
      name: "Mumbai Highlights",
      destination: "Mumbai",
      startPoint: "Gateway of India",
      endPoint: "Marine Drive",
      stops: [
        { name: "Gateway of India", coords: [18.9220, 72.8347], description: "Iconic arch monument." },
        { name: "Elephanta Caves", coords: [18.9633, 72.9315], description: "Ancient cave temples." },
        { name: "Marine Drive", coords: [18.9432, 72.8235], description: "Evening at Queen's Necklace." },
      ],
      createdAt: "2026-03-05",
      author: "Meera D.",
      likes: 45,
      avatar: "MD",
    },
  ],
  jaipur: [
    {
      id: "c9",
      name: "Royal Rajasthan Circuit",
      destination: "Jaipur",
      startPoint: "Amber Fort",
      endPoint: "Hawa Mahal",
      stops: [
        { name: "Amber Fort", coords: [26.9855, 75.8513], description: "Majestic hilltop fort." },
        { name: "City Palace", coords: [26.9258, 75.8237], description: "Royal palace complex." },
        { name: "Jantar Mantar", coords: [26.9247, 75.8245], description: "Astronomical observation site." },
        { name: "Hawa Mahal", coords: [26.9239, 75.8267], description: "Palace of Winds." },
      ],
      createdAt: "2026-02-18",
      author: "Kavya N.",
      likes: 56,
      avatar: "KN",
    },
  ],
};

export function getCommunityItineraries(dest: string): CommunityItinerary[] {
  return communityItineraries[dest.toLowerCase().trim()] || [];
}

export function saveCustomItinerary(itinerary: CustomItinerary): void {
  const stored = getMyItineraries();
  stored.push(itinerary);
  localStorage.setItem("planit-custom-itineraries", JSON.stringify(stored));
}

export function getMyItineraries(): CustomItinerary[] {
  try {
    const data = localStorage.getItem("planit-custom-itineraries");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteCustomItinerary(id: string): void {
  const stored = getMyItineraries().filter((it) => it.id !== id);
  localStorage.setItem("planit-custom-itineraries", JSON.stringify(stored));
}
