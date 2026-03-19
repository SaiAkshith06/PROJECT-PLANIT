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

  // Set up continuous ambient loops immediately — hero is always alive
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background subtle zoom breathing (always running)
      gsap.to(bgVideoRef.current, {
        scale: 1.03,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      // Fog atmospheric drift
      gsap.to(overlayRef.current, {
        x: 20,
        y: 20,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      gsap.to(overlayRef.current, {
        opacity: 0.35,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      
      // Brand text slow independent float
      gsap.to(brandRef.current, {
        y: -4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Intro → Hero transition: synchronized with intro fade
  useLayoutEffect(() => {
    if (!introFinished) return;

    const ctx = gsap.context(() => {
      // Text starts hidden with blur
      gsap.set([brandRef.current, titleRef.current, textRef.current], {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
        force3D: true,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Background: brightness lift + subtle scale settle (overlaps intro fade)
      tl.to(bgVideoRef.current, {
        filter: "brightness(0.85)",
        scale: 1,
        duration: 1.6,
        ease: "power3.out",
        force3D: true,
      }, 0)

      // Overlay softens simultaneously
      .to(overlayRef.current, {
        opacity: 0.25,
        duration: 1.6,
        ease: "power3.out",
        force3D: true,
      }, 0)

      // Brand — appears while intro is still fading (tight overlap)
      .to(brandRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        force3D: true,
      }, 0.15)
      .fromTo(brandRef.current,
        { letterSpacing: "0.30em" },
        { letterSpacing: "0.22em", duration: 1.8, ease: "power2.out" },
        "<"
      )

      // Tagline — overlaps with brand reveal
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        force3D: true,
      }, 0.35)

      // Description — overlaps with tagline
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        force3D: true,
      }, 0.55)

      // Content breathing float (begins as text settles)
      .add(() => {
        gsap.to(contentWrapperRef.current, {
          y: -6,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }, 1.2);

    }, sectionRef);

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Background Video Layer — always visible, starts dimmed */}
      <motion.div
        ref={bgVideoRef}
        className="absolute inset-0 z-0"
        style={{ y, filter: "brightness(0.6)", transform: "scale(1.05)" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 dark:brightness-75 dark:contrast-105"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark Mode Background Dimmer */}
        <div className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))' }} />

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
        {/* ATMOSPHERIC LIGHT BLOOM */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] bg-white/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        {/* BRAND */}
        <motion.h2
          ref={brandRef}
          style={{ opacity: brandOpacity, scale: brandScale }}
          className="relative font-display text-white text-6xl md:text-7xl lg:text-9xl font-black tracking-[0.22em] mb-10 will-change-transform"
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

      {/* Dark Mode Hero bottom fade to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 z-20 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700" style={{ background: 'linear-gradient(to bottom, rgba(11,15,25,0), rgba(11,15,25,1))' }} />
    </section>
  );
};

export default HeroSection;
