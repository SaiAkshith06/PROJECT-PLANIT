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

  const [tripData, setTripData] = useState<any>(null);
  const [loadingTrip, setLoadingTrip] = useState(false);

  // ─── Generate Trip ───
  async function generateTrip() {
    try {
      if (!destination) return;

      setLoadingTrip(true);

      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destination: destination.name,
          days: 3
        })
      });

      const text = await res.text();

      if (!text) {
        throw new Error("Backend returned empty response");
      }

      const data = JSON.parse(text);

      console.log("Trip Data:", data);

      setTripData(data);

    } catch (error) {
      console.error("Trip generation failed:", error);
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
  }, [slug]);

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
            </div>
          </div>
        </div>
      </section>

      {/* GENERATED ITINERARY */}
      {tripData && (
        <section className="dest-section">
          <h2 className="dest-section__title">Generated Itinerary</h2>

          {Object.entries(tripData.day_by_day_itinerary).map(
            ([day, acts]: any) => (
              <div key={day}>
                <h3>{day}</h3>

                {acts.map((a: any, i: number) => (
                  <p key={i}>
                    {a.time} — {a.activity}
                  </p>
                ))}
              </div>
            )
          )}
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