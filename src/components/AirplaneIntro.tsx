import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE_NAME } from "@/config/site";

interface AirplaneIntroProps {
  onComplete: () => void;
  onFadeComplete: () => void;
}

const FALLBACK_TIMEOUT_MS = 5000;
const BRAND_REVEAL_PROGRESS = 0.60;
const BRAND_CLARIFY_PROGRESS = 0.75;
const TRIGGER_PROGRESS = 0.82;

const AirplaneIntro = ({ onComplete, onFadeComplete }: AirplaneIntroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  
  const hasTriggered = useRef(false);
  const hasBrandRevealed = useRef(false);
  const hasBrandClarified = useRef(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store callbacks in refs so the effect closure always has the latest
  const onCompleteRef = useRef(onComplete);
  const onFadeCompleteRef = useRef(onFadeComplete);
  onCompleteRef.current = onComplete;
  onFadeCompleteRef.current = onFadeComplete;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const brandText = brandTextRef.current;
    if (!video || !container) return;

    // Use GSAP Context for easy cleanup of all animations
    const ctx = gsap.context(() => {
      // Set brand text initial state (invisible, large, very blurred)
      if (brandText) {
        gsap.set(brandText, {
          opacity: 0,
          scale: 1.15,
          filter: "blur(24px)",
          force3D: true,
        });
      }

      // === Ambient Cinematic Motion ===
      if (cameraRef.current) {
        // Camera scale drift
        gsap.to(cameraRef.current, {
          scale: 1.05,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
        
        // Camera vertical pan
        gsap.to(cameraRef.current, {
          y: -20,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }

      if (cloudsRef.current) {
        // Independent cloud drift for parallax
        gsap.to(cloudsRef.current, {
          y: -30,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }

      // === Brand text reveal stages ===
      const revealBrandText = () => {
        if (hasBrandRevealed.current || !brandText) return;
        hasBrandRevealed.current = true;

        // Stage 1: Soft emerge
        gsap.to(brandText, {
          opacity: 0.10,
          scale: 1.10,
          filter: "blur(18px)",
          duration: 3.0,
          ease: "power2.out",
          force3D: true,
        });
      };

      const clarifyBrandText = () => {
        if (hasBrandClarified.current || !brandText) return;
        hasBrandClarified.current = true;

        // Stage 2: Clarify before transition
        gsap.to(brandText, {
          opacity: 0.15,
          scale: 1.08,
          filter: "blur(12px)",
          duration: 2.0,
          ease: "power2.out",
          force3D: true,
        });
      };

      // === Core transition trigger ===
      const triggerTransition = () => {
        if (hasTriggered.current) return;
        hasTriggered.current = true;

        // Clear fallback since we've triggered
        if (fallbackTimer.current) {
          clearTimeout(fallbackTimer.current);
          fallbackTimer.current = null;
        }

        // Remove listener immediately to avoid any further calls
        video.removeEventListener("timeupdate", handleTimeUpdate);

        // Ensure brand text is at least starting to show
        if (!hasBrandRevealed.current) revealBrandText();
        if (!hasBrandClarified.current) clarifyBrandText();

        // Signal hero to begin its reveal immediately
        onCompleteRef.current();

        // Fade out the intro overlay
        gsap.to(container, {
          opacity: 0,
          duration: 1.4,
          ease: "power3.inOut",
          onComplete: () => {
            onFadeCompleteRef.current();
          },
        });
      };

      // === Video progress monitoring ===
      const handleTimeUpdate = () => {
        if (hasTriggered.current) return;
        const { currentTime, duration } = video;

        if (!isFinite(duration) || duration <= 0) return;

        const progress = currentTime / duration;

        // Stage 1: Reveal at 60%
        if (progress >= BRAND_REVEAL_PROGRESS && !hasBrandRevealed.current) {
          revealBrandText();
        }

        // Stage 2: Clarify at 75%
        if (progress >= BRAND_CLARIFY_PROGRESS && !hasBrandClarified.current) {
          clarifyBrandText();
        }

        // Trigger full transition at 82%
        if (progress >= TRIGGER_PROGRESS) {
          triggerTransition();
        }
      };

      // === Fallbacks ===
      const handleEnded = () => triggerTransition();
      const handleError = () => triggerTransition();

      // === Failsafe timeout ===
      fallbackTimer.current = setTimeout(() => {
        if (!hasTriggered.current) {
          triggerTransition();
        }
      }, FALLBACK_TIMEOUT_MS);

      // === Attach listeners ===
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("error", handleError);

      // === Start playback ===
      const playVideo = () => {
        video.play().catch(() => {
          triggerTransition();
        });
      };

      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener("canplay", playVideo, { once: true });
      }

      // Add cleanup for event listeners (GSAP context cleans up animations automatically)
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("error", handleError);
        if (fallbackTimer.current) {
          clearTimeout(fallbackTimer.current);
        }
      };
    }, containerRef);

    // Run GSAP context cleanup function on unmount
    return () => ctx.revert();
  }, []); // Stable — callbacks accessed via refs

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black overflow-hidden pointer-events-none"
    >
      {/* Camera wrapper for cinematic drift */}
      <div ref={cameraRef} className="absolute inset-0 w-full h-full will-change-transform">
        {/* Intro Video Layer */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Light Bloom (Sun Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        {/* Atmospheric Cloud Layers */}
        <div ref={cloudsRef} className="absolute inset-0 pointer-events-none will-change-transform">
          {/* Cloud 1 */}
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[40vh] bg-white/20 blur-md rounded-full transform rotate-12" />
          {/* Cloud 2 */}
          <div className="absolute top-[30%] -right-[15%] w-[60vw] h-[50vh] bg-white/30 blur-md rounded-full transform -rotate-6" />
        </div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Subtle Brand Text — emerges from the scene before transition */}
        <div
          ref={brandTextRef}
          className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none mix-blend-overlay"
        >
          <span className="font-display text-white/80 text-6xl md:text-7xl lg:text-9xl font-black tracking-[0.22em] select-none">
            {SITE_NAME}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AirplaneIntro;