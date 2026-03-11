import { useState, useCallback, useRef, useEffect } from "react";

interface IntroVideoProps {
  children: React.ReactNode;
}

export default function IntroVideo({ children }: IntroVideoProps) {
  const [showSite, setShowSite] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setShowSite(true);
    // After the 1s crossfade finishes, unmount the wrapper entirely
    setTimeout(() => setIntroDone(true), 1200);
  }, []);

  // Fallback: if the video fails to load, skip the intro immediately
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onError = () => {
      setShowSite(true);
      setTimeout(() => setIntroDone(true), 100);
    };
    vid.addEventListener("error", onError);
    return () => vid.removeEventListener("error", onError);
  }, []);

  // Once crossfade is done, render children with zero wrappers
  if (introDone) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">

      {/* WEBSITE LAYER — in normal flow so it's scrollable after transition */}
      <div
        className={`transition-opacity ease-in-out ${
          showSite ? "opacity-100 duration-1000" : "opacity-0 duration-0"
        }`}
      >
        {children}
      </div>

      {/* INTRO VIDEO — fixed on top, fades out, pointer-events disabled */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className={`fixed inset-0 z-50 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out ${
          showSite ? "opacity-0" : "opacity-100"
        }`}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

    </div>
  );
}