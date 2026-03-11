import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cabinImage from "@/assets/airplane-cabin.jpg";

interface AirplaneIntroProps {
  onComplete: () => void;
}

const AirplaneIntro = ({ onComplete }: AirplaneIntroProps) => {
  const [shadePosition, setShadePosition] = useState(0); // 0 = closed, 1 = fully open
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartShade = useRef(0);

  const handleShadeComplete = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onComplete(), 1600);
    }, 200);
  }, [onComplete, isTransitioning]);

  useEffect(() => {
    if (shadePosition >= 0.92 && !isTransitioning) {
      setShadePosition(1);
      handleShadeComplete();
    }
  }, [shadePosition, isTransitioning, handleShadeComplete]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTransitioning) return;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartShade.current = shadePosition;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isTransitioning) return;
    const windowEl = windowRef.current;
    if (!windowEl) return;
    const windowHeight = windowEl.getBoundingClientRect().height;
    const deltaY = dragStartY.current - e.clientY;
    const deltaPercent = deltaY / (windowHeight * 0.7);
    const newPosition = Math.max(0, Math.min(1, dragStartShade.current + deltaPercent));
    setShadePosition(newPosition);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Full-screen cabin photo background with blur on edges */}
          <div className="absolute inset-0">
            <img
              src={cabinImage}
              alt="Airplane cabin interior"
              className="w-full h-full object-cover"
              style={{
                filter: "blur(1.5px) brightness(0.85)",
              }}
              draggable={false}
            />
            {/* Sharp focus overlay on window area */}
            <div
              className="absolute"
              style={{
                right: "10%",
                top: "10%",
                width: "340px",
                height: "460px",
                overflow: "hidden",
                borderRadius: "45% 45% 45% 45% / 40% 40% 40% 40%",
                maskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 100%)",
              }}
            >
              <img
                src={cabinImage}
                alt=""
                className="absolute"
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "cover",
                  right: "0",
                  top: "0",
                  transform: `translate(${window.innerWidth * 0.1 - 0}px, ${window.innerHeight * 0.1}px)`,
                  filter: "brightness(0.85)",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 72% 45%, transparent 20%, rgba(0,0,0,0.4) 80%)",
            }}
          />

          {/* Interactive window area — positioned over the large window in the photo */}
          <div
            ref={windowRef}
            className="absolute"
            style={{
              right: "10%",
              top: "12%",
              width: "300px",
              height: "420px",
            }}
          >
            {/* Window cutout with oval shape */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: "45% 45% 45% 45% / 40% 40% 40% 40%",
              }}
            >
              {/* Sky background visible when shade opens */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, 
                    #0d47a1 0%, 
                    #1976d2 25%, 
                    #42a5f5 50%, 
                    #90caf9 75%, 
                    #bbdefb 100%)`,
                  opacity: shadePosition > 0.02 ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              />

              {/* Animated clouds */}
              {shadePosition > 0.05 && (
                <>
                  <div
                    className="absolute"
                    style={{
                      top: "25%",
                      left: "0%",
                      width: "120%",
                      height: "30%",
                      background: "radial-gradient(ellipse at 35% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 35%, transparent 65%)",
                      filter: "blur(4px)",
                      animation: "cloudDrift1 18s ease-in-out infinite",
                      opacity: Math.min(1, shadePosition * 3),
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      top: "55%",
                      left: "-15%",
                      width: "100%",
                      height: "25%",
                      background: "radial-gradient(ellipse at 65% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.2) 35%, transparent 60%)",
                      filter: "blur(5px)",
                      animation: "cloudDrift2 24s ease-in-out infinite",
                      opacity: Math.min(1, shadePosition * 2),
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      top: "12%",
                      left: "15%",
                      width: "80%",
                      height: "22%",
                      background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 40%, transparent 60%)",
                      filter: "blur(6px)",
                      animation: "cloudDrift3 30s ease-in-out infinite",
                      opacity: Math.min(1, shadePosition * 2.5),
                    }}
                  />
                </>
              )}

              {/* Glass reflections */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)",
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  top: "6%",
                  left: "8%",
                  width: "40%",
                  height: "22%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                  borderRadius: "50%",
                  filter: "blur(10px)",
                  transform: "rotate(-12deg)",
                }}
              />

              {/* Glass edge blur (thickness) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: "inherit",
                  boxShadow: "inset 0 0 35px 18px rgba(160,180,200,0.18)",
                }}
              />

              {/* WINDOW SHADE — draggable */}
              <div
                className="absolute left-0 right-0 top-0"
                style={{
                  height: `${(1 - shadePosition) * 100}%`,
                  minHeight: shadePosition >= 1 ? 0 : "6%",
                  transition: isDragging ? "none" : "height 0.12s ease-out",
                  cursor: isTransitioning ? "default" : "grab",
                  zIndex: 10,
                  touchAction: "none",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Shade body */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, #bdb9b1 0%, #ccc8c0 20%, #d8d4cc 50%, #ccc8c0 80%, #c0bcb4 100%)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.4), inset 0 -2px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Shade texture lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-[8%] right-[8%] h-[1px]"
                      style={{
                        top: `${8 + i * 9}%`,
                        background: "rgba(0,0,0,0.05)",
                      }}
                    />
                  ))}
                </div>

                {/* Pull tab handle */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  style={{
                    width: "56px",
                    height: "20px",
                    background: "linear-gradient(180deg, #b0aca4 0%, #9a968e 100%)",
                    borderRadius: "0 0 12px 12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)",
                    zIndex: 11,
                  }}
                >
                  <div className="flex items-center justify-center h-full gap-[3px]">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-[10px] h-[2px] rounded-full"
                        style={{ background: "rgba(0,0,0,0.2)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle sunlight entering through window */}
            {shadePosition > 0.15 && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: "10%",
                  left: "-50%",
                  width: "200%",
                  height: "130%",
                  background: `radial-gradient(ellipse at 50% 30%, rgba(255,245,215,${0.08 * shadePosition}) 0%, transparent 55%)`,
                  transform: "rotate(-8deg)",
                }}
              />
            )}
          </div>

          {/* Instruction hint */}
          {shadePosition < 0.1 && !isTransitioning && (
            <motion.div
              className="absolute z-20"
              style={{
                right: "10%",
                bottom: "18%",
                width: "300px",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.9 }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                }}
              >
                ↑ Slide the window shade up
              </p>
            </motion.div>
          )}

          {/* ZOOM TRANSITION — when shade fully open */}
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Expanding sky from window */}
              <motion.div
                className="absolute overflow-hidden"
                style={{
                  right: "10%",
                  top: "12%",
                  width: "300px",
                  height: "420px",
                  borderRadius: "45% 45% 45% 45% / 40% 40% 40% 40%",
                  transformOrigin: "center center",
                }}
                animate={{
                  scale: 12,
                  borderRadius: "0%",
                }}
                transition={{ duration: 1.4, ease: [0.22, 0.68, 0.36, 1] }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(180deg, #0d47a1 0%, #42a5f5 50%, #bbdefb 100%)",
                  }}
                />
              </motion.div>

              {/* Fade cabin to transparent */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.5 }}
                style={{ background: "rgba(255,255,255,0.0)" }}
              />
            </motion.div>
          )}
        </motion.div>
      ) : (
        /* Fade-out sky overlay as landing page appears */
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{
            background: "linear-gradient(180deg, #0d47a1 0%, #42a5f5 50%, #bbdefb 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default AirplaneIntro;
