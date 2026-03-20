import { useRef, useState, useEffect } from "react";
import SearchSection from "@/components/SearchSection";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationScroller from "@/components/DestinationScroller";
import SmoothScroll from "@/components/SmoothScroll";
import CursorSystem from "@/components/CursorSystem";
import AirplaneIntro from "@/components/AirplaneIntro";
import { useTheme } from "@/providers/ThemeProvider";
import { SITE_NAME } from "@/config/site";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
    const observer = new MutationObserver((m) => {
      setIsDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    const introPlayed = sessionStorage.getItem("introPlayed");

    if (!introPlayed) {
      setShowIntro(true);
      sessionStorage.setItem("introPlayed", "true");
    } else {
      setIntroFinished(true);
    }
  }, []);

  return (
    <div ref={containerRef} className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-[#F8FAFC]'} selection:bg-white/20`}>
      <CursorSystem />
      <Navbar />

      <SmoothScroll>
        <HeroSection introFinished={introFinished} />

        <SearchSection />

        <DestinationScroller />
      </SmoothScroll>

      {showIntro && (
        <AirplaneIntro
          onComplete={() => {
            setIntroFinished(true);
          }}
          onFadeComplete={() => {
            setShowIntro(false);
          }}
        />
      )}

      <footer className="py-10 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;