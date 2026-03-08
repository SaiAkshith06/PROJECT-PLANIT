import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2023/07/22/173039-847612547_large.mp4" type="video/mp4" />
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
