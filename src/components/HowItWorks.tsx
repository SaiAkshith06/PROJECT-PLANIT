import { useRef } from "react";
import { MapPin, BarChart3, CalendarCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    icon: MapPin,
    title: "Enter Destination",
    desc: "Tell us where you want to go, how many days, and your budget.",
  },
  {
    icon: BarChart3,
    title: "Compare Options",
    desc: "Browse curated hotels, transport modes, and attractions side by side.",
  },
  {
    icon: CalendarCheck,
    title: "Build Your Itinerary",
    desc: "Get a day-by-day plan tailored to your preferences and budget.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.4"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-14"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <s.icon className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
