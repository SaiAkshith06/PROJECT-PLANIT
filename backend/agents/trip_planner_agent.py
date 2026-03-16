from agents.route_agent import BaseAgent
from agents.hotel_agent import HotelAgent
from agents.poi_agent import POIAgent
from services.route_optimizer import RouteOptimizer

class TripPlannerAgent(BaseAgent):
    """
    Master orchestrator for the Travel Platform.
    Fetches Hotels, gathers POIs, and uses nearest-neighbor geometric sorting 
    to build an optimized daily sightseeing itinerary.
    """
    def __init__(self, name="TripPlannerAgent"):
        super().__init__(name)
        self.hotel_agent = HotelAgent()
        self.poi_agent = POIAgent()
        self.optimizer = RouteOptimizer()

    def process(self, data):
        print(f"[{self.name}] Building Smart Trip Itinerary...")
        
        user_input = data.get("user_input", {})
        dest_coords = data.get("destCoords") or user_input.get("destCoords")
        duration_days = int(user_input.get("duration", 3)) # Default 3 days
        
        if not dest_coords:
            print(f"[{self.name}] No destination coordinates. Skipping Trip Planning.")
            return data
            
        # 1. Fetch Accommodation
        hotels = self.hotel_agent.process(data)
        data["recommended_hotels"] = hotels
        
        # 2. Fetch Sightseeing & Dining
        pois = self.poi_agent.process(data)
        data["attractions"] = pois.get("attractions", [])
        data["restaurants"] = pois.get("restaurants", [])
        data["parks"] = pois.get("parks", [])
        data["monuments"] = pois.get("monuments", [])
        
        # 3. Optimize Route
        # Select the best hotel as our starting point
        start_lat, start_lon = None, None
        if hotels and len(hotels) > 0:
            h = hotels[0]
            try:
                start_lat = float(h["lat"])
                start_lon = float(h["lon"])
            except (ValueError, TypeError):
                pass
                
        # Fallback to destination center if no hotel found
        if not start_lat and isinstance(dest_coords, str):
             parts = dest_coords.split(',')
             start_lon = float(parts[0])
             start_lat = float(parts[1])
             
        if not start_lat:
            # Cannot optimize without a starting point
            data["optimized_itinerary"] = {}
            return data
            
        # Combine attractions and monuments for sightseeing
        all_sightseeing = data["attractions"] + data["monuments"] + data["parks"]
        
        # Nearest Neighbor Optimization
        optimized_tour = self.optimizer.optimize_route(start_lat, start_lon, all_sightseeing)
        
        # 4. Generate Day-by-Day Itinerary
        itinerary = {}
        pois_per_day = max(2, len(optimized_tour) // duration_days) 
        
        current_poi_idx = 0
        for day in range(1, duration_days + 1):
            day_plan = []
            
            # Morning Activity
            if current_poi_idx < len(optimized_tour):
                day_plan.append({"time": "Morning", "activity": f"Visit {optimized_tour[current_poi_idx]['name']}", "type": "sightseeing", "poi": optimized_tour[current_poi_idx]})
                current_poi_idx += 1
                
            # Lunch
            if day <= len(data["restaurants"]):
                lunch_spot = data["restaurants"][day-1]
                day_plan.append({"time": "Lunch", "activity": f"Eat at {lunch_spot['name']}", "type": "dining", "poi": lunch_spot})
                
            # Afternoon Activity
            if current_poi_idx < len(optimized_tour):
                day_plan.append({"time": "Afternoon", "activity": f"Explore {optimized_tour[current_poi_idx]['name']}", "type": "sightseeing", "poi": optimized_tour[current_poi_idx]})
                current_poi_idx += 1
                
            # Dinner
            if (day + duration_days - 1) < len(data["restaurants"]):
                 dinner_spot = data["restaurants"][day + duration_days - 1]
                 day_plan.append({"time": "Dinner", "activity": f"Dine at {dinner_spot['name']}", "type": "dining", "poi": dinner_spot})
                 
            itinerary[f"Day {day}"] = day_plan
            
        data["optimized_itinerary"] = itinerary
        
        # 5. Calculate Budget Breakdown Tracker
        data = self._calculate_budget_breakdown(data, hotels, duration_days)
        
        return data

    def _calculate_budget_breakdown(self, data, hotels, duration_days):
        print(f"[{self.name}] Calculating Budget Breakdown...")
        budget_summary = {
            "Transport": 0,
            "Hotel": 0,
            "Food": duration_days * 1200, # Approx 1200/day
            "Activities": duration_days * 800  # Approx 800/day
        }
        
        # Add Hotel
        if hotels and len(hotels) > 0:
            budget_summary["Hotel"] = hotels[0].get("estimated_price", 2000) * duration_days
            
        # Add Transport (take the price of the top recommended route)
        if data.get("routes") and len(data["routes"]) > 0:
            try:
                # Find the 'recommended' marked route, or just take the first one
                recommended = next((r for r in data["routes"] if r.get("label") == "recommended"), data["routes"][0])
                budget_summary["Transport"] = recommended.get("cost", 0)
            except Exception:
                pass
                
        budget_summary["Total"] = sum(budget_summary.values())
        data["budget_breakdown"] = budget_summary
        
        return data
