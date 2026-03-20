import { useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tier1Cities } from "@/data/tier1Cities";
import "../styles/hyderabad.css";

gsap.registerPlugin(ScrollTrigger);

const HyderabadPage = () => {

  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cityData = tier1Cities.find((c) => c.city === "Hyderabad");
  if (!cityData) return null;

  // HERO SCROLL
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  // HERO GSAP
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo(".hero-label", { opacity: 0, y: 40 }, { opacity: 0.5, y: 0, duration: 2 })
        .fromTo(".hero-title", { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 2 }, "-=1.5")
        .fromTo(".hero-tagline", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2 }, "-=1.5");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-black min-h-screen text-white overflow-x-hidden">

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: videoScale, y: heroY }}>
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/hyderabad.mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center">
          <span className="hero-label text-xs tracking-[0.6em] opacity-0">HYDERABAD • TELANGANA</span>
          <h1 className="hero-title text-[clamp(4rem,12vw,9rem)] font-thin tracking-[0.4em] mb-8">
            HYDERABAD
          </h1>
          <p className="hero-tagline text-white/50 italic opacity-0">
            Where the scent of pearls meets the whispers of the Nizams.
          </p>
        </motion.div>
      </section>

      {/* DISCOVERY / MIDDLE SECTION */}
      <section className="relative py-32 md:py-48 px-6 md:px-20 bg-gradient-to-b from-[#020617] to-black overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* CONTENT - LEFT */}
          <div className="flex flex-col items-start">
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight leading-tight text-white mb-8">
              The City of <br />
              <span className="italic text-white/40 font-thin">Thousand Stories.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-xl font-light">
              Hyderabad is a portal between eras. From the chaotic charm of the Old City 
              to the shimmering glass of Hitech City, it offers a sensory journey unlike any other.
            </p>

            <button className="px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all duration-300 hover:px-12 active:scale-95 shadow-2xl">
              Explore the Heritage
            </button>
          </div>

          {/* IMAGE CARD - RIGHT */}
          <div className="relative group w-full aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
            <img
              src="https://images.unsplash.com/photo-1618349141977-167e4115f532?q=80&w=2000"
              alt="Hyderabad Heritage"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Dark Fade Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-[40px] md:rounded-[60px] pointer-events-none" />
          </div>

        </div>
      </section>

      {/* EXPERIENCES - HORIZONTAL SCROLL */}
      <section className="py-20 relative bg-black overflow-hidden">
        <div className="px-10 mb-12 max-w-7xl mx-auto">
          <h2 className="text-5xl font-thin tracking-widest text-white/90">
            LEGENDARY <span className="italic text-white/40">ARCHIVES</span>
          </h2>
        </div>

        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-8 px-10 pb-20">
          {cityData.experiences.map((exp) => (
            <div
              key={exp.name}
              className="group relative flex-none w-[280px] md:w-[350px] aspect-[3/4] rounded-[30px] overflow-hidden snap-center cursor-pointer transition-all duration-700 ease-out hover:-translate-y-4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 hover:border-white/20"
            >
              <img
                src={exp.image}
                alt={exp.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-light tracking-wider text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 italic">
                  {exp.name}
                </h3>
              </div>
              
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          ))}
          {/* Spacer to maintain padding on right */}
          <div className="flex-none w-10 md:w-20" />
        </div>
      </section>

    </div>
  );
};

export default HyderabadPage;