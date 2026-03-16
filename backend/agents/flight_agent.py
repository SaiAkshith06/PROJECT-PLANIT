import json
import os
from agents.route_agent import BaseAgent

class FlightAgent(BaseAgent):
    def __init__(self, name="FlightAgent"):
        super().__init__(name)
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'flights.json')
        self.flights = self.load_data(data_path)
        # Import dynamically or initialize
        from services.flight_service import FlightService
        self.flight_service = FlightService()

    def load_data(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
        return []

    def process(self, data):
        print(f"[{self.name}] Filtering flight routes...")
        source = data.get("source", "").lower()
        destination = data.get("destination", "").lower()
        
        flight_options = []
        
        # 1. Attempt Real-Time API
        try:
            api_flights = self.flight_service.search_flights(source, destination)
            if api_flights:
                print(f"[{self.name}] Successfully fetched {len(api_flights)} real-time flights via Amadeus API.")
            for f in api_flights:
                flight_options.append({
                    "category": "flight",
                    "mode": f["mode"],
                    "provider": f.get("airline", "Flight"),
                    "time_seconds": f["duration"] * 60,
                    "cost": f["price"],
                    "distance_meters": f["duration"] * 60 * 150, # rough estimate
                    "route": f"Flight Route: {f['source']} to {f['destination']}",
                    "tolls": [],
                    "api_source": "Amadeus"
                })
        except PermissionError as pe:
            print(f"[{self.name}] Rate limit or Auth error: {pe}. Falling back to flights.json.")
        except Exception as e:
            print(f"[{self.name}] API fetch failed or returned empty: {e}. Falling back to flights.json.")

        # 2. Fallback to Local JSON Dataset if API fails or yields no results
        if not flight_options:
            for flight in self.flights:
                if flight["source"].lower() in source or source in flight["source"].lower():
                    if flight["destination"].lower() in destination or destination in flight["destination"].lower():
                        flight_options.append({
                            "category": "flight",
                            "mode": flight["mode"],
                            "provider": flight.get("provider", "Flight"),
                            "time_seconds": flight["duration"] * 60,
                            "cost": flight["price"],
                            "distance_meters": flight["duration"] * 60 * 150,
                            "route": f"Flight Route: {flight['source']} to {flight['destination']}",
                            "tolls": [],
                            "api_source": "Fallback JSON"
                        })
        # 3. Sort and limit
        flight_options = sorted(flight_options, key=lambda x: x["cost"])[:5]
        
        # 4. Fallback Pricing & Generation
        distance_km = data.get("distance_km", 300)
        from agents.price_estimator import estimate_price
        
        for f in flight_options:
            if not f.get("cost"):
                f["cost"] = estimate_price("flight", distance_km)
                f["estimated"] = True
                
        if len(flight_options) < 3:
            print(f"[{self.name}] Generating estimated fallback flights...")
            flight_names = ["IndiGo", "Air India", "Vistara", "SpiceJet", "Akasa Air"]
            while len(flight_options) < 3:
                idx = len(flight_options) + 1
                provider_name = flight_names[idx % len(flight_names)]
                flight_options.append({
                    "category": "flight",
                    "mode": "flight",
                    "provider": f"{provider_name} (Estimated)",
                    "time_seconds": int((distance_km / 800) * 3600),
                    "cost": estimate_price("flight", distance_km),
                    "distance_meters": distance_km * 1000,
                    "route": f"Estimated Flight Route: {source.capitalize()} to {destination.capitalize()}",
                    "tolls": [],
                    "api_source": "Estimator",
                    "estimated": True
                })
                
        return flight_options
