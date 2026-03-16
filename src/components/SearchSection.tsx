import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { tier1Cities } from "@/data/tier1Cities";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter cities by typed query
  const suggestions = query.trim()
    ? tier1Cities.filter((c) =>
        c.city.toLowerCase().includes(query.toLowerCase()) ||
        c.state.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = () => {
    if (!query.trim()) return;
    // Try exact match first
    const match = tier1Cities.find((c) =>
      c.city.toLowerCase() === query.trim().toLowerCase()
    );
    const slug = match
      ? match.city.toLowerCase()
      : query.toLowerCase().replace(/\s+/g, "-");
    setShowSuggestions(false);
    navigate(`/destination/${slug}`);
  };

  const handleSuggestionClick = (cityName: string) => {
    setQuery(cityName);
    setShowSuggestions(false);
    navigate(`/destination/${cityName.toLowerCase()}`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="w-full flex items-center justify-center py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-6xl px-6 flex flex-col items-center">

        {/* Headline */}
        <h1
          className="font-display text-6xl md:text-7xl text-center mb-16 tracking-wide font-bold"
          style={{
            color: "#0F172A",
            textShadow:
              "0px 3px 6px rgba(0,0,0,0.15), 0px 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          Start Your Next Adventure
        </h1>

        {/* Search Bar + Suggestions */}
        <div ref={wrapperRef} className="w-full max-w-[900px] relative">
          <div
            className="w-full bg-white rounded-[36px] p-2 flex items-center gap-3 hover:shadow-xl transition"
            style={{
              boxShadow:
                "0px 4px 16px rgba(0,0,0,0.06), 0px 12px 40px rgba(0,0,0,0.04)",
            }}
          >
            {/* Icon */}
            <div className="pl-6 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Search cities — Mumbai, Delhi, Chennai…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder-gray-400 px-4"
            />

            {/* Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
              {suggestions.map((city) => (
                <li key={city.city}>
                  <button
                    onMouseDown={() => handleSuggestionClick(city.city)}
                    className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium text-gray-900">{city.city}</span>
                    <span className="text-sm text-gray-400 ml-auto">{city.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </section>
  );
}