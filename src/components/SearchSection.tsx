import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, X } from "lucide-react";
import { tier1Cities } from "@/data/tier1Cities";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

/**
 * 2, 3 & 4. Clean Scene Break (Post-Hero)
 * Resets the overlap and positions the content naturally after the 100vh hero.
 * Maintains the glass card aesthetic but eliminates "content leaks".
 */
export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playHover, playClick } = useSound();

  const filteredSuggestions = query.trim()
    ? tier1Cities.filter((c) =>
        c.city.toLowerCase().includes(query.toLowerCase()) ||
        c.state.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularDestinations = tier1Cities.slice(0, 4);

  const handleSearch = () => {
    if (!query.trim()) return;
    const match = tier1Cities.find((c) =>
      c.city.toLowerCase() === query.trim().toLowerCase()
    );
    const slug = match
      ? match.city.toLowerCase()
      : query.toLowerCase().replace(/\s+/g, "-");
    
    resetSearch();
    navigate(`/destination/${slug}`);
  };

  const handleSuggestionClick = (cityName: string) => {
    setQuery(cityName);
    resetSearch();
    navigate(`/destination/${cityName.toLowerCase()}`);
  };

  const resetSearch = () => {
    setShowSuggestions(false);
    setIsFocused(false);
    if (inputRef.current) inputRef.current.blur();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
      className="relative w-full py-24 px-6 z-10 mt-0 bg-transparent"
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Soft Glass Card Effect Container */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-[24px] rounded-[32px] p-8 md:p-14 border border-white/40 dark:border-white/5 
          shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] 
          dark:shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
          flex flex-col items-center gap-12"
        >
          {/* Typography Refinement */}
          <div className="text-center space-y-4 max-w-[700px] mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Start Your Next Adventure
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-[600px] mx-auto font-medium leading-relaxed">
              Discover destinations, plan itineraries, and build memories.
            </p>
          </div>

          {/* Minimal Search Bar (Nested inside Glass Card) */}
          <div ref={wrapperRef} className="w-full max-w-[720px] relative z-[50]">
            <motion.div
              animate={{
                scale: isFocused ? 1.02 : 1,
                boxShadow: isFocused 
                  ? "0 12px 40px rgba(0,0,0,0.15)"
                  : "0 8px 30px rgba(0,0,0,0.08)"
              } as any}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full bg-white/95 dark:bg-[#111827]/90 backdrop-blur-[12px] rounded-full p-2 flex items-center gap-3 border transition-all duration-300 ${
                isFocused 
                  ? 'border-blue-400 dark:border-blue-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.2)]' 
                  : 'border-black/5 dark:border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)]'
              }`}
            >
              <div className="pl-5 flex items-center">
                <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search major cities..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  if (query.length === 0 || filteredSuggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-[#E5E7EB] placeholder-slate-400 dark:placeholder-slate-500 py-3.5 px-1.5 font-medium"
              />

              {query && (
                <button 
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-1"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}

              <button
                onClick={() => { handleSearch(); playClick(); }}
                onMouseEnter={playHover}
                className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap shadow-[0_8px_20px_rgba(37,99,235,0.4)] magnetic"
              >
                Search
              </button>
            </motion.div>

            {/* Suggestion Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute left-0 right-0 mt-3 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-[12px] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden p-2"
                >
                  <div className="py-1">
                    {query.trim() === "" ? (
                      <div className="p-3">
                        <div className="flex items-center gap-2 px-3 mb-2">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Popular</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {popularDestinations.map((city) => (
                            <button
                              key={city.city}
                              onClick={() => handleSuggestionClick(city.city)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                                <MapPin className="w-4 h-4 text-slate-400" />
                              </div>
                              <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{city.city}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((city) => (
                            <button
                              key={city.city}
                              onMouseDown={() => handleSuggestionClick(city.city)}
                              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                            >
                              <MapPin className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500" />
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{city.city}</span>
                                <span className="text-[10px] text-slate-400">{city.state}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-6 py-8 text-center">
                            <p className="text-slate-400 text-sm font-medium">No matches for "{query}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}