import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AirplaneIntroProps {
  onComplete: () => void;
}

const appleEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/**
 * Time-based phases (video keeps playing throughout):
 *  0 – video playing, no overlay text
 *  1 – PLANIT text fades in over the video (video still playing)
 *  2 – cloud wipe begins, intro fades out revealing hero behind
 *  3 – done, component returns null
 *
 * Timeline:
 *  0.0s  → video begins
 *  1.4s  → PLANIT fades in
 *  2.6s  → cloud wipe starts + intro fades out
 *  5.0s  → clouds clear, component unmounts
 */
const AirplaneIntro = ({ onComplete }: AirplaneIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let t1: number, t2: number, t3: number;

    const handlePlayAttempt = async () => {
      try {
        await video.play();
      } catch {
        setPhase(3);
        onComplete();
        return;
      }

      // Time-based triggers — video keeps playing, never paused
      t1 = window.setTimeout(() => setPhase(1), 1400);
      t2 = window.setTimeout(() => setPhase(2), 2600);
      t3 = window.setTimeout(() => {
        setPhase(3);
        onComplete();
      }, 5200);
    };

    if (video.readyState >= 3) {
      handlePlayAttempt();
    } else {
      video.addEventListener("canplay", handlePlayAttempt, { once: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (phase === 3) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: phase >= 2 ? "none" : "auto" }}
    >
      {/* Intro video layer — subtle expansion + fades out during cloud wipe */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: phase === 2 ? 0 : 1,
          scale: phase >= 1 ? 1.08 : 1,
        }}
        transition={{
          opacity: { duration: 1.6, ease: appleEase },
          scale: { duration: 1.4, ease: appleEase },
        }}
        style={{ transformOrigin: "center center" }}
      >
        {/* Intro video — never paused, never looped */}
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

        {/* Ambient cloud overlays on the video */}
        <AnimatePresence>
          {phase < 2 && (
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "-10%",
                  width: "150%",
                  height: "30%",
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
                  filter: "blur(8px)",
                  opacity: 0.08,
                  animation: "cloudDrift1 30s linear infinite",
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
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 40%, transparent 70%)",
                  filter: "blur(12px)",
                  opacity: 0.08,
                  animation: "cloudDrift2 30s linear infinite",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sunlight glow */}
        {phase < 2 && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
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
        )}
      </motion.div>

      {/* ===== CLOUD WIPE TRANSITION ===== */}
      {phase === 2 && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          {/* Background cloud layer (slower, more transparent — parallax depth) */}
          <motion.div
            className="absolute pointer-events-none"
            initial={{ x: "-130%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 4, ease: "easeInOut" }}
            style={{
              top: "-20%",
              width: "140%",
              height: "140%",
              opacity: 0.6,
              mixBlendMode: "screen",
              background: `
                radial-gradient(circle at 35% 45%, rgba(255,255,255,0.6) 0%, transparent 55%),
                radial-gradient(circle at 65% 55%, rgba(255,255,255,0.45) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 65%)
              `,
              filter: "blur(14px)",
            }}
          />

          {/* Front cloud layer (larger, faster — creates the wipe) */}
          <motion.div
            className="absolute pointer-events-none"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{
              top: "-30%",
              width: "160%",
              height: "160%",
              opacity: 0.85,
              mixBlendMode: "screen",
              background: `
                radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.15) 60%, transparent 80%),
                radial-gradient(circle at 30% 40%, rgba(255,255,255,0.7) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 0%, transparent 50%)
              `,
              filter: "blur(20px)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AirplaneIntro;