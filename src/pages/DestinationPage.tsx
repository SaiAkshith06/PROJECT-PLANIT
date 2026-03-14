import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { destinations } from "../data/destinations";
import ExperienceGallery from "../components/ExperienceGallery";
import "../styles/destination-page.css";

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const discoverRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const destination = slug ? destinations[slug.toLowerCase()] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // ─── Animations Observer ───
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const animEls = document.querySelectorAll(".dest-fade-up, .dest-slide-in, .dest-stagger-item");
    animEls.forEach((el) => observer.observe(el));

    // ─── Parallax Logic ───
    const handleScroll = () => {
      const scrolled = window.scrollY;

      if (heroRef.current) {
        // Subtle parallax and scale on background
        const bg = heroRef.current.querySelector(".dest-hero__bg img") as HTMLElement;
        if (bg) {
          bg.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled * 0.0005})`;
        }
      }

      // Parallax for decorative orbs
      const orbs = document.querySelectorAll(".dest-light-orb");
      orbs.forEach((orb) => {
        const speed = 0.15;
        (orb as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
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

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white gap-6">
        <p className="text-6xl">🗺️</p>
        <h1 className="text-3xl font-bold tracking-tight">Destination not found</h1>
        <p className="text-white/50 text-sm">
          We don't have a page for <strong>"{slug}"</strong> yet.
        </p>
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
      {/* ═══════ HERO ═══════ */}
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
          <span className="dest-scroll-indicator__text">Scroll</span>
          <ChevronDown className="dest-scroll-indicator__arrow" />
        </button>
      </section>

      {/* ═══════ DISCOVER ═══════ */}
      <section
        className="dest-section"
        ref={(el: HTMLElement | null) => { discoverRef.current = el; }}
      >
        <div className="dest-light-orb" />
        <div className="dest-discover-layout">
          <div className="dest-discover-content">
            <div className="dest-fade-up">
              <span className="dest-section__label">About</span>
              <h2 className="dest-section__title">Discover {destination.name}</h2>
            </div>

            <div className="dest-discover">
              <div className="dest-fade-up" style={{ transitionDelay: "0.2s" }}>
                {destination.description.map((para, i) => (
                  <p
                    key={i}
                    className="dest-discover__text"
                    style={{ marginTop: i > 0 ? "2rem" : "3rem" }}
                  >
                    {para}
                  </p>
                ))}
              </div>

            </div>
          </div>

          <div className="dest-plan-card-container dest-slide-in">
            <div className="dest-plan-card">
              <h3 className="dest-plan-card__title">Ready to explore {destination.name}?</h3>
              <p className="dest-plan-card__desc">
                Get a personalized itinerary including hotels, transport, and the best local spots.
              </p>
              <button
                className="dest-cta__button"
                onClick={() => navigate("/planner")}
              >
                Plan Your Trip
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EXPERIENCE (UNIFIED) ═══════ */}
      <section className="dest-section" style={{ paddingTop: 0 }}>
        <div className="dest-fade-up">
          <span className="dest-section__label">Immersion</span>
          <h2 className="dest-section__title">Experience {destination.name}</h2>
        </div>

        <div className="dest-experience-unified">
          {destination.highlights.map((h, i) => (
            <div key={i} className={`dest-experience-block ${i % 2 === 1 ? 'reverse' : ''} dest-fade-up`}>
              <div className="dest-experience-block__image-wrap">
                <ExperienceGallery
                  images={h.images}
                  fallback={h.image}
                  alt={h.title}
                />
              </div>
              <div className="dest-experience-block__content">
                <div className="dest-experience-block__divider" />
                <h3 className="dest-experience-block__title">{h.title}</h3>
                <p className="dest-experience-block__desc">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TOP PLACES ═══════ */}
      <section className="dest-section">
        <div className="dest-fade-up">
          <span className="dest-section__label">Explore</span>
          <h2 className="dest-section__title">Top Places</h2>
        </div>

        <div className="dest-places-grid">
          {destination.places.map((place, i) => (
            <div key={i} className="dest-place-card dest-stagger-item">
              <img
                src={place.image}
                alt={place.name}
                className="dest-place-card__image"
                loading="lazy"
              />
              <div className="dest-place-card__overlay" />
              <div className="dest-place-card__content">
                <h3 className="dest-place-card__name">{place.name}</h3>
                <span className="dest-place-card__location">{place.location}</span>
              </div>
              <div className="dest-place-card__arrow">
                <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ THINGS TO DO ═══════ */}
      <section className="dest-section">
        <div className="dest-fade-up">
          <span className="dest-section__label">Experiences</span>
          <h2 className="dest-section__title">Things To Do</h2>
        </div>

        <div className="dest-activities-grid">
          {destination.activities.map((a, i) => (
            <div key={i} className="dest-activity-card dest-stagger-item">
              <span className="dest-activity-card__icon">{a.icon}</span>
              <h3 className="dest-activity-card__title">{a.title}</h3>
              <p className="dest-activity-card__desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


export default DestinationPage;
