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
  image: string;
  images: string[];
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
  experiences?: Array<{
    name: string;
    location: string;
    image: string;
    description: string;
  }>;
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
      { 
        icon: "🏖️", 
        title: "Pristine Beaches", 
        desc: "Goa's coastline is a symphony of golden sands and turquoise waters. From the quiet serenity of Palolem in the south to the energetic vibes of Baga in the north, find your perfect patch of paradise.", 
        image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=1600",
        images: [
          // Palolem Beach, Goa — calm crescent-shaped bay with boats
          "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=1600",
          // Tropical Indian beach with golden sand and palms
          "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&q=80&w=1600",
          // Beach hammock and clear water — Goa beach style
          "https://images.unsplash.com/photo-1501419758462-8c5af1f5fce3?auto=format&fit=crop&q=80&w=1600",
          // Sunset beach with waves — Arabian Sea
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { 
        icon: "🎶", 
        title: "Vibrant Nightlife", 
        desc: "As the sun sets, Goa transforms into a pulsating hub of music and celebration. Experience world-renowned beach clubs, open-air festivals, and hidden neon-lit lounges.", 
        image: "https://images.unsplash.com/photo-1571266028257-3d5e1573e6dd?auto=format&fit=crop&q=80&w=1600",
        images: [
          // Open-air beach party / DJ festival crowd at night
          "https://images.unsplash.com/photo-1571266028257-3d5e1573e6dd?auto=format&fit=crop&q=80&w=1600",
          // Beach bonfire and party — coastal nightlife
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1600",
          // Neon-lit outdoor festival / trance scene
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1600",
          // DJ/concert crowd with colorful lights
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { 
        icon: "⛪", 
        title: "Portuguese Heritage", 
        desc: "Step back in time through the cobblestone streets of Fontainhas or the grand cathedrals of Old Goa. The unique Indo-Portuguese architecture tells a centuries-old story of cultural fusion.", 
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1600",
        images: [
          // White colonial Portuguese-style church facade
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1600",
          // Colorful Latin-quarter style streets — Fontainhas Goa style
          "https://images.unsplash.com/photo-1555881400-83b9b26f987a?auto=format&fit=crop&q=80&w=1600",
          // Colonial arched corridor / cathedral interior/exterior
          "https://images.unsplash.com/photo-1602604553978-a694b3bba5a0?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { 
        icon: "🦐", 
        title: "Goan Seafood", 
        desc: "Indulge in a culinary journey defined by fresh catches and aromatic spices. Savor the legendary fish thali, fiery prawn vindaloo, and butter-garlic calamari by the sea.", 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1600",
        images: [
          // Indian fish curry / seafood on banana leaf — Goan thali style
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1600",
          // Fresh whole fish and prawns on ice at market
          "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=1600",
          // Grilled seafood platter at a beach shack
          "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=1600",
          // Beach shack with seafood dining setup by the ocean
          "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=1600",
        ],
      },
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
      { icon: "🏔️", title: "Himalayan Peaks", desc: "Experience the majesty of snow-capped vistas that define the reach of the gods.", image: "https://images.unsplash.com/photo-1544070078-a212eda27b49?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1544070078-a212eda27b49?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🎿", title: "Adventure Sports", desc: "From paragliding over valleys to skiing down fresh powder, Manali is an adrenaline seeker's dream.", image: "https://images.unsplash.com/photo-1531336423041-8608823528f8?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1531336423041-8608823528f8?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1601027847350-0285867c31f7?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🌲", title: "Pine Forests", desc: "Walk through ancient deodar cedar groves where sunlight filters through a canopy of green.", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🛕", title: "Ancient Temples", desc: "Discover centuries of mountain culture embodied in carved wood and stone sanctuaries.", image: "https://images.unsplash.com/photo-1590492459113-b362083f98c4?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1590492459113-b362083f98c4?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1609766857413-b0929f8614f2?auto=format&fit=crop&q=80&w=1600",
        ],
      },
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
      { icon: "🏯", title: "Majestic Forts", desc: "The formidable ramparts of Amer and Nahargarh stand as sentinels of a glorious past.", image: "https://images.unsplash.com/photo-1599661046289-e318978b66bc?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1599661046289-e318978b66bc?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1524492014-359c8d29bf14?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1591018533941-3b9c3c0e7a47?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "👘", title: "Royal Palaces", desc: "Step into a world of opulence and intricate artistry within the City Palace's rose-hued walls.", image: "https://images.unsplash.com/photo-1477587458883-4a369d3c43d8?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1477587458883-4a369d3c43d8?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1586002875904-d4d2ccd53e81?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1545126913-e9a9e9c3f7e2?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🛍️", title: "Bazaars", desc: "Wander through vibrant markets filled with sparkling gems, hand-blocked textiles, and artisan pottery.", image: "https://images.unsplash.com/photo-1596422846543-b5c64881fe53?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1596422846543-b5c64881fe53?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1573842402234-9c0d0f8c4b06?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🐘", title: "Elephant Rides", desc: "Mount these gentle giants for a traditional royal procession to the heights of Amer Fort.", image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1437015158783-a88209e8f83b?auto=format&fit=crop&q=80&w=1600",
        ],
      },
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
      { icon: "🚤", title: "Backwaters", desc: "Glide through a labyrinth of palm-fringed canals on a traditional wooden houseboat.", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1602001625547-6c52905f6f23?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1598977753888-c0f4f1cfedb3?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🌿", title: "Ayurveda", desc: "Rejuvenate your spirit with ancient healing traditions that treat the soul and body in harmony.", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1477936821694-ec4233a9a1a0?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🫚", title: "Spice Trails", desc: "Follow the scent of cardamom, pepper, and cloves through lush hillside plantations.", image: "https://images.unsplash.com/photo-1596797038530-2c39bb90fba4?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1596797038530-2c39bb90fba4?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1600",
        ],
      },
      { icon: "🌊", title: "Coastal Beaches", desc: "Unwind on pristine Arabian Sea shores where golden sands meet towering coconut palms.", image: "https://images.unsplash.com/photo-1589981108212-d27849e77174?auto=format&fit=crop&q=80&w=1600",
        images: [
          "https://images.unsplash.com/photo-1589981108212-d27849e77174?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600",
        ],
      },
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
