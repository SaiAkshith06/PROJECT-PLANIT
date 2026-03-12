import { Search } from "lucide-react";

export default function SearchSection() {
  const popularDestinations = ["Goa", "Manali", "Kerala", "Ladakh"];

  return (
    <section className="w-full flex items-center justify-center py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-6xl px-6 flex flex-col items-center">

        {/* Headline */}
        <h1
          className="text-6xl md:text-7xl text-center mb-16 tracking-wide font-bold"
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
            className="flex-1 bg-transparent outline-none text-lg text-gray-900 placeholder-gray-400 px-4"
          />

          {/* Button */}
          <button
            className="text-white px-10 py-4 rounded-full transition-all duration-200 font-medium hover:scale-105"
            style={{
              backgroundColor: "#3B82F6",
              boxShadow: "0px 6px 20px rgba(59,130,246,0.35)",
            }}
          >
            Search
          </button>
        </div>

        {/* Popular */}
        <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
          <span className="text-gray-600 text-sm font-medium">Popular</span>

          {popularDestinations.map((destination) => (
            <button
              key={destination}
              className="px-6 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-700 text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}