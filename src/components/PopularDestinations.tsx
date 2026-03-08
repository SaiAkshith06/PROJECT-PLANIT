import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import destGoa from "@/assets/dest-goa.jpg";
import destManali from "@/assets/dest-manali.jpg";
import destKerala from "@/assets/dest-kerala.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destParis from "@/assets/dest-paris.jpg";

const destinations = [
  { name: "Goa", country: "India", image: destGoa, rating: 4.7, price: "₹15,000" },
  { name: "Manali", country: "India", image: destManali, rating: 4.6, price: "₹12,000" },
  { name: "Kerala", country: "India", image: destKerala, rating: 4.8, price: "₹18,000" },
  { name: "Bali", country: "Indonesia", image: destBali, rating: 4.9, price: "₹45,000" },
  { name: "Paris", country: "France", image: destParis, rating: 4.8, price: "₹85,000" },
];

const PopularDestinations = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Discover trending travel spots loved by adventurers worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 80, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
              onClick={() => navigate(`/planner?dest=${dest.name}&days=3&budget=50000`)}
              className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <motion.img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold text-foreground">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">{dest.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-3 h-3" />
                  {dest.country}
                </div>
                <p className="text-sm font-semibold text-primary">From {dest.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
