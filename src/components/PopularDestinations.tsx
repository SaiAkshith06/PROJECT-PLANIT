import { motion } from "framer-motion";
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

  return (
    <section className="py-20 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => navigate(`/planner?dest=${dest.name}&days=3&budget=50000`)}
              className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
