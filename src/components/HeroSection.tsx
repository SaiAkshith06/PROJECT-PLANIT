import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PopularDestinations from "./PopularDestinations";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

const appleEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const HeroSection = ({ introFinished }: { introFinished: boolean }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const brandScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background video — always playing so expansion reveals it */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.75)" }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* PLANIT — single source of truth, no animation, always visible */}
        <motion.h2
          style={{ opacity: brandOpacity, scale: brandScale, x: "-4%" }}
          className="font-display text-white text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.18em] mb-6"
          // Using inline style for combined glow
          // drop-shadow for depth + white glow for sky blending
        >
          <span
            style={{
              filter:
                "drop-shadow(0 6px 30px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(255,255,255,0.25))",
            }}
          >
            {SITE_NAME}
          </span>
        </motion.h2>

        {/* Subtitle — appears after clouds clear */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={introFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: appleEase, delay: 0.4 }}
          className="font-display text-white text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
        >
          {SITE_TAGLINE}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={introFinished ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: appleEase, delay: 0.7 }}
          className="font-body text-white/85 text-lg md:text-xl max-w-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
        >
          Compare hotels, transport, and attractions — all in one place.
          Build your dream itinerary in minutes.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
