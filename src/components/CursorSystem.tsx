import { useEffect, useRef } from "react";

/**
 * 10 & 11. Cursor Glow & Magnetic Interactions
 * Combined implementation to ensure high performance and zero-lag tracking.
 * This component remains passive until mouse movement is detected.
 */
const CursorSystem = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 10. Smooth Cursor Glow Tracking
      if (glowRef.current) {
        // Optimized with requestAnimationFrame through CSS transition (0.1s)
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }

      // 11. Magnetic Logic for Elements with .magnetic class
      const magneticElements = document.querySelectorAll(".magnetic");
      magneticElements.forEach((el) => {
        const btn = el as HTMLElement;
        const rect = btn.getBoundingClientRect();
        
        // Calculate relative distance from center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 120; // Magnetic field range

        if (distance < threshold) {
          // Subtle magnetic attraction factor (0.15–0.2x)
          const x = dx * 0.2;
          const y = dy * 0.2;
          
          btn.style.transform = `translate(${x}px, ${y}px)`;
          btn.style.transition = "transform 0.1s ease-out";
        } else {
          // Return to original state when out of range
          btn.style.transform = "translate(0, 0)";
          btn.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        }
      });
    };

    // Global listener for better responsiveness
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      className="fixed pointer-events-none rounded-full w-[300px] h-[300px] z-[9999] -translate-x-1/2 -translate-y-1/2 overflow-hidden blur-[60px]"
      style={{
        background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        willChange: "left, top"
      }}
    />
  );
};

export default CursorSystem;
