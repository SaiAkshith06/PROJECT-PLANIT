import { useRef, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tier1Cities } from "@/data/tier1Cities";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/providers/ThemeProvider";

gsap.registerPlugin(ScrollTrigger);

export default function DestinationScroller() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const indiaCardRef = useRef<HTMLDivElement>(null);
  
  // Track refs for each individual city card
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  cardsRef.current = new Array(tier1Cities.length).fill(null);
  
  const [isInteractive, setIsInteractive] = useState(false);
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === 'class') setIsDark(root.classList.contains('dark'));
      });
    });
    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, [theme]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current || !isInteractive) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, [isInteractive]);

  const handleCardClick = (city: (typeof tier1Cities)[0]) => {
    if (!isInteractive) return; // Prevent clicks while GSAP is animating/scrubbing
    navigate(`/destination/${city.city.toLowerCase()}`);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%", // Fast, natural trigger point
          once: true, // Only plays once to feel explosive and sharp
        },
        onStart: () => setIsInteractive(false),
        onComplete: () => setIsInteractive(true),
      });

      // Animation configuration array for center-spread effect
      // 0=Mumbai, 1=Delhi, 2=Bengaluru, 3=Hyderabad, 4=Chennai, 5=Kolkata
      const xOffsets = [300, 150, 40, -40, -150, -300]; 
      const yOffsets = [20, 10, 0, 0, 10, 20]; // Creates a subtle opening arc

      // Pre-set city cards completely hidden and compressed inward
      gsap.set(cardsRef.current, {
        opacity: 0,
        scale: 0.85,
        x: (index) => xOffsets[index] || 0,
        y: (index) => yOffsets[index] || 0,
        force3D: true,
      });

      // Step 1: Anticipation (India card compresses building tension)
      tl.to(indiaCardRef.current, {
        scale: 0.9,
        duration: 0.3,
        ease: "power2.inOut",
        force3D: true,
      });

      // Step 2 & 3: Simultaneous execution of India card exit and City cards controlled expansion
      tl.to(indiaCardRef.current, {
        scale: 0.7,
        opacity: 0,
        duration: 0.6,
        ease: "expo.inOut",
        force3D: true,
      });

      tl.to(cardsRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        stagger: 0.12, // Wave-like sequence
        duration: 1.2, // Slower, more elegant motion
        ease: "back.out(1.2)", // Subtle overshoot + settle effect (The Soft Bounce)
        force3D: true,
      }, "-=0.45"); // Deep overlap for a fluid transition

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Removed complex 3D hover logic to implement the clean, premium UI CSS float specification
  return (
    <section 
      ref={sectionRef} 
      className="py-24 w-full relative overflow-hidden transition-colors duration-300" 
      style={{ background: isDark ? 'linear-gradient(to bottom, #0B0F19, #111827)' : 'linear-gradient(to bottom, #F8FAFC, #EEF2F7)' }}
    >
      {/* Ambient center radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300" 
        style={{ background: `radial-gradient(circle at center, ${isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)'}, transparent 70%)` }} 
      />
      
      {/* Header section */}
      <div className="w-full max-w-7xl mx-auto px-6 flex-shrink-0 z-10 relative">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 
              className={`font-display text-4xl font-semibold tracking-wide mb-2 transition-colors duration-300 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}
              style={{ textShadow: isDark ? '0 1px 10px rgba(0,0,0,0.4)' : '0 1px 0 rgba(255,255,255,0.5)' }}
            >
              Trending Destinations
            </h2>
            <p className={`font-body text-lg transition-colors duration-300 ${isDark ? 'text-[#9CA3AF]' : 'text-[#475569]'}`}>
              Scroll to explore India's most loved metro cities
            </p>
          </div>

          {/* Arrow buttons - hidden until interactive */}
          <div className={`hidden md:flex gap-2 transition-opacity duration-500 ${isInteractive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
      </div>

      {/* Interactive area */}
      <div className="relative w-full h-[450px]">
        {/* Initial India Card Profile (Centered) */}
        <div 
          ref={indiaCardRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
        >
          <div className="w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" 
              alt="Discover India"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-white/90 text-xl font-medium tracking-widest uppercase mb-2">
                Discover
              </span>
              <h3 className="font-display text-white text-6xl font-black tracking-widest drop-shadow-lg">
                INDIA
              </h3>
            </div>
          </div>
        </div>

        {/* Custom horizontal scroll container for City Cards */}
        <div className="absolute inset-0">
          <div 
            ref={scrollRef}
            className="w-full h-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory px-[calc(50vw-160px)] md:px-0 md:pl-[calc((100vw-1280px)/2+24px)]"
            style={{ 
              scrollbarWidth: "none", 
              pointerEvents: isInteractive ? "auto" : "none" 
            }}
          >
            <div className="flex gap-8 w-max pb-4 h-full items-center px-4 md:px-0">
              {tier1Cities.map((city, i) => (
                <div
                  key={city.city}
                  ref={(el) => (cardsRef.current[i] = el)}
                  onClick={() => handleCardClick(city)}
                  className="snap-center group relative w-[320px] h-[420px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[20px]"
                  style={{ 
                    backgroundColor: isDark ? '#111827' : 'transparent',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    boxShadow: isDark 
                      ? '0 20px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3)' 
                      : '0 12px 30px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
                    transition: 'all 0.35s ease',
                    willChange: 'transform, opacity', 
                    transform: 'translateZ(0)' 
                  }}
                  onMouseEnter={(e) => {
                    if (isInteractive) e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (isInteractive) e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <img
                    src={city.heroImage}
                    alt={city.city}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.7), rgba(15,23,42,0.15), transparent)' }}
                  />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="font-display text-white text-2xl font-semibold mb-1">
                      {city.city}
                    </h3>
                    <p className="text-white/80 font-medium">{city.state}</p>
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