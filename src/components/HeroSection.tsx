import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  introComplete?: boolean;
}

const HeroSection = ({ introComplete = false }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  // Start hero video only after intro finishes
  useEffect(() => {
    if (introComplete && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [introComplete]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative pt-16 overflow-hidden min-h-screen"
    >
      {/* Background video */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>

        <video
          style={{ filter: "brightness(0.9)" }}
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/10" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="relative container mx-auto px-4 py-32 md:py-44 text-center z-10"
        style={{ y: textY, opacity }}
      >
       <motion.h1
  className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-6 text-white flex justify-center flex-wrap"
>
  {"Plan Your Perfect Trip".split("").map((char, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 40 }}
      animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        delay: 0.3 + 0.03 * i,
        duration: 0.5,
        ease: "easeOut"
      }}
      style={{ display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/85"
        >
          Compare hotels, transport, and attractions — all in one place.
          Build your dream itinerary in minutes.
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;