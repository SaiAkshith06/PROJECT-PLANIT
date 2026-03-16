/**
 * Tier-1 Indian Cities Dataset
 * Author: Akshith
 *
 * Contains accurate attraction data for India's 6 major metro cities.
 * Coordinates are verified against Google Maps / OpenStreetMap.
 * Image queries are landmark-specific to avoid generic photo results.
 */

export interface Experience {
  name: string;
  location: string;
  image: string;
  description: string;
}

export interface Tier1City {
  city: string;
  state: string;
  description: string;
  heroImage: string;
  experiences: Experience[];
}

export const tier1Cities: Tier1City[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // MUMBAI
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Mumbai",
    state: "Maharashtra",
    description:
      "Mumbai is India's financial capital and entertainment hub — a city of dreams where colonial grandeur meets a thundering 21 million people, Bollywood glamour, and the eternally restless Arabian Sea.",
    heroImage: "/images/cities/mumbai.jpg",
    experiences: [
      {
        name: "Gateway of India",
        location: "Colaba",
        image: "/images/experiences/mumbai/gateway-of-india.jpg",
        description: "Iconic 1924 waterfront arch overlooking the Arabian Sea.",
      },
      {
        name: "Chhatrapati Shivaji Maharaj Terminus",
        location: "Fort",
        image: "/images/experiences/mumbai/chhatrapati-shivaji-maharaj-terminus.jpg",
        description: "A historic railway station and UNESCO World Heritage site blending Victorian and Indian architecture.",
      },
      {
        name: "Marine Drive",
        location: "South Mumbai",
        image: "/images/experiences/mumbai/marine-drive.jpg",
        description: "A 3km-long sweeping promenade known as the Queen's Necklace.",
      },
      {
        name: "Elephanta Caves",
        location: "Elephanta Island",
        image: "/images/experiences/mumbai/elephanta-caves.jpg",
        description: "Ancient rock-cut temples dedicated to Lord Shiva.",
      },
      {
        name: "Haji Ali Dargah",
        location: "Worli Coast",
        image: "/images/experiences/mumbai/haji-ali-dargah.jpg",
        description: "A sublime 15th-century mosque sitting on an islet in the sea.",
      },
      {
        name: "Siddhivinayak Temple",
        location: "Prabhadevi",
        image: "/images/experiences/mumbai/siddhivinayak-temple.jpg",
        description: "One of the richest and most revered Ganesha temples in India.",
      },
      {
        name: "Chowpatty Beach",
        location: "Girgaon",
        image: "/images/experiences/mumbai/chowpatty-beach.jpg",
        description: "A bustling city beach famous for local street food like bhel puri.",
      },
      {
        name: "Dharavi",
        location: "Central Mumbai",
        image: "/images/experiences/mumbai/dharavi.jpg",
        description: "Asia's most famous and industrious informal settlement.",
      },
      {
        name: "Colaba Causeway",
        location: "Colaba",
        image: "/images/experiences/mumbai/colaba-causeway.jpg",
        description: "A vibrant street market flanked by colonial-era buildings.",
      },
      {
        name: "Juhu Beach",
        location: "Juhu",
        image: "/images/experiences/mumbai/juhu-beach.jpg",
        description: "A popular suburb beachfront famous for sunset strolls and Bollywood celebrity spotting.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DELHI
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Delhi",
    state: "National Capital Territory",
    description:
      "Delhi is India's ancient seat of power and modern capital — a layered city where Mughal domes, British boulevards, and a roaring metro system coexist across three millennia of continuous civilisation.",
    heroImage: "/images/cities/delhi.jpg",
    experiences: [
      {
        name: "India Gate",
        location: "Rajpath",
        image: "/images/experiences/delhi/india-gate.jpg",
        description: "A monumental 42m-high sandstone arch dedicated to Indian soldiers.",
      },
      {
        name: "Red Fort",
        location: "Old Delhi",
        image: "/images/experiences/delhi/red-fort.jpg",
        description: "The magnificent 17th-century Mughal fortress of red sandstone.",
      },
      {
        name: "Qutub Minar",
        location: "Mehrauli",
        image: "/images/experiences/delhi/qutub-minar.jpg",
        description: "The tallest brick minaret in the world, built in the early 13th century.",
      },
      {
        name: "Humayun's Tomb",
        location: "Nizamuddin East",
        image: "/images/experiences/delhi/humayuns-tomb.jpg",
        description: "The spectacular garden tomb that inspired the Taj Mahal.",
      },
      {
        name: "Lotus Temple",
        location: "Kalkaji",
        image: "/images/experiences/delhi/lotus-temple.jpg",
        description: "A stunning flower-like Bahá'í House of Worship.",
      },
      {
        name: "Jama Masjid",
        location: "Old Delhi",
        image: "/images/experiences/delhi/jama-masjid.jpg",
        description: "One of the largest and grandest mosques in India.",
      },
      {
        name: "Akshardham Temple",
        location: "Noida Mor",
        image: "/images/experiences/delhi/akshardham-temple.jpg",
        description: "A massive Hindu temple complex showcasing millennia of Indian culture.",
      },
      {
        name: "Chandni Chowk",
        location: "Old Delhi",
        image: "/images/experiences/delhi/chandni-chowk.jpg",
        description: "One of India's oldest and busiest markets, famous for narrow lanes and street food.",
      },
      {
        name: "Raj Ghat",
        location: "Ring Road",
        image: "/images/experiences/delhi/raj-ghat.jpg",
        description: "The peaceful black marble memorial marking Mahatma Gandhi's cremation spot.",
      },
      {
        name: "Lodhi Garden",
        location: "Lodhi Road",
        image: "/images/experiences/delhi/lodhi-garden.jpg",
        description: "A lush city park dotted with 15th-century architectural tombs.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BENGALURU
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Bengaluru",
    state: "Karnataka",
    description:
      "Bengaluru, the Silicon Valley of India, balances a thriving tech ecosystem with a cosmopolitan pub culture, colonial-era parks, and the mild year-round climate that has made it the country's most liveable metro.",
    heroImage: "/images/experiences/bengaluru/vidhana-soudha.jpg",
    experiences: [
      {
        name: "Lalbagh Botanical Garden",
        location: "South Bengaluru",
        image: "/images/experiences/bengaluru/lalbagh-botanical-garden.jpg",
        description: "A 240-acre garden originally commissioned by Hyder Ali in 1760.",
      },
      {
        name: "Bengaluru Palace",
        location: "Vasanth Nagar",
        image: "/images/experiences/bengaluru/bengaluru-palace.jpg",
        description: "A majestic Tudor-style palace reminiscent of Windsor Castle.",
      },
      {
        name: "Cubbon Park",
        location: "Central Administrative Area",
        image: "/images/experiences/bengaluru/cubbon-park.jpg",
        description: "A sprawling 300-acre green oasis in the heart of the city.",
      },
      {
        name: "Vidhana Soudha",
        location: "Ambedkar Veedhi",
        image: "/images/experiences/bengaluru/vidhana-soudha.jpg",
        description: "The imposing neo-Dravidian state legislature building.",
      },
      {
        name: "ISKCON Temple Bengaluru",
        location: "Rajajinagar",
        image: "/images/experiences/bengaluru/iskcon-temple-bengaluru.jpg",
        description: "One of the largest ISKCON temples in the world.",
      },
      {
        name: "Bull Temple (Dodda Ganesha)",
        location: "Basavanagudi",
        image: "/images/experiences/bengaluru/bull-temple-dodda-ganesha.jpg",
        description: "A 16th-century temple featuring a massive monolithic Nandi bull.",
      },
      {
        name: "Tipu Sultan's Summer Palace",
        location: "Chamrajpet",
        image: "/images/experiences/bengaluru/tipu-sultans-summer-palace.jpg",
        description: "An elegant two-story palace built entirely of teak wood.",
      },
      {
        name: "Bannerghatta National Park",
        location: "Bannerghatta",
        image: "/images/experiences/bengaluru/bannerghatta-national-park.jpg",
        description: "A biological reserve featuring a zoo, butterfly park, and safari.",
      },
      {
        name: "UB City Mall",
        location: "CBD",
        image: "/images/experiences/bengaluru/ub-city-mall.jpg",
        description: "India's first luxury shopping mall with premium dining and architecture.",
      },
      {
        name: "Commercial Street",
        location: "Tasker Town",
        image: "/images/experiences/bengaluru/commercial-street.jpg",
        description: "A bustling thoroughfare famed for clothes, jewelry, and bargain shopping.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HYDERABAD
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Hyderabad",
    state: "Telangana",
    description:
      "Hyderabad, the City of Pearls, blends the grandeur of the Nizams with a booming IT corridor. Its iconic Charminar, fragrant biryani lanes, and glittering pearl markets make it one of India's most charismatic cities.",
    heroImage: "/images/cities/hyderabad_charminar_custom.jpg",
    experiences: [
      {
        name: "Charminar",
        location: "Old City",
        image: "/images/experiences/hyderabad/charminar.jpg",
        description: "The iconic 16th-century mosque with four grand arches and minarets.",
      },
      {
        name: "Golconda Fort",
        location: "Golconda",
        image: "/images/experiences/hyderabad/golconda-fort.jpg",
        description: "An ancient citadel famous for its acoustic architecture and diamond vaults.",
      },
      {
        name: "Hussain Sagar Lake",
        location: "Necklace Road",
        image: "/images/experiences/hyderabad/hussain-sagar-lake.jpg",
        description: "A heart-shaped lake featuring a massive monolithic Buddha statue.",
      },
      {
        name: "Chowmahalla Palace",
        location: "Motigalli",
        image: "/images/experiences/hyderabad/chowmahalla-palace.jpg",
        description: "The opulent former official residence of the Nizams of Hyderabad.",
      },
      {
        name: "Qutb Shahi Tombs",
        location: "Ibrahim Bagh",
        image: "/images/experiences/hyderabad/qutb-shahi-tombs.jpg",
        description: "The serene domed tombs of the seven Qutb Shahi rulers.",
      },
      {
        name: "Salar Jung Museum",
        location: "Darulshifa",
        image: "/images/experiences/hyderabad/salar-jung-museum.jpg",
        description: "One of the largest one-man collections of antiques in the world.",
      },
      {
        name: "Mecca Masjid",
        location: "Old City",
        image: "/images/experiences/hyderabad/mecca-masjid.jpg",
        description: "A massive 17th-century mosque whose bricks were made from Mecca soil.",
      },
      {
        name: "Ramoji Film City",
        location: "Anajpur",
        image: "/images/experiences/hyderabad/ramoji-film-city.jpg",
        description: "The largest integrated film studio complex in the world.",
      },
      {
        name: "Nehru Zoological Park",
        location: "Bahadurpura",
        image: "/images/experiences/hyderabad/nehru-zoological-park.jpg",
        description: "A sprawling 380-acre zoo featuring open moats and a lion safari.",
      },
      {
        name: "Birla Mandir Hyderabad",
        location: "Naubat Pahad",
        image: "/images/experiences/hyderabad/birla-mandir-hyderabad.jpg",
        description: "A stunning white marble Hindu temple overlooking Hussain Sagar Lake.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHENNAI
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Chennai",
    state: "Tamil Nadu",
    description:
      "Chennai, the Gateway to South India, is a city of Dravidian temples, a thriving classical arts scene, and one of the world's longest urban beaches — all wrapped in the fragrance of jasmine and filter coffee.",
    heroImage: "/images/cities/chennai.jpg",
    experiences: [
      {
        name: "Marina Beach",
        location: "Triplicane",
        image: "/images/experiences/chennai/marina-beach.jpg",
        description: "India's longest natural urban beach along the Bay of Bengal.",
      },
      {
        name: "Kapaleeshwarar Temple",
        location: "Mylapore",
        image: "/images/experiences/chennai/kapaleeshwarar-temple.jpg",
        description: "A colorful 7th-century Dravidian temple dedicated to Lord Shiva.",
      },
      {
        name: "Fort St. George",
        location: "Rajaji Salai",
        image: "/images/experiences/chennai/fort-st-george.jpg",
        description: "The first English fortress in India, built in 1644.",
      },
      {
        name: "Valluvar Kottam",
        location: "Nungambakkam",
        image: "/images/experiences/chennai/valluvar-kottam.jpg",
        description: "A stone chariot monument dedicated to the classical Tamil poet Thiruvalluvar.",
      },
      {
        name: "Santhome Cathedral Basilica",
        location: "Santhome",
        image: "/images/experiences/chennai/santhome-cathedral-basilica.jpg",
        description: "A soaring Neo-Gothic cathedral built over the tomb of St. Thomas.",
      },
      {
        name: "Government Museum Chennai",
        location: "Egmore",
        image: "/images/experiences/chennai/government-museum-chennai.jpg",
        description: "A premier museum known for its exquisite Chola bronze sculptures.",
      },
      {
        name: "Arignar Anna Zoological Park",
        location: "Vandalur",
        image: "/images/experiences/chennai/arignar-anna-zoological-park.jpg",
        description: "India's largest zoological park spreading over 1,490 acres.",
      },
      {
        name: "Mahabalipuram (Day Trip)",
        location: "Chengalpattu",
        image: "/images/experiences/chennai/mahabalipuram-day-trip.jpg",
        description: "A UNESCO site renowned for its 7th-century shore temples and stone carvings.",
      },
      {
        name: "Elliot's Beach (Besant Nagar)",
        location: "Besant Nagar",
        image: "/images/experiences/chennai/elliots-beach-besant-nagar.jpg",
        description: "A cleaner, quieter promenade beach perfect for evening strolls.",
      },
      {
        name: "Parthasarathy Temple",
        location: "Triplicane",
        image: "/images/experiences/chennai/parthasarathy-temple.jpg",
        description: "An 8th-century Vaishnavite temple featuring five forms of Lord Vishnu.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // KOLKATA
  // ─────────────────────────────────────────────────────────────────────────
  {
    city: "Kolkata",
    state: "West Bengal",
    description:
      "Kolkata, India's cultural capital and the City of Joy, is a place of intellectual fervour, grand colonial architecture, Rabindranath Tagore's legacy, and the incomparable Durga Puja festival that transforms the entire city into open-air art.",
    heroImage: "/images/cities/kolkata_bridge_alt.png",
    experiences: [
      {
        name: "Victoria Memorial",
        location: "Maidan",
        image: "/images/experiences/kolkata/victoria-memorial.jpg",
        description: "A vast, magnificent white marble museum dedicated to Queen Victoria.",
      },
      {
        name: "Howrah Bridge",
        location: "Hooghly River",
        image: "/images/experiences/kolkata/howrah-bridge.jpg",
        description: "A massive cantilever bridge and iconic symbol of Kolkata.",
      },
      {
        name: "Dakshineswar Kali Temple",
        location: "Dakshineswar",
        image: "/images/experiences/kolkata/dakshineswar-kali-temple.jpg",
        description: "A famous 19th-century Hindu temple complex on the eastern bank of the Hooghly.",
      },
      {
        name: "Belur Math",
        location: "Belur",
        image: "/images/experiences/kolkata/belur-math.jpg",
        description: "The headquarters of the Ramakrishna Math, featuring universal temple architecture.",
      },
      {
        name: "Marble Palace",
        location: "Chorbagan",
        image: "/images/experiences/kolkata/marble-palace.jpg",
        description: "A palatial 19th-century mansion housing European sculptures and paintings.",
      },
      {
        name: "Indian Museum",
        location: "Park Street",
        image: "/images/experiences/kolkata/indian-museum.jpg",
        description: "The oldest and largest multipurpose museum in the Asia-Pacific region.",
      },
      {
        name: "Kalighat Kali Temple",
        location: "Kalighat",
        image: "/images/experiences/kolkata/kalighat-kali-temple.jpg",
        description: "One of the 51 Shakti Peethas and a profoundly sacred Hindu pilgrimage site.",
      },
      {
        name: "New Market (Hogg Market)",
        location: "Lindsay Street",
        image: "/images/experiences/kolkata/new-market-hogg-market.jpg",
        description: "A historic colonial-era covered market selling almost everything imaginable.",
      },
      {
        name: "Sundarbans National Park (Day Trip)",
        location: "Ganges Delta",
        image: "/images/experiences/kolkata/sundarbans-national-park-day-trip.jpg",
        description: "A vast mangrove forest biosphere reserve, home to the Royal Bengal Tiger.",
      },
      {
        name: "Park Street",
        location: "Central Kolkata",
        image: "/images/experiences/kolkata/park-street.jpg",
        description: "The city's vibrant dining and entertainment thoroughfare with colonial charm.",
      },
    ],
  },
];
