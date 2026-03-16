import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Experience } from "@/data/tier1Cities";

interface ExperienceCarouselProps {
  experiences: Experience[];
}

export default function ExperienceCarousel({ experiences }: ExperienceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320; // Approx card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="relative w-full py-8">
      {/* Navigation Arrows */}
      <div className="absolute right-0 -top-12 hidden md:flex gap-2">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Edge Fades for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experiences.map((exp) => (
          <div
            key={exp.name}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="w-full aspect-[4/3] overflow-hidden relative">
              <img
                src={exp.image}
                alt={exp.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Location Badge */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-medium text-white/90 tracking-wide uppercase">
                  {exp.location}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 font-display leading-tight">
                {exp.name}
              </h3>
              <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
