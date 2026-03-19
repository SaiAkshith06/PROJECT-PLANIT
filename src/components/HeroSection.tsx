import { useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

const HeroSection = ({ introFinished }: { introFinished: boolean }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll animations (keep as-is)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const brandScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);

  useLayoutEffect(() => {
    if (!introFinished) return;

    const ctx = gsap.context(() => {
      // ✅ INITIAL STATE (PREMIUM START)
      gsap.set(bgVideoRef.current, {
        opacity: 1,
        scale: 1.08,
        filter: "brightness(0.4) blur(4px)",
      });

      gsap.set(overlayRef.current, {
        opacity: 0.8,
        x: -20,
      });

      // Soft Reveal Setup (Blur + Opacity + Position)
      gsap.set([brandRef.current, titleRef.current, textRef.current], {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // 🎬 1. IMMERSIVE ENVIRONMENT REVEAL
      tl.to(bgVideoRef.current, {
        scale: 1,
        filter: "brightness(0.85) blur(0px)",
        duration: 2.8,
        ease: "power2.inOut",
      }, 0)
      .to(overlayRef.current, {
        opacity: 0.3,
        x: 0,
        duration: 3,
        ease: "power2.inOut",
      }, 0)

      // ✨ 2. PREMIUM TEXT REVEAL (Blur -> Sharp)
      .to(brandRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.8,
      }, 0.4)
      .fromTo(brandRef.current, 
        { letterSpacing: "0.38em" }, 
        { letterSpacing: "0.22em", duration: 2, ease: "power2.out" }, 
        0.4
      )
      .to([titleRef.current, textRef.current], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.25,
        duration: 1.6,
      }, 0.8)

      // 🎡 3. CONTINUOUS FLOATING LOOPS (Apple-like life)
      // Background subtle zoom oscillation
      gsap.to(bgVideoRef.current, {
        scale: 1.03,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Fog slow horizontal drift
      gsap.to(overlayRef.current, {
        x: 30,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Text content gentle float
      gsap.to(contentWrapperRef.current, {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Background Video Layer */}
      <motion.div
        ref={bgVideoRef}
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Fog Overlay - Dynamic Layer */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/90 via-black/30 to-black/80 backdrop-blur-[2px] pointer-events-none scale-110"
        />
      </motion.div>

      {/* Hero Content Layer */}
      <motion.div
        ref={contentWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* BRAND */}
        <motion.h2
          ref={brandRef}
          style={{ opacity: brandOpacity, scale: brandScale }}
          className="font-display text-white text-6xl md:text-7xl lg:text-9xl font-black tracking-[0.22em] mb-10 will-change-transform"
        >
          <span className="drop-shadow-[0_10px_50px_rgba(0,0,0,0.9)]">
            {SITE_NAME}
          </span>
        </motion.h2>

        {/* TAGLINE */}
        <motion.h1
          ref={titleRef}
          className="font-display text-white text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] will-change-transform"
        >
          {SITE_TAGLINE}
        </motion.h1>

        {/* DESCRIPTION */}
        <p
          ref={textRef}
          className="font-body text-white/85 text-lg md:text-xl max-w-2xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] px-4 leading-relaxed will-change-transform"
        >
          Compare hotels, transport, and attractions — all in one place.
          <br className="hidden md:block" />
          Build your dream itinerary in minutes.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
