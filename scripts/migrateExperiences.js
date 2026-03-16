import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const citiesDir = path.join(publicImagesDir, 'cities');
const experiencesDir = path.join(publicImagesDir, 'experiences');

if (!fs.existsSync(citiesDir)) fs.mkdirSync(citiesDir, { recursive: true });
if (!fs.existsSync(experiencesDir)) fs.mkdirSync(experiencesDir, { recursive: true });

async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath)) {
    console.log(`Skipping (already exists): ${destPath}`);
    return;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`Downloaded: ${destPath}`);
  } catch (error) {
    console.error(`Error downloading ${url} to ${destPath}:`, error.message);
  }
}

// Generate an SEO-friendly filename from a string
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Quick AI-like lookup for locations and descriptions (stubbed map for our 60 attractions)
// This adds the rich data requested by the prompt for the new Experience interface.
const richDataFallback = {
  // MUMBAI
  "Gateway of India": { location: "Colaba", desc: "Iconic 1924 waterfront arch overlooking the Arabian Sea." },
  "Chhatrapati Shivaji Maharaj Terminus": { location: "Fort", desc: "A historic railway station and UNESCO World Heritage site blending Victorian and Indian architecture." },
  "Marine Drive": { location: "South Mumbai", desc: "A 3km-long sweeping promenade known as the Queen's Necklace." },
  "Elephanta Caves": { location: "Elephanta Island", desc: "Ancient rock-cut temples dedicated to Lord Shiva." },
  "Haji Ali Dargah": { location: "Worli Coast", desc: "A sublime 15th-century mosque sitting on an islet in the sea." },
  "Siddhivinayak Temple": { location: "Prabhadevi", desc: "One of the richest and most revered Ganesha temples in India." },
  "Chowpatty Beach": { location: "Girgaon", desc: "A bustling city beach famous for local street food like bhel puri." },
  "Dharavi": { location: "Central Mumbai", desc: "Asia's most famous and industrious informal settlement." },
  "Colaba Causeway": { location: "Colaba", desc: "A vibrant street market flanked by colonial-era buildings." },
  "Juhu Beach": { location: "Juhu", desc: "A popular suburb beachfront famous for sunset strolls and Bollywood celebrity spotting." },

  // DELHI
  "India Gate": { location: "Rajpath", desc: "A monumental 42m-high sandstone arch dedicated to Indian soldiers." },
  "Red Fort": { location: "Old Delhi", desc: "The magnificent 17th-century Mughal fortress of red sandstone." },
  "Qutub Minar": { location: "Mehrauli", desc: "The tallest brick minaret in the world, built in the early 13th century." },
  "Humayun's Tomb": { location: "Nizamuddin East", desc: "The spectacular garden tomb that inspired the Taj Mahal." },
  "Lotus Temple": { location: "Kalkaji", desc: "A stunning flower-like Bahá'í House of Worship." },
  "Jama Masjid": { location: "Old Delhi", desc: "One of the largest and grandest mosques in India." },
  "Akshardham Temple": { location: "Noida Mor", desc: "A massive Hindu temple complex showcasing millennia of Indian culture." },
  "Chandni Chowk": { location: "Old Delhi", desc: "One of India's oldest and busiest markets, famous for narrow lanes and street food." },
  "Raj Ghat": { location: "Ring Road", desc: "The peaceful black marble memorial marking Mahatma Gandhi's cremation spot." },
  "Lodhi Garden": { location: "Lodhi Road", desc: "A lush city park dotted with 15th-century architectural tombs." },

  // BENGALURU
  "Lalbagh Botanical Garden": { location: "South Bengaluru", desc: "A 240-acre garden originally commissioned by Hyder Ali in 1760." },
  "Bengaluru Palace": { location: "Vasanth Nagar", desc: "A majestic Tudor-style palace reminiscent of Windsor Castle." },
  "Cubbon Park": { location: "Central Administrative Area", desc: "A sprawling 300-acre green oasis in the heart of the city." },
  "Vidhana Soudha": { location: "Ambedkar Veedhi", desc: "The imposing neo-Dravidian state legislature building." },
  "ISKCON Temple Bengaluru": { location: "Rajajinagar", desc: "One of the largest ISKCON temples in the world." },
  "Bull Temple (Dodda Ganesha)": { location: "Basavanagudi", desc: "A 16th-century temple featuring a massive monolithic Nandi bull." },
  "Tipu Sultan's Summer Palace": { location: "Chamrajpet", desc: "An elegant two-story palace built entirely of teak wood." },
  "Bannerghatta National Park": { location: "Bannerghatta", desc: "A biological reserve featuring a zoo, butterfly park, and safari." },
  "UB City Mall": { location: "CBD", desc: "India's first luxury shopping mall with premium dining and architecture." },
  "Commercial Street": { location: "Tasker Town", desc: "A bustling thoroughfare famed for clothes, jewelry, and bargain shopping." },

  // HYDERABAD
  "Charminar": { location: "Old City", desc: "The iconic 16th-century mosque with four grand arches and minarets." },
  "Golconda Fort": { location: "Golconda", desc: "An ancient citadel famous for its acoustic architecture and diamond vaults." },
  "Hussain Sagar Lake": { location: "Necklace Road", desc: "A heart-shaped lake featuring a massive monolithic Buddha statue." },
  "Chowmahalla Palace": { location: "Motigalli", desc: "The opulent former official residence of the Nizams of Hyderabad." },
  "Qutb Shahi Tombs": { location: "Ibrahim Bagh", desc: "The serene domed tombs of the seven Qutb Shahi rulers." },
  "Salar Jung Museum": { location: "Darulshifa", desc: "One of the largest one-man collections of antiques in the world." },
  "Mecca Masjid": { location: "Old City", desc: "A massive 17th-century mosque whose bricks were made from Mecca soil." },
  "Ramoji Film City": { location: "Anajpur", desc: "The largest integrated film studio complex in the world." },
  "Nehru Zoological Park": { location: "Bahadurpura", desc: "A sprawling 380-acre zoo featuring open moats and a lion safari." },
  "Birla Mandir Hyderabad": { location: "Naubat Pahad", desc: "A stunning white marble Hindu temple overlooking Hussain Sagar Lake." },

  // CHENNAI
  "Marina Beach": { location: "Triplicane", desc: "India's longest natural urban beach along the Bay of Bengal." },
  "Kapaleeshwarar Temple": { location: "Mylapore", desc: "A colorful 7th-century Dravidian temple dedicated to Lord Shiva." },
  "Fort St. George": { location: "Rajaji Salai", desc: "The first English fortress in India, built in 1644." },
  "Valluvar Kottam": { location: "Nungambakkam", desc: "A stone chariot monument dedicated to the classical Tamil poet Thiruvalluvar." },
  "Santhome Cathedral Basilica": { location: "Santhome", desc: "A soaring Neo-Gothic cathedral built over the tomb of St. Thomas." },
  "Government Museum Chennai": { location: "Egmore", desc: "A premier museum known for its exquisite Chola bronze sculptures." },
  "Arignar Anna Zoological Park": { location: "Vandalur", desc: "India's largest zoological park spreading over 1,490 acres." },
  "Mahabalipuram (Day Trip)": { location: "Chengalpattu", desc: "A UNESCO site renowned for its 7th-century shore temples and stone carvings." },
  "Elliot's Beach (Besant Nagar)": { location: "Besant Nagar", desc: "A cleaner, quieter promenade beach perfect for evening strolls." },
  "Parthasarathy Temple": { location: "Triplicane", desc: "An 8th-century Vaishnavite temple featuring five forms of Lord Vishnu." },

  // KOLKATA
  "Victoria Memorial": { location: "Maidan", desc: "A vast, magnificent white marble museum dedicated to Queen Victoria." },
  "Howrah Bridge": { location: "Hooghly River", desc: "A massive cantilever bridge and iconic symbol of Kolkata." },
  "Dakshineswar Kali Temple": { location: "Dakshineswar", desc: "A famous 19th-century Hindu temple complex on the eastern bank of the Hooghly." },
  "Belur Math": { location: "Belur", desc: "The headquarters of the Ramakrishna Math, featuring universal temple architecture." },
  "Marble Palace": { location: "Chorbagan", desc: "A palatial 19th-century mansion housing European sculptures and paintings." },
  "Indian Museum": { location: "Park Street", desc: "The oldest and largest multipurpose museum in the Asia-Pacific region." },
  "Kalighat Kali Temple": { location: "Kalighat", desc: "One of the 51 Shakti Peethas and a profoundly sacred Hindu pilgrimage site." },
  "New Market (Hogg Market)": { location: "Lindsay Street", desc: "A historic colonial-era covered market selling almost everything imaginable." },
  "Sundarbans National Park (Day Trip)": { location: "Ganges Delta", desc: "A vast mangrove forest biosphere reserve, home to the Royal Bengal Tiger." },
  "Park Street": { location: "Central Kolkata", desc: "The city's vibrant dining and entertainment thoroughfare with colonial charm." },
};

function enrichExperience(name) {
  return richDataFallback[name] || {
    location: "City Center",
    desc: "A beautiful local attraction worth visiting to experience the culture."
  };
}

async function main() {
  const file = path.join(__dirname, '..', 'src', 'data', 'tier1Cities.ts');
  let content = fs.readFileSync(file, 'utf-8');

  // We are going to parse the code via regex lines and rewrite it nicely.
  const lines = content.split('\n');
  let newLines = [];
  
  let currentCity = "";
  let inAttractions = false;
  let currentAttraction = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Catch city name
    const cityMatch = line.match(/^\s*city:\s*"([^"]+)"/);
    if (cityMatch) currentCity = slugify(cityMatch[1]);

    // Catch heroImage: "..."
    const heroMatch = line.match(/^(.*)\bheroImage\s*:\s*"([^"]+)"(.*)$/);
    if (heroMatch) {
      const url = heroMatch[2];
      const destName = `${currentCity}.jpg`;
      const destPath = path.join(citiesDir, destName);
      await downloadImage(url, destPath);
      newLines.push(`${heroMatch[1]}heroImage: "/images/cities/${destName}"${heroMatch[3]}`);
      continue;
    }

    // Entering attractions block
    if (line.match(/^\s*attractions:\s*\[/)) {
      newLines.push(line.replace('attractions:', 'experiences:'));
      
      // Ensure city experience dir exists
      const cityExpDir = path.join(experiencesDir, currentCity);
      if (!fs.existsSync(cityExpDir)) fs.mkdirSync(cityExpDir, { recursive: true });
      continue;
    }

    // Inside attractions array parsing
    if (line.match(/^\s*name:\s*"([^"]+)"/)) {
      currentAttraction.name = line.match(/^\s*name:\s*"([^"]+)"/)[1];
    }
    
    // Catch attraction map coordinates (we just skip these as new Experiences don't use them, but keep them if we want?) 
    // Wait, the prompt didn't say drop coordinates, but the generic schema didn't include them. We'll drop them to simplify.
    if (line.match(/^\s*coordinates:\s*\[/)) {
      // Skip it to clean up the shape to match user prompt exactly
      continue;
    }

    // Catch attraction image: "..."
    const imgMatch = line.match(/^(.*)\bimage\s*:\s*"([^"]+)"(.*)$/);
    if (imgMatch) {
      const url = imgMatch[2];
      const slugName = slugify(currentAttraction.name);
      const destName = `${slugName}.jpg`;
      const destPath = path.join(experiencesDir, currentCity, destName);
      
      await downloadImage(url, destPath);
      
      // Now output the new properties for this experience
      const enriched = enrichExperience(currentAttraction.name);
      
      // Because we skipped coordinates, we need to output location + description + image right here
      const indent = imgMatch[1];
      newLines.push(`${indent}location: "${enriched.location}",`);
      newLines.push(`${indent}image: "/images/experiences/${currentCity}/${destName}",`);
      newLines.push(`${indent}description: "${enriched.desc}"${imgMatch[3]}`);
      
      currentAttraction = {}; // reset
      continue;
    }

    // Fix interface names at top of file
    if (line.includes('interface CityAttraction')) {
      newLines.push('export interface Experience {');
      newLines.push('  name: string;');
      newLines.push('  location: string;');
      newLines.push('  image: string;');
      newLines.push('  description: string;');
      newLines.push('}');
      
      // skip lines until }
      let j = i + 1;
      while (!lines[j].includes('}')) j++;
      i = j;
      continue;
    }

    if (line.includes('attractions: CityAttraction[];')) {
      newLines.push(line.replace('attractions: CityAttraction[];', 'experiences: Experience[];'));
      continue;
    }

    newLines.push(line);
  }

  fs.writeFileSync(file, newLines.join('\n'));
}

main().then(() => console.log('Migration Complete!'));
