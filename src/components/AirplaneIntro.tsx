import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

interface AirplaneIntroProps {
  onComplete: () => void;
}

const AirplaneIntro = ({ onComplete }: AirplaneIntroProps) => {
  const [shadePosition, setShadePosition] = useState(0); // 0 = closed, 1 = fully open
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const shadeRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartShade = useRef(0);

  const handleShadeComplete = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 1400);
    }, 300);
  }, [onComplete, isTransitioning]);

  useEffect(() => {
    if (shadePosition >= 0.95 && !isTransitioning) {
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
    const deltaPercent = deltaY / (windowHeight * 0.75);
    const newPosition = Math.max(0, Math.min(1, dragStartShade.current + deltaPercent));
    setShadePosition(newPosition);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const cloudOffset = shadePosition * 20;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: "#2a2d35" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Cabin ceiling with overhead bins */}
          <div className="absolute top-0 left-0 right-0 h-[18%]"
            style={{
              background: "linear-gradient(180deg, #1e2028 0%, #2a2d35 60%, #33363f 100%)",
            }}
          >
            {/* Overhead bin panel */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%]"
              style={{
                background: "linear-gradient(180deg, #3a3d47 0%, #2e3139 100%)",
                borderBottom: "2px solid #44474f",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div className="absolute bottom-[8px] left-[10%] right-[10%] h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
              />
            </div>
            {/* Reading light glow */}
            <div className="absolute bottom-0 right-[38%] w-[180px] h-[120px]"
              style={{
                background: "radial-gradient(ellipse at center bottom, rgba(255,240,200,0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Cabin floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[15%]"
            style={{
              background: "linear-gradient(0deg, #1a1c22 0%, #252830 100%)",
            }}
          />

          {/* LEFT SIDE - Airplane Seat */}
          <div className="absolute left-0 top-[12%] bottom-[10%] w-[35%]">
            {/* Seat back */}
            <div className="absolute right-[10%] top-[8%] w-[65%] h-[70%] rounded-t-[20px]"
              style={{
                background: "linear-gradient(135deg, #1a1e3a 0%, #252a4a 40%, #1e2240 100%)",
                boxShadow: "4px 0 20px rgba(0,0,0,0.3), inset 2px 0 8px rgba(255,255,255,0.03)",
              }}
            >
              {/* Headrest */}
              <div className="absolute top-[2%] left-[15%] right-[15%] h-[28%] rounded-[16px]"
                style={{
                  background: "linear-gradient(180deg, #2a2f52 0%, #1e2240 100%)",
                  boxShadow: "inset 0 2px 10px rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {/* Headrest white cover */}
                <div className="absolute top-[10%] left-[10%] right-[10%] h-[55%] rounded-[8px]"
                  style={{
                    background: "linear-gradient(180deg, #e8e8e8 0%, #d4d4d4 100%)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
              {/* Seat stitching lines */}
              <div className="absolute top-[35%] left-[20%] right-[20%] space-y-[12%]">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-[1px] w-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                ))}
              </div>
            </div>

            {/* Armrest */}
            <div className="absolute right-[5%] top-[72%] w-[30%] h-[8%] rounded-[8px]"
              style={{
                background: "linear-gradient(90deg, #3a3f5a 0%, #2e3350 50%, #3a3f5a 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.06)",
              }}
            />
          </div>

          {/* RIGHT SIDE - Airplane Wall and Window */}
          <div className="absolute right-0 top-0 bottom-0 w-[65%]">
            {/* Curved cabin wall */}
            <div className="absolute inset-0"
              style={{
                background: "linear-gradient(250deg, #d4d0c8 0%, #c8c4bb 30%, #bfbbb2 60%, #b8b4ab 100%)",
                borderLeft: "3px solid #a8a49b",
              }}
            >
              {/* Wall panel lines (curved) */}
              {[20, 45, 70].map(pos => (
                <div key={pos} className="absolute top-0 bottom-0"
                  style={{
                    left: `${pos}%`,
                    width: "1px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.06) 100%)",
                  }}
                />
              ))}
              {/* Horizontal panel lines */}
              {[25, 75].map(pos => (
                <div key={pos} className="absolute left-0 right-0"
                  style={{
                    top: `${pos}%`,
                    height: "1px",
                    background: "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)",
                  }}
                />
              ))}
            </div>

            {/* AIRPLANE WINDOW */}
            <div
              ref={windowRef}
              className="absolute"
              style={{
                left: "15%",
                top: "20%",
                width: "280px",
                height: "380px",
              }}
            >
              {/* Outer window frame (recessed into wall) */}
              <div className="absolute inset-0 rounded-[50%/45%]"
                style={{
                  background: "linear-gradient(180deg, #a09c93 0%, #8a867d 100%)",
                  boxShadow: "inset 0 3px 15px rgba(0,0,0,0.3), 0 0 0 4px #b5b1a8, 0 0 0 8px #c8c4bb",
                  padding: "12px",
                }}
              >
                {/* Middle frame layer */}
                <div className="w-full h-full rounded-[50%/45%] overflow-hidden relative"
                  style={{
                    background: "#555",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
                    padding: "8px",
                  }}
                >
                  {/* Inner window - the actual glass area */}
                  <div className="w-full h-full rounded-[50%/45%] overflow-hidden relative"
                    style={{
                      background: "#1a3a5c",
                      boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Sky gradient */}
                    <div className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, 
                          #1a6bcf ${10 - shadePosition * 10}%, 
                          #4a9eff ${40 - shadePosition * 10}%, 
                          #87ceeb ${70}%, 
                          #b4dff7 100%)`,
                        opacity: shadePosition > 0.05 ? 1 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />

                    {/* Clouds */}
                    {shadePosition > 0.05 && (
                      <>
                        <div className="absolute" style={{
                          top: `${35 - cloudOffset}%`,
                          left: "5%",
                          width: "90%",
                          height: "25%",
                          background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",
                          filter: "blur(3px)",
                          animation: "cloudDrift1 15s ease-in-out infinite",
                          opacity: Math.min(1, shadePosition * 3),
                        }} />
                        <div className="absolute" style={{
                          top: `${55 - cloudOffset}%`,
                          left: "-10%",
                          width: "80%",
                          height: "20%",
                          background: "radial-gradient(ellipse at 60% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
                          filter: "blur(4px)",
                          animation: "cloudDrift2 20s ease-in-out infinite",
                          opacity: Math.min(1, shadePosition * 2),
                        }} />
                        <div className="absolute" style={{
                          top: `${20 - cloudOffset * 0.5}%`,
                          left: "20%",
                          width: "70%",
                          height: "18%",
                          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 65%)",
                          filter: "blur(5px)",
                          animation: "cloudDrift3 25s ease-in-out infinite",
                          opacity: Math.min(1, shadePosition * 2.5),
                        }} />
                      </>
                    )}

                    {/* Landing page preview (visible when shade > 0.7) */}
                    {shadePosition > 0.7 && !isTransitioning && (
                      <div className="absolute inset-0"
                        style={{
                          opacity: (shadePosition - 0.7) / 0.3,
                          transition: "opacity 0.3s",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
                          }}
                        />
                      </div>
                    )}

                    {/* Glass reflections */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)",
                      }}
                    />
                    <div className="absolute pointer-events-none"
                      style={{
                        top: "8%",
                        left: "10%",
                        width: "35%",
                        height: "20%",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
                        borderRadius: "50%",
                        filter: "blur(8px)",
                        transform: "rotate(-15deg)",
                      }}
                    />

                    {/* Glass edge blur (thickness simulation) */}
                    <div className="absolute inset-0 pointer-events-none rounded-[50%/45%]"
                      style={{
                        boxShadow: "inset 0 0 30px 15px rgba(180,200,220,0.15)",
                      }}
                    />

                    {/* WINDOW SHADE */}
                    <div
                      ref={shadeRef}
                      className="absolute left-0 right-0 top-0 select-none"
                      style={{
                        height: `${(1 - shadePosition) * 100}%`,
                        minHeight: shadePosition >= 1 ? 0 : "8%",
                        transition: isDragging ? "none" : "height 0.15s ease-out",
                        cursor: isTransitioning ? "default" : "grab",
                        zIndex: 10,
                      }}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                    >
                      {/* Shade body */}
                      <div className="absolute inset-0"
                        style={{
                          background: "linear-gradient(180deg, #c8c4bc 0%, #d8d4cc 30%, #e0dcd4 60%, #d0ccc4 100%)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 -2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        {/* Shade texture lines */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="absolute left-[5%] right-[5%] h-[1px]"
                            style={{
                              top: `${12 + i * 11}%`,
                              background: "rgba(0,0,0,0.04)",
                            }}
                          />
                        ))}
                      </div>

                      {/* Shade handle (pull tab) */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                        style={{
                          width: "60px",
                          height: "18px",
                          background: "linear-gradient(180deg, #b8b4ac 0%, #a8a49c 100%)",
                          borderRadius: "0 0 10px 10px",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                          zIndex: 11,
                        }}
                      >
                        {/* Handle grip lines */}
                        <div className="flex items-center justify-center h-full gap-[3px]">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-[12px] h-[2px] rounded-full"
                              style={{ background: "rgba(0,0,0,0.15)" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sunlight entering through window */}
              {shadePosition > 0.2 && (
                <div className="absolute pointer-events-none"
                  style={{
                    top: "20%",
                    left: "-30%",
                    width: "160%",
                    height: "120%",
                    background: `radial-gradient(ellipse at 50% 30%, rgba(255,240,200,${0.06 * shadePosition}) 0%, transparent 60%)`,
                    transform: "rotate(-10deg)",
                  }}
                />
              )}
            </div>

            {/* Instruction text */}
            {shadePosition < 0.15 && !isTransitioning && (
              <motion.div
                className="absolute text-center"
                style={{
                  left: "15%",
                  bottom: "12%",
                  width: "280px",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <p style={{
                  color: "rgba(80,76,68,0.7)",
                  fontSize: "13px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}>
                  ↑ Drag the window shade up
                </p>
              </motion.div>
            )}
          </div>

          {/* Ambient cabin lighting */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 65% 40%, rgba(255,240,200,0.03) 0%, transparent 50%)",
            }}
          />

          {/* Zoom transition overlay */}
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                background: "radial-gradient(ellipse at 52% 42%, transparent 0%, rgba(42,45,53,1) 30%)",
              }}
            >
              <motion.div
                className="absolute"
                style={{
                  left: "calc(65% * 0.15 + 35%)",
                  top: "20%",
                  width: "280px",
                  height: "380px",
                  transformOrigin: "center center",
                }}
                initial={{ scale: 1 }}
                animate={{ scale: 8, x: "-50%", y: "-20%" }}
                transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="w-full h-full rounded-[50%/45%] overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, #1a6bcf 10%, #4a9eff 40%, #87ceeb 70%, #b4dff7 100%)`,
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: `linear-gradient(180deg, #1a6bcf 10%, #4a9eff 40%, #87ceeb 70%, #b4dff7 100%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default AirplaneIntro;
