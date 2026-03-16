/**
 * tier1CitiesAdapter.ts
 *
 * Converts the tier1Cities dataset (CityAttraction-based) into the rich
 * shape expected by DestinationPage.tsx (highlights / places / activities).
 *
 * This is a pure data transformation — no UI logic changed.
 */

import { tier1Cities } from "./tier1Cities";
import type { Destination } from "./destinations";

// Generic activities that work for any major Indian metro city
const genericActivities = [
  { icon: "🗺️", title: "Sightseeing", desc: "Explore iconic landmarks, heritage sites, and hidden neighbourhood gems." },
  { icon: "🍽️", title: "Local Cuisine", desc: "Savour street food classics and restaurant signature dishes unique to this city." },
  { icon: "🛍️", title: "Shopping", desc: "Browse local markets, malls, and artisan bazaars for souvenirs and fashion." },
  { icon: "📸", title: "Photography", desc: "Capture stunning architecture, vibrant street scenes, and golden-hour skies." },
];

/**
 * Build a Destination-shaped object from a Tier1City entry.
 * The "highlights" section is powered by the first 4 attractions.
 * The "places" section lists all attractions.
 */
function adaptCity(city: (typeof tier1Cities)[0]): Destination {
  const slug = city.city.toLowerCase();

  // Use up to 4 experiences as "highlights" (the Experience Goa-style gallery blocks)
  const highlights = city.experiences.slice(0, 4).map((exp) => {
    const primaryImage = exp.image;
    // Provide 3 same images so the gallery doesn't break
    const images = [
      exp.image,
      exp.image,
      exp.image,
    ];
    return {
      icon: "📍",
      title: exp.name,
      desc: `Discover ${exp.name}, one of ${city.city}'s most celebrated landmarks.`,
      image: primaryImage,
      images,
    };
  });

  // All experiences mapped to "places" grid cards
  const places = city.experiences.map((exp) => ({
    name: exp.name,
    location: `${city.city}, ${city.state}`,
    image: exp.image,
  }));

  return {
    slug,
    name: city.city,
    region: `India · ${city.state}`,
    tagline: city.description.split(".")[0].trim(), // first sentence as tagline
    heroImage: city.heroImage,
    experienceImages: city.experiences.slice(0, 4).map((a) => a.image),
    description: [city.description, ""],
    highlights,
    places,
    activities: genericActivities,
    experiences: city.experiences, // pass raw experiences through
  };
}

/** Record keyed by lowercase city name — same shape as the original `destinations` record */
export const adaptedCities: Record<string, Destination> = Object.fromEntries(
  tier1Cities.map((city) => [city.city.toLowerCase(), adaptCity(city)])
);
