export interface Sight {
  name: string;
  lat: number;
  lng: number;
}

export interface Hotel {
  name: string;
  price: string;
}

export interface Transport {
  airport?: string;
  trainStation?: string;
  majorBusterminal?: string;
}

export interface DestinationDetail {
  name: string;
  heroImage: string;
  sights: Sight[];
  hotels: Hotel[];
  transport: Transport;
}

export const destinationDetails: Record<string, DestinationDetail> = {
  goa: {
    name: "Goa",
    heroImage: "/images/goa.jpg",
    sights: [
      { name: "Baga Beach", lat: 15.5553, lng: 73.7517 },
      { name: "Fort Aguada", lat: 15.4989, lng: 73.7730 },
      { name: "Dudhsagar Falls", lat: 15.3144, lng: 74.3145 }
    ],
    hotels: [
      { name: "Taj Exotica", price: "₹15,000" },
      { name: "W Goa", price: "₹18,000" },
      { name: "Alila Diwa", price: "₹12,000" }
    ],
    transport: {
      airport: "Dabolim Airport (GOI)",
      trainStation: "Madgaon Junction"
    }
  },
  mumbai: {
    name: "Mumbai",
    heroImage: "/images/mumbai.jpg",
    sights: [
      { name: "Gateway of India", lat: 18.9220, lng: 72.8347 },
      { name: "Marine Drive", lat: 18.9440, lng: 72.8238 },
      { name: "Elephanta Caves", lat: 18.9633, lng: 72.9315 }
    ],
    hotels: [
      { name: "Taj Mahal Palace", price: "₹22,000" },
      { name: "Trident Nariman Point", price: "₹14,000" },
      { name: "JW Marriott Juhu", price: "₹16,000" }
    ],
    transport: {
      airport: "Chhatrapati Shivaji Maharaj International (BOM)",
      trainStation: "Chhatrapati Shivaji Maharaj Terminus (CSMT)"
    }
  },
  manali: {
    name: "Manali",
    heroImage: "/images/manali.jpg",
    sights: [
      { name: "Hadimba Devi Temple", lat: 32.2483, lng: 77.1802 },
      { name: "Solang Valley", lat: 32.3166, lng: 77.1583 },
      { name: "Rohtang Pass", lat: 32.3716, lng: 77.2466 }
    ],
    hotels: [
      { name: "Span Resort & Spa", price: "₹12,000" },
      { name: "Manu Allaya", price: "₹8,000" },
      { name: "The Himalayan", price: "₹10,500" }
    ],
    transport: {
      airport: "Kullu-Manali Airport (KUU)",
      majorBusterminal: "Manali Inter State Bus Terminus"
    }
  },
  kerala: {
    name: "Kerala",
    heroImage: "/images/kerala.jpg",
    sights: [
      { name: "Alleppey Backwaters", lat: 9.4981, lng: 76.3388 },
      { name: "Munnar Tea Gardens", lat: 10.0889, lng: 77.0595 },
      { name: "Wayanad Wildlife Sanctuary", lat: 11.6914, lng: 76.2570 }
    ],
    hotels: [
      { name: "Kumarakom Lake Resort", price: "₹20,000" },
      { name: "The Leela Kovalam", price: "₹18,500" },
      { name: "Fragrant Nature Munnar", price: "₹9,000" }
    ],
    transport: {
      airport: "Cochin International (COK)",
      trainStation: "Ernakulam Junction"
    }
  },
  jaipur: {
    name: "Jaipur",
    heroImage: "/images/jaipur.jpg",
    sights: [
      { name: "Amer Fort", lat: 26.9855, lng: 75.8513 },
      { name: "Hawa Mahal", lat: 26.9239, lng: 75.8267 },
      { name: "City Palace", lat: 26.9258, lng: 75.8237 }
    ],
    hotels: [
      { name: "Rambagh Palace", price: "₹45,000" },
      { name: "ITC Rajputana", price: "₹11,000" },
      { name: "Fairmont Jaipur", price: "₹15,000" }
    ],
    transport: {
      airport: "Jaipur International (JAI)",
      trainStation: "Jaipur Junction"
    }
  },
  ladakh: {
    name: "Ladakh",
    heroImage: "/images/ladakh.jpg",
    sights: [
      { name: "Pangong Lake", lat: 33.7595, lng: 78.6674 },
      { name: "Nubra Valley", lat: 34.6863, lng: 77.5673 },
      { name: "Shanti Stupa", lat: 34.1727, lng: 77.5779 }
    ],
    hotels: [
      { name: "The Grand Dragon Ladakh", price: "₹12,000" },
      { name: "Hotel Zen Ladakh", price: "₹7,000" },
      { name: "LRE Ladakh Resort", price: "₹5,500" }
    ],
    transport: {
      airport: "Kushok Bakula Rimpochee Airport (IXL)",
      majorBusterminal: "Leh Bus Stand"
    }
  }
};
