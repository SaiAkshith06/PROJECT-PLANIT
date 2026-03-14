export interface DestinationPlace {
  name: string;
  location: string;
  image: string;
}

export interface DestinationActivity {
  icon: string;
  title: string;
  desc: string;
}

export interface DestinationHighlight {
  icon: string;
  title: string;
  desc: string;
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  heroImage: string;
  experienceImages: string[];
  description: [string, string];
  highlights: DestinationHighlight[];
  places: DestinationPlace[];
  activities: DestinationActivity[];
}

export const destinations: Record<string, Destination> = {
  goa: {
    slug: "goa",
    name: "Goa",
    region: "India · Tropical Paradise",
    tagline: "Sun, Sand & Serenity",
    heroImage: "/images/goa/hero.png",
    experienceImages: [
      "/images/goa/baga-beach.png",
      "/images/goa/anjuna-beach.png",
      "/images/goa/dudhsagar-falls.png",
      "/images/goa/fort-aguada.png"
    ],
    description: [
      "Goa is India's smallest state but its biggest destination for unforgettable experiences. From the sun-kissed beaches of North Goa to the tranquil shores of the south, every corner tells a story of culture, colour, and coastal beauty.",
      "Wander through centuries-old Portuguese churches, dance till dawn at legendary beach parties, feast on fiery vindaloo and fresh king prawns, or simply let the Arabian Sea soundtrack your most peaceful afternoon. Goa isn't just a place — it's a feeling.",
    ],
    highlights: [
      { icon: "🏖️", title: "Pristine Beaches", desc: "Miles of golden coastline" },
      { icon: "🎶", title: "Vibrant Nightlife", desc: "World-class clubs & bars" },
      { icon: "⛪", title: "Portuguese Heritage", desc: "Churches & colonial charm" },
      { icon: "🦐", title: "Goan Seafood", desc: "Fresh catch daily" },
    ],
    places: [
      { name: "Baga Beach", location: "North Goa", image: "/images/goa/baga-beach.png" },
      { name: "Anjuna Beach", location: "North Goa", image: "/images/goa/anjuna-beach.png" },
      { name: "Dudhsagar Falls", location: "East Goa", image: "/images/goa/dudhsagar-falls.png" },
      { name: "Fort Aguada", location: "Sinquerim, Goa", image: "/images/goa/fort-aguada.png" },
    ],
    activities: [
      { icon: "🤿", title: "Scuba Diving", desc: "Explore vibrant coral reefs and marine life off the coast of Grande Island." },
      { icon: "🪂", title: "Parasailing", desc: "Soar high above the Arabian Sea with panoramic views of the Goan coastline." },
      { icon: "🏮", title: "Night Markets", desc: "Browse handmade crafts, spices, and live music at the famous Saturday bazaar." },
      { icon: "🏖️", title: "Beach Shacks", desc: "Sip cocktails and savour fresh seafood as the sun sets on golden sands." },
    ],
  },

  manali: {
    slug: "manali",
    name: "Manali",
    region: "India · Himalayan Escape",
    tagline: "Mountains, Snow & Adventure",
    heroImage: "/images/manali/hero.png",
    experienceImages: [
      "/images/manali/hadimba-temple.png",
      "/images/manali/solang-valley.png",
      "/images/manali/rohtang-pass.png",
      "/images/manali/hero.png"
    ],
    description: [
      "Nestled in the Beas River valley at 2,050 metres above sea level, Manali is Himachal Pradesh's crown jewel. Lush pine forests, roaring rivers and snow-clad peaks make it one of India's most breathtaking hill stations.",
      "Whether you're carving powder on Solang Valley slopes, crossing the legendary Rohtang Pass, strolling through Old Manali's charming cafes, or soaking in the ancient Vashisht hot springs — Manali rewards every kind of traveller.",
    ],
    highlights: [
      { icon: "🏔️", title: "Himalayan Peaks", desc: "Snow-capped vistas year-round" },
      { icon: "🎿", title: "Adventure Sports", desc: "Skiing, paragliding & rafting" },
      { icon: "🌲", title: "Pine Forests", desc: "Ancient deodar cedar groves" },
      { icon: "🛕", title: "Ancient Temples", desc: "Centuries of mountain culture" },
    ],
    places: [
      { name: "Hadimba Temple", location: "Old Manali", image: "/images/manali/hadimba-temple.png" },
      { name: "Solang Valley", location: "North Manali", image: "/images/manali/solang-valley.png" },
      { name: "Rohtang Pass", location: "Kullu District", image: "/images/manali/rohtang-pass.png" },
      { name: "Beas Kund Trek", location: "Himachal Pradesh", image: "/images/manali/hero.png" },
    ],
    activities: [
      { icon: "🎿", title: "Skiing", desc: "Carve fresh powder on the slopes of Solang Valley and Rohtang Pass." },
      { icon: "🪂", title: "Paragliding", desc: "Take flight over the Kullu valley with jaw-dropping aerial views." },
      { icon: "🚵", title: "Mountain Biking", desc: "Pedal through rugged Himalayan trails and remote shepherd villages." },
      { icon: "🏕️", title: "Camping", desc: "Spend the night under a canopy of stars beside a glacial mountain stream." },
    ],
  },

  jaipur: {
    slug: "jaipur",
    name: "Jaipur",
    region: "India · The Pink City",
    tagline: "Royalty, Forts & Timeless Beauty",
    heroImage: "/images/jaipur/hero.png",
    experienceImages: [
      "/images/jaipur/amer-fort.png",
      "/images/jaipur/hawa-mahal.png",
      "/images/jaipur/city-palace.png",
      "/images/jaipur/hero.png"
    ],
    description: [
      "Jaipur, the Pink City, is the jewel of Rajasthan — a living museum of royal grandeur, where Mughal architecture meets Rajput opulence at every turn. Founded in 1727, its rose-pink palaces and limestone fortresses have captivated emperors and travellers alike.",
      "Explore the labyrinthine bazaars of the old walled city, watch the sun melt behind Amer Fort as its golden ramparts glow, or sit on a rooftop sipping masala chai while the city hums below you. Jaipur is colour, chaos, and magic all at once.",
    ],
    highlights: [
      { icon: "🏯", title: "Majestic Forts", desc: "Amer, Nahargarh & Jaigarh" },
      { icon: "👘", title: "Royal Palaces", desc: "Living Rajput heritage" },
      { icon: "🛍️", title: "Bazaars", desc: "Gems, textiles & blue pottery" },
      { icon: "🐘", title: "Elephant Rides", desc: "Traditional royal processions" },
    ],
    places: [
      { name: "Amer Fort", location: "Amer, Jaipur", image: "/images/jaipur/amer-fort.png" },
      { name: "Hawa Mahal", location: "Old City, Jaipur", image: "/images/jaipur/hawa-mahal.png" },
      { name: "City Palace", location: "Tripolia Bazar", image: "/images/jaipur/city-palace.png" },
      { name: "Nahargarh Fort", location: "Aravalli Hills", image: "/images/jaipur/hero.png" },
    ],
    activities: [
      { icon: "🐫", title: "Camel Safari", desc: "Ride through the desert landscape on a traditional Rajasthani camel." },
      { icon: "🍛", title: "Food Walks", desc: "Taste dal baati churma, ghevar and kachori in the old city lanes." },
      { icon: "🏺", title: "Block Printing", desc: "Learn the art of Sanganer block printing from master craftsmen." },
      { icon: "🔭", title: "Jantar Mantar", desc: "Explore the world's largest stone sundial at this UNESCO observatory." },
    ],
  },

  kerala: {
    slug: "kerala",
    name: "Kerala",
    region: "India · God's Own Country",
    tagline: "Backwaters, Spices & Serenity",
    heroImage: "/images/kerala/hero.png",
    experienceImages: [
      "/images/kerala/alleppey-backwaters.png",
      "/images/kerala/munnar-tea.png",
      "/images/kerala/wayanad.png",
      "/images/kerala/hero.png"
    ],
    description: [
      "Kerala is a place that defies easy description — a narrow strip of paradise at India's southwestern tip, where emerald backwaters thread through coconut palms, ancient spice plantations drift down misty hillsides, and pristine beaches border the Arabian Sea.",
      "Float along the Alleppey waterways on a traditional kettuvallam houseboat, trek through the cloud-kissed tea terraces of Munnar, witness the electric colour of a Kathakali performance, or surrender to the ancient healing of Ayurveda. Kerala nourishes the soul.",
    ],
    highlights: [
      { icon: "🚤", title: "Backwaters", desc: "Serene houseboat journeys" },
      { icon: "🌿", title: "Ayurveda", desc: "Ancient healing traditions" },
      { icon: "🫚", title: "Spice Trails", desc: "Cardamom, pepper & cloves" },
      { icon: "🌊", title: "Coastal Beaches", desc: "Pristine Arabian Sea shores" },
    ],
    places: [
      { name: "Alleppey Backwaters", location: "Alappuzha", image: "/images/kerala/alleppey-backwaters.png" },
      { name: "Munnar Tea Gardens", location: "Idukki District", image: "/images/kerala/munnar-tea.png" },
      { name: "Wayanad Forest", location: "Wayanad District", image: "/images/kerala/wayanad.png" },
      { name: "Kovalam Beach", location: "Thiruvananthapuram", image: "/images/kerala/hero.png" },
    ],
    activities: [
      { icon: "🛶", title: "Houseboat Cruise", desc: "Drift through tranquil canals and lagoons on a traditional kettuvallam." },
      { icon: "🧘", title: "Ayurveda Retreat", desc: "Rejuvenate with ancient Panchakarma therapies at a lakeside resort." },
      { icon: "🌿", title: "Spice Plantation Tour", desc: "Walk through aromatic cardamom and pepper groves in the Western Ghats." },
      { icon: "🐘", title: "Elephant Sanctuary", desc: "Visit Kodanad or Guruvayur to see Kerala's beloved elephants up close." },
    ],
  },
};
