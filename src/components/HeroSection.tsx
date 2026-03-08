import { motion } from "framer-motion";
import heroImage from "@/assets/hero-travel.jpg";
import { useState } from "react";

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="absolute inset-0">
        {/* Fallback image shown until video loads */}
        {!videoLoaded && (
          <img src={heroImage} alt="Travel destination" className="w-full h-full object-cover" />
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
        >
          {/* 4K nature/travel video streamed from CDN */}
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
      </div>

      <div className="relative container mx-auto px-4 py-32 md:py-44 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-6"
          style={{ color: "white" }}
        >
          Plan Your Perfect Trip
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Compare hotels, transport, and attractions — all in one place.
          Build your dream itinerary in minutes.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
