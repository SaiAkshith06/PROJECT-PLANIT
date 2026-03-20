import { useCallback, useEffect, useRef } from "react";

/**
 * 12. Sound Design Engine (Subtle & Premium)
 * Manages audio feedback for hover and click interactions.
 * Note: Requires sound files in /public/sounds/ as hover.mp3 and click.mp3.
 */
export const useSound = () => {
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio on mount
    hoverSoundRef.current = new Audio("/sounds/hover.mp3");
    clickSoundRef.current = new Audio("/sounds/click.mp3");
    
    // Set subtle volume levels as requested
    if (hoverSoundRef.current) hoverSoundRef.current.volume = 0.15;
    if (clickSoundRef.current) clickSoundRef.current.volume = 0.2;

    return () => {
      // Cleanup on unmount
      if (hoverSoundRef.current) {
        hoverSoundRef.current.pause();
        hoverSoundRef.current = null;
      }
      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current = null;
      }
    };
  }, []);

  const playHover = useCallback(() => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      // Use catch() because browsers block audio without prior user interaction
      hoverSoundRef.current.play().catch(() => {});
    }
  }, []);

  const playClick = useCallback(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  }, []);

  return { playHover, playClick };
};
