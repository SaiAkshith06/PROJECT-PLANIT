import { useEffect, useState } from "react";
import { User, LogIn, UserPlus, Sun, Moon } from "lucide-react";
import { SITE_NAME } from "@/config/site";
import { useTheme } from "@/providers/ThemeProvider";
import { useSound } from "@/hooks/useSound";

/**
 * Premium Adaptive Navbar
 * Progressive Branding: Logo emerges from blur on scroll.
 * High-Fidelity Physics: Slide-in reveal and magnetic interactions.
 * Adaptive UI: Seamlessly transitions between Hero and Content styles.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const { playHover, playClick } = useSound();

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(root.classList.contains('dark'));
        }
      });
    });
    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 13. Transition Physics (Apple cubic-bezier)
  const appleEase = "cubic-bezier(0.22, 1, 0.36, 1)";

  // Adaptive Nav Item Class with Magnetic support
  const getNavItemClass = (primary = false) => `
    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
    text-sm font-medium border group magnetic
    ${!scrolled 
      ? (primary 
          ? 'bg-white text-black hover:bg-gray-100 border-transparent shadow-sm' 
          : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white border-white/12')
      : (isDark 
          ? (primary ? 'bg-white text-black hover:bg-slate-200 border-transparent' : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white border-white/8') 
          : (primary ? 'bg-black text-white hover:bg-gray-800 border-transparent shadow-md' : 'bg-black/5 text-gray-700 hover:bg-black/10 hover:text-gray-900 border-black/8'))
    }
  `;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-[400ms]
        ${!scrolled 
          ? 'bg-transparent py-5 px-12 -translate-y-[6px] text-white' 
          : (isDark 
              ? 'bg-slate-900/75 backdrop-blur-[18px] border-b border-white/10 py-3.5 px-10 translate-y-0 shadow-2xl' 
              : 'bg-white/75 backdrop-blur-[18px] border-b border-black/8 py-3.5 px-10 translate-y-0 shadow-lg shadow-black/5')
        }
      `}
      style={{ transitionTimingFunction: appleEase }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 4 & 6. Progressive Logo Reveal (Blur-to-Sharp) */}
        <div 
          className="flex items-center transition-all duration-500"
          style={{ 
            opacity: scrolled ? 1 : 0,
            filter: scrolled ? 'blur(0px)' : 'blur(6px)',
            transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.95)',
            transitionTimingFunction: appleEase
          }}
        >
          <span className={`font-display font-medium tracking-[1.2px] text-lg transition-colors duration-300 
            ${!scrolled ? 'text-white' : (isDark ? 'text-white' : 'text-[#111827]')}
          `}>
            {SITE_NAME}
          </span>
        </div>

        {/* Nav Items */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => { setTheme(isDark ? "light" : "dark"); playClick(); }}
            onMouseEnter={playHover}
            className={`relative overflow-hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border magnetic
              ${!scrolled
                ? 'bg-white/10 border-white/12 text-white/80 hover:bg-white/20 hover:text-white'
                : (isDark
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-black/5 border-black/8 text-gray-600 hover:bg-black/10 hover:text-gray-900')
              }
            `}
            aria-label="Toggle theme"
          >
            <Sun className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${isDark ? "opacity-0 rotate-180 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
            <Moon className={`absolute w-4 h-4 transition-all duration-500 ease-in-out ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-50"}`} />
          </button>

          {/* Nav Buttons (Sound + Magnetic Feedack) */}
          <button className={getNavItemClass()} onMouseEnter={playHover} onClick={playClick}>
            <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Login</span>
          </button>
          
          <button className={getNavItemClass()} onMouseEnter={playHover} onClick={playClick}>
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Register</span>
          </button>

          <button className={getNavItemClass(true)} onMouseEnter={playHover} onClick={playClick}>
            <User className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Explore</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
