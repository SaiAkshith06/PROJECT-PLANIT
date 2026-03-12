import { useEffect, useState } from "react";
import { User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config/site";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
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
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 transition-colors duration-300 ${
              scrolled
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
