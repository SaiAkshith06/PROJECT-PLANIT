import { useRef, useLayoutEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionStyle } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";

/**
 * 1 & 6. Fullscreen Cinematic Hero
 * Ensures only the hero is visible on first load (100vh).
 * Centered content with zero atmospheric leaks to following sections.
 */
const HeroSection = ({ introFinished }: { introFinished: boolean }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const bgInnerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [isIntroAnimationDone, setIsIntroAnimationDone] = useState(false);

  // 8. Parallax & Fade (Simplified for Clean Scene)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const isFramerGo = introFinished && isIntroAnimationDone;

  useLayoutEffect(() => {
    if (!introFinished) return;

    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, textRef.current], {
        opacity: 0,
        y: 30,
        filter: "blur(15px)",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([titleRef.current, textRef.current, contentWrapperRef.current], {
            clearProps: "filter,transform"
          });
          setIsIntroAnimationDone(true);
        }
      });

      tl.fromTo(bgInnerRef.current, 
        { scale: 1.05 },
        { scale: 1, duration: 2.5, ease: "power2.out" },
        0
      )
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "power4.out",
      }, 0.5)
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "power4.out",
      }, 0.8);

    }, sectionRef);

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* 2 & 8. Background Video Parallax Control */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: videoY, scale: videoScale }}
      >
        <div ref={bgInnerRef} className="absolute inset-0 w-full h-full">
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
          
          <div className="absolute inset-0 bg-black/45 z-[1]" />
        </div>
      </motion.div>

      {/* 4. Removed all Fog/Fade/Blur transitions to keep the scene isolated */}

      {/* Soft Ambient Glow Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_60%)]" />

      {/* 6. Cinematic Centered Hero Content */}
      <motion.div
        ref={contentWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center text-center h-full w-full px-6"
        style={{ 
          opacity: isFramerGo ? contentOpacity : (introFinished ? 1 : 0), 
          y: isFramerGo ? contentY : 0,
          backfaceVisibility: "hidden",
        } as MotionStyle}
      >
        <div className="flex flex-col items-center max-w-4xl">
          <motion.h1
            ref={titleRef}
            className="font-display text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-[1.1]"
          >
            Plan Your Perfect Trip
          </motion.h1>

          <motion.p
            ref={textRef}
            className="font-body text-white/85 text-xl md:text-2xl max-w-2xl px-4 leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          >
            Compare hotels, transport, and attractions — all in one place.
          </motion.p>
        </div>
      </motion.div>

      {/* 7. Animated Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroAnimationDone ? 1 : 0 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
        <ChevronDown className="w-4 h-4 text-white/40" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
