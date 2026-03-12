import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import destGoa from "@/assets/dest-goa.jpg";
import destManali from "@/assets/dest-manali.jpg";
import destKerala from "@/assets/dest-kerala.jpg";
import destJaipur from "@/assets/dest-bali.jpg";
import destLadakh from "@/assets/dest-paris.jpg";

const destinations = [
  { name: "Goa", country: "India", image: destGoa },
  { name: "Manali", country: "India", image: destManali },
  { name: "Kerala", country: "India", image: destKerala },
  { name: "Jaipur", country: "India", image: destJaipur },
  { name: "Ladakh", country: "India", image: destLadakh },
];

export default function DestinationScroller() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

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
              Scroll to explore the most loved places across India
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
              {destinations.map((dest) => (
                <div
                  key={dest.name}
                  onClick={() =>
                    navigate(`/destination/${dest.name.toLowerCase()}`)
                  }
                  className="snap-center group relative w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-lg flex-shrink-0 cursor-pointer transition-all duration-500 hover:scale-[1.06] hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Text */}
                  <div className="absolute bottom-5 left-5">
                    <h3 className="font-display text-white text-xl font-semibold">
                      {dest.name}
                    </h3>
                    <p className="text-white/80 text-sm">{dest.country}</p>
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