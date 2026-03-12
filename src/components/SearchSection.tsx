import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    const formatted = query.toLowerCase().replace(/\s+/g, "-");
    navigate(`/destination/${formatted}`);
  };

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

        {/* Search Bar */}
        <div
          className="w-full max-w-[900px] bg-white rounded-[36px] p-2 flex items-center gap-3 hover:shadow-xl transition"
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
            placeholder="Search places, cities, or countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
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

      </div>
    </section>
  );
}