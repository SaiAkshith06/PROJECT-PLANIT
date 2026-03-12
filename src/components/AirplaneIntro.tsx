import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface AirplaneIntroProps {
  onComplete: () => void;
}

const AirplaneIntro = ({ onComplete }: AirplaneIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const hasTriggered = useRef(false);

  const startFadeOut = useCallback(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    setFadeOut(true);

    // wait for fade animation before removing
    setTimeout(() => {
      onComplete();
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // start fade slightly before video ends
      if (
        video.duration &&
        video.currentTime >= video.duration - 0.8 &&
        !hasTriggered.current
      ) {
        startFadeOut();
      }
    };

    const handlePlayAttempt = async () => {
      try {
        await video.play();
      } catch {
        // autoplay blocked → skip intro
        startFadeOut();
      }
    };

    if (video.readyState >= 3) {
      handlePlayAttempt();
    } else {
      video.addEventListener("canplay", handlePlayAttempt, { once: true });
    }

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [startFadeOut]);

  return (
    <motion.div
  className="fixed inset-0 z-[100]"
  initial={{ opacity: 1, scale: 1 }}
  animate={{
    opacity: fadeOut ? 0 : 1,
    scale: fadeOut ? 1.08 : 1
  }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  style={{ pointerEvents: fadeOut ? "none" : "auto" }}
>
      {/* Intro Video */}
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

      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "-10%",
            width: "150%",
            height: "30%",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.25) 40%, transparent 70%)",
            filter: "blur(8px)",
            animation: "cloudDrift1 18s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-20%",
            width: "160%",
            height: "25%",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
            filter: "blur(12px)",
            animation: "cloudDrift2 25s linear infinite",
          }}
        />
      </div>

      {/* Sunlight glow */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
        style={{
          left: "50%",
          top: "46%",
          width: "520px",
          height: "520px",
          transform: "translate(-50%, -50%) rotate(-8deg)",
          background:
            "radial-gradient(ellipse at center, rgba(255,240,200,0.28) 0%, rgba(255,240,200,0.12) 40%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* Cabin light spill */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        style={{
          left: "48%",
          top: "50%",
          width: "720px",
          height: "600px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at center, rgba(255,255,230,0.14) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
    </motion.div>
  );
};

export default AirplaneIntro;