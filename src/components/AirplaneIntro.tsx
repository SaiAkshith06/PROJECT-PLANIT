import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AirplaneIntroProps {
  onComplete: () => void;
}

const AirplaneIntro = ({ onComplete }: AirplaneIntroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Timeline for the intro sequence
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    const startAnimation = () => {
      // 1. Video stays visible for a few seconds
      // 2. Video fades out revealing Hero underneath
      tl.to(video, {
        opacity: 0,
        scale: 1.05,
        duration: 1.6,
        delay: 2.2, // Time for the intro content to land
        onStart: () => {
          // Trigger the Hero content animation as the intro video fades
          onComplete();
        },
        onComplete: () => {
          // Unmounting handled by parent
        }
      });
    };

    if (video.readyState >= 3) {
      video.play().catch(() => onComplete());
      startAnimation();
    } else {
      video.addEventListener("canplay", () => {
        video.play().catch(() => onComplete());
        startAnimation();
      }, { once: true });
    }

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black overflow-hidden pointer-events-none"
    >
      {/* Intro Video Layer - Hand opening window / Aerial view */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};

export default AirplaneIntro;