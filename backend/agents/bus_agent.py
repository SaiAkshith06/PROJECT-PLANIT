import json
import os
from agents.route_agent import BaseAgent

class BusAgent(BaseAgent):
    def __init__(self, name="BusAgent"):
        super().__init__(name)
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'buses.json')
        self.buses = self.load_data(data_path)
        # Import dynamically or initialize
        from services.transit_service import TransitService
        self.transit_service = TransitService()

    def load_data(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
        return []

    def process(self, data):
        print(f"[{self.name}] Filtering bus routes...")
        source = data.get("source", "").lower()
        destination = data.get("destination", "").lower()
        
        bus_options = []
        
        # 1. Attempt Real-Time GTFS Query
        try:
            api_buses = self.transit_service.get_transit_routes(source, destination)
            if api_buses:
                print(f"[{self.name}] Successfully fetched {len(api_buses)} routes via GTFS feed.")
            for b in api_buses:
                bus_options.append({
                    "category": "bus",
                    "mode": b["mode"],
                    "provider": b.get("route", "Bus"),
                    "time_seconds": b["duration"] * 60,
                    "cost": b["price"],
                    "distance_meters": b["duration"] * 60 * 10, # rough estimate
                    "route": f"Bus Route: {b['source']} to {b['destination']}",
                    "tolls": [],
                    "api_source": "GTFS"
                })
        except Exception as e:
            print(f"[{self.name}] GTFS query failed or unavailable: {e}. Falling back to buses.json.")

        # 2. Fallback to buses.json
        if not bus_options:
            for bus in self.buses:
                if bus["source"].lower() in source or source in bus["source"].lower():
                    if bus["destination"].lower() in destination or destination in bus["destination"].lower():
                        # Format to match the expected route dictionary structure
                        bus_options.append({
                            "category": "bus",
                            "mode": bus["mode"],
                            "provider": bus.get("provider", "Bus"),
                            "time_seconds": bus["duration"] * 60,  # Convert duration in mins to seconds
                            "cost": bus["price"],
                            "distance_meters": bus["duration"] * 60 * 10, # rough estimate
                            "route": f"Bus Route: {bus['source']} to {bus['destination']}",
                            "tolls": [],
                            "api_source": "Fallback JSON"
                        })
        # 3. Sort and limit
        bus_options = sorted(bus_options, key=lambda x: x["cost"])[:5]
        
        # 4. Fallback Pricing & Generation
        distance_km = data.get("distance_km", 300)
        from agents.price_estimator import estimate_price
        
        for b in bus_options:
            if not b.get("cost"):
                b["cost"] = estimate_price("bus", distance_km)
                b["estimated"] = True
                
        if len(bus_options) < 3:
            print(f"[{self.name}] Generating estimated fallback buses...")
            bus_names = ["TSRTC Premium", "KSRTC Airavat", "APSRTC Garuda", "Orange Travels", "VRL Travels"]
            while len(bus_options) < 3:
                idx = len(bus_options) + 1
                provider_name = bus_names[idx % len(bus_names)]
                bus_options.append({
                    "category": "bus",
                    "mode": "bus",
                    "provider": f"{provider_name} (Estimated)",
                    "time_seconds": int((distance_km / 40) * 3600),
                    "cost": estimate_price("bus", distance_km),
                    "distance_meters": distance_km * 1000,
                    "route": f"Estimated Bus Route: {source.capitalize()} to {destination.capitalize()}",
                    "tolls": [],
                    "api_source": "Estimator",
                    "estimated": True
                })
                
        return bus_options
