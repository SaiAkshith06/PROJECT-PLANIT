import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tier1Cities } from "@/data/tier1Cities";

interface Location {
  lat: number;
  lng: number;
}

interface DestinationScrollerProps {
  onDestinationClick?: (location: Location) => void;
}

export default function DestinationScroller({ onDestinationClick }: DestinationScrollerProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const handleCardClick = (city: (typeof tier1Cities)[0]) => {
    if (onDestinationClick) {
      onDestinationClick({ lat: city.coordinates[0], lng: city.coordinates[1] });
    }
    navigate(`/destination/${city.city.toLowerCase()}`);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight mb-2">
              Trending Destinations
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Scroll to explore India's most loved metro cities
            </p>
          </div>

          {/* Arrow buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel wrapper with edge fades */}
        <div className="relative">
          {/* Left fade */}
          <div className="hidden md:block absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="hidden md:block absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Horizontal scroll track */}
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-8 w-max pb-4">
              {tier1Cities.map((city) => (
                <div
                  key={city.city}
                  onClick={() => handleCardClick(city)}
                  className="snap-center group relative w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer transition-all duration-500 hover:scale-[1.06] hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image from Unsplash */}
                  <img
                    src={city.heroImage}
                    alt={city.city}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Text */}
                  <div className="absolute bottom-5 left-5">
                    <h3 className="font-display text-white text-xl font-semibold">
                      {city.city}
                    </h3>
                    <p className="text-white/80 text-sm">{city.state}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}