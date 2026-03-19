import { useEffect, useState } from "react";
import { User, LogIn, UserPlus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config/site";
import { useTheme } from "@/providers/ThemeProvider";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
    
    // Observer to react to theme changes instantly
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-transparent" : "bg-transparent"
      }`}
      style={scrolled ? {
        background: isDark ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.4)'}`,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.05)'
      } : undefined}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo — visible only after scrolling */}
        <div className="flex items-center gap-2">
          <span
            className={`font-display text-xl font-bold tracking-wide transition-all duration-300 ${
              scrolled
                ? "opacity-100 translate-x-0 text-gray-900"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            {SITE_NAME}
          </span>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative overflow-hidden w-9 h-9 rounded-full transition-colors mx-1 duration-[350ms] ${
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Toggle theme"
          >
            <Sun className={`absolute w-5 h-5 transition-all duration-[350ms] ease-in-out ${isDark ? "opacity-0 rotate-180 scale-90" : "opacity-100 rotate-0 scale-100"}`} />
            <Moon className={`absolute w-5 h-5 transition-all duration-[350ms] ease-in-out ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-90"}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 transition-colors duration-300 ${
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 transition-colors duration-300 ${
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 transition-colors duration-300 ${
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
