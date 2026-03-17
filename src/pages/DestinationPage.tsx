import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { adaptedCities } from "../data/tier1CitiesAdapter";
import ExperienceCarousel from "../components/ExperienceCarousel";
import "../styles/destination-page.css";

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const discoverRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const destination = slug ? adaptedCities[slug.toLowerCase()] : null;

  const [itinerary, setItinerary] = useState<any>(null);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("[DEBUG] Current Itinerary State:", itinerary);

  // ─── Generate Trip ───
  async function generateTrip() {
    try {
      if (!destination) return;

      setLoadingTrip(true);
      setError(null);

      console.log("[FRONTEND] Sending request to http://127.0.0.1:5001/api/itinerary...");
      const res = await fetch("http://127.0.0.1:5001/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destination: destination.name,
          days: 3
        })
      });

      console.log(`[FRONTEND] Response received. Status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[FRONTEND] Server error body: ${errorText}`);
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("[FRONTEND] Itinerary JSON:", data);

      if (!data || !data.day_by_day_itinerary) {
        throw new Error("Invalid itinerary data format received from backend");
      }

      setItinerary(data);

    } catch (err: any) {
      console.error("[FRONTEND] Error in generateTrip:", err);
      setError(err.message || "Failed to generate itinerary. Check console for details.");
    } finally {
      setLoadingTrip(false);
    }
  }

  // ─── Animations / Parallax ───
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const animEls = document.querySelectorAll(
      ".dest-fade-up, .dest-slide-in, .dest-stagger-item"
    );

    animEls.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const scrolled = window.scrollY;

      if (heroRef.current) {
        const bg = heroRef.current.querySelector(
          ".dest-hero__bg img"
        ) as HTMLElement;

        if (bg) {
          bg.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 +
            scrolled * 0.0005})`;
        }
      }

      const orbs = document.querySelectorAll(".dest-light-orb");

      orbs.forEach((orb) => {
        const speed = 0.15;
        (orb as HTMLElement).style.transform = `translateY(${scrolled *
          speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slug, itinerary]); // 🔹 Added itinerary as dependency to observe new elements

  const scrollToContent = () => {
    discoverRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Destination not found ───
  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white gap-6">
        <h1 className="text-3xl font-bold">Destination not found</h1>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-8 py-3 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="dest-page">

      {/* HERO */}
      <section className="dest-hero" ref={heroRef}>
        <div className="dest-hero__bg">
          <img
            src={destination.heroImage}
            alt={`${destination.name} hero`}
            loading="eager"
          />
        </div>

        <div className="dest-hero__overlay" />

        <div className="dest-hero__content">
          <span className="dest-hero__subtitle">{destination.region}</span>
          <h1 className="dest-hero__title">{destination.name.toUpperCase()}</h1>
          <p className="dest-hero__tagline">{destination.tagline}</p>
        </div>

        <button
          className="dest-scroll-indicator"
          onClick={scrollToContent}
          aria-label="Scroll down"
        >
          <span>Scroll</span>
          <ChevronDown />
        </button>
      </section>

      {/* DISCOVER */}
      <section
        className="dest-section"
        ref={(el) => (discoverRef.current = el)}
      >
        <div className="dest-discover-layout">
          <div className="dest-discover-content">
            <span className="dest-section__label">About</span>

            <h2 className="dest-section__title">
              Discover {destination.name}
            </h2>

            {destination.description.map((p, i) => (
              <p key={i} className="dest-discover__text">
                {p}
              </p>
            ))}
          </div>

          {/* PLAN CARD */}
          <div className="dest-plan-card-container">
            <div className="dest-plan-card">
              <h3>Ready to explore {destination.name}?</h3>

              <p>
                Get a personalized itinerary including hotels and the best
                local spots.
              </p>

              <button
                className="dest-cta__button"
                onClick={generateTrip}
                disabled={loadingTrip}
              >
                {loadingTrip ? "Generating..." : "Plan Your Trip"}
                <ArrowUpRight size={18} />
              </button>

              {error && (
                <p className="mt-4 text-red-500 text-xs font-medium text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GENERATED ITINERARY */}
      {itinerary && (
        <section className="dest-section bg-zinc-950/30 py-20 border-y border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="dest-section__label mb-2 block">Personalized</span>
                <h2 className="dest-section__title mb-0">Your Epic Itinerary</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-white/20" />
                <span className="text-white/40 text-sm font-medium tracking-widest uppercase">
                  {destination.name}
                </span>
              </div>
            </div>

            {/* Check if itinerary has days */}
            {(!itinerary.day_by_day_itinerary || Object.keys(itinerary.day_by_day_itinerary).length === 0) ? (
              <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10">
                <p className="text-white/40 font-medium">No itinerary activities found for this destination.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(itinerary.day_by_day_itinerary).map(([day, activities]: [string, any]) => (
                  <div key={day} className="relative dest-fade-up">
                    {/* Vertical Line Connector */}
                    <div className="absolute left-6 top-10 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent hidden md:block" />
                    
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Day Sidebar */}
                      <div className="md:w-32 flex-shrink-0 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                          {day.split(' ')[1] || "—"}
                        </div>
                        <div className="pt-2">
                          <h3 className="text-white text-xl font-display font-bold whitespace-nowrap">{day}</h3>
                          <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Exploration</span>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 space-y-6">
                        {(activities || []).map((activity: any, i: number) => (
                          <div 
                            key={i} 
                            className="group relative bg-[#121212] border border-white/5 hover:border-white/10 p-6 rounded-[2rem] transition-all duration-500 hover:translate-x-2"
                          >
                            <div className="flex flex-col md:flex-row gap-6">
                              {/* Image Container */}
                              {activity.image && (
                                <div className="md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                                  <img 
                                    src={activity.image} 
                                    alt={activity.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/5">
                                    {activity.time_slot || activity.time || "Scheduled"}
                                  </span>
                                  {activity.category && (
                                    <span className="text-blue-400/60 text-[10px] uppercase tracking-widest font-bold">
                                      • {activity.category}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-white text-lg font-display font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                  {activity.name}
                                </h4>
                                <p className="text-white/50 text-xs leading-relaxed max-w-md">
                                  {activity.activity || `Discover the iconic landmarks and hidden gems of ${activity.name}.`}
                                </p>
                              </div>

                              {/* Decorative Accent */}
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <ArrowUpRight size={24} className="text-white/20" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Extra Info: Hotels & Restaurants */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 dest-fade-up">
              {/* Hotel Section Preview */}
              <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                <h4 className="text-white font-bold mb-6 flex items-center gap-3 italic">
                  <span className="block w-2 h-2 rounded-full bg-blue-500" />
                  Recommended Stay
                </h4>
                {itinerary.hotels && itinerary.hotels[0] ? (
                  <div className="flex gap-4">
                    <img src={itinerary.hotels[0].image} className="w-20 h-20 rounded-2xl object-cover" alt="Hotel" />
                    <div>
                      <h5 className="text-white font-semibold">{itinerary.hotels[0].name}</h5>
                      <p className="text-white/40 text-xs mt-1 italic">Premium Hotel Selection</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/30 text-xs italic">Looking for the perfect stay...</p>
                )}
              </div>

              {/* Dining Section Preview */}
              <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10">
                <h4 className="text-white font-bold mb-6 flex items-center gap-3 italic">
                  <span className="block w-2 h-2 rounded-full bg-blue-500" />
                  Local Flavors
                </h4>
                {itinerary.restaurants && itinerary.restaurants.length > 0 ? (
                  <>
                    <div className="flex -space-x-4">
                      {itinerary.restaurants.slice(0, 3).map((r: any, idx: number) => (
                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-zinc-950 overflow-hidden bg-zinc-800">
                          <img src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} className="w-full h-full object-cover" alt="Rest" />
                        </div>
                      ))}
                      {itinerary.restaurants.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-zinc-950 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                          +{itinerary.restaurants.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-4 italic">Top rated local restaurants included in your plan.</p>
                  </>
                ) : (
                  <p className="text-white/30 text-xs italic">Sourcing the best culinary spots...</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      <section className="dest-section">
        <span className="dest-section__label">Immersion</span>

        <h2 className="dest-section__title">
          Iconic Experiences
        </h2>

        <ExperienceCarousel experiences={destination.experiences} />
      </section>

    </div>
  );
};

export default DestinationPage;