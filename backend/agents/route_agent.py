"""
Route planning agents.
Contains the logic for finding best routes, estimating costs,
evaluating travel times, and resource management.
"""
import random
from services.geocode_service import get_coordinates
from services.routing_service import get_osrm_routes

class BaseAgent:
    def __init__(self, name):
        self.name = name

    def process(self, data):
        raise NotImplementedError("Each agent must implement the process() method")

class RouteAgent(BaseAgent):
    def process(self, user_input):
        print(f"[{self.name}] Finding routes via Open Source Routing (OSRM)...")
        source = user_input["source"]
        destination = user_input["destination"]
        
        src_coords = user_input.get("source_coords")
        dst_coords = user_input.get("dest_coords")
        
        # 1. Geocode Locations
        if not src_coords or not dst_coords:
            if not src_coords:
                src = get_coordinates(source)
                if src:
                    src_lat, src_lon = src
                    src_coords = f"{src_lon},{src_lat}"
            if not dst_coords:
                dst = get_coordinates(destination)
                if dst:
                    dst_lat, dst_lon = dst
                    dst_coords = f"{dst_lon},{dst_lat}"

        if not src_coords or not dst_coords:
            print(f"[{self.name}] Could not geocode source or destination. Using fallback data.")
            routes = [
                {"mode": "driving", "route": f"Simulated Route: {source} to {destination}", "distance_meters": 10000, "time_seconds": 1200, "geometry": None}
            ]
            return {"routes": routes, "user_input": user_input}

        # 2. Get Routing Data from OSRM via service
        routes = get_osrm_routes(src_coords, dst_coords, source, destination)
        
        return {"routes": routes, "user_input": user_input}

class CostAgent(BaseAgent):
    def process(self, data):
        print(f"[{self.name}] Estimating route costs with tolls...")
        for r in data["routes"]:
            r["tolls"] = []
            if r["mode"] == "driving":
                dist_km = r["distance_meters"] / 1000
                time_mins = r["time_seconds"] / 60
                
                toll_cost = 0
                num_tolls = int(dist_km / 60)
                
                if num_tolls > 0 and r["geometry"] and "coordinates" in r["geometry"]:
                    coords = r["geometry"]["coordinates"]
                    step = max(1, len(coords) // (num_tolls + 1))
                    for i in range(1, num_tolls + 1):
                        idx = i * step
                        if idx < len(coords):
                            toll_amount = random.choice([40, 60, 80, 100])
                            toll_cost += toll_amount
                            r["tolls"].append({
                                "location": coords[idx], # [lng, lat]
                                "cost": toll_amount
                            })
                
                ride_cost = r.get("base_fare", 50) + ((dist_km * 12.0 + time_mins * 1.5) * r.get("rate_multiplier", 1.0))
                ride_cost = ride_cost * r.get("surge", 1.0)
                
                r["cost"] = round(ride_cost + toll_cost)
                r["base_cost"] = round(ride_cost)
                r["toll_cost"] = toll_cost
            else:
                r["cost"] = 0.0
                r["toll_cost"] = 0.0
                r["base_cost"] = 0.0
                
            r["cost"] = round(r["cost"])
            r["toll_cost"] = round(r["toll_cost"])
            r["base_cost"] = round(r["base_cost"])
        return data

class TimeAgent(BaseAgent):
    def process(self, data):
        print(f"[{self.name}] Evaluating travel times...")
        for r in data["routes"]:
            r["score_time"] = 10000 / (r["time_seconds"] + 1)
        return data

class ResourceAgent(BaseAgent):
    def process(self, data):
        print(f"[{self.name}] Checking resource feasibility...")
        feasible_routes = []
        for r in data["routes"]:
            r["feasible"] = True
            feasible_routes.append(r)
                
        data["routes"] = feasible_routes
        return data

class DecisionFusion:
    @staticmethod
    def select_best(routes):
        print("[Fusion] Selecting optimal route...")
        if not routes: return None
        return min(routes, key=lambda x: x["time_seconds"])

def run_planit(source, destination, source_coords=None, dest_coords=None, budget=5000, duration=3):
    """
    Main pipeline integrating all route planning agents.
    """
    from agents.recommendation_agent import RecommendationAgent
    from agents.transport_aggregator import TransportAggregator
    from agents.trip_generator_agent import TripGeneratorAgent
    from agents.trip_planner_agent import TripPlannerAgent

    user_input = {
        "source": source,
        "destination": destination,
        "source_coords": source_coords,
        "dest_coords": dest_coords,
        "destCoords": dest_coords,
        "budget": budget,
        "duration": duration
    }

    route_agent = RouteAgent("RouteAgent")
    cost_agent = CostAgent("CostAgent")
    time_agent = TimeAgent("TimeAgent")
    resource_agent = ResourceAgent("ResourceAgent")
    transport_aggregator = TransportAggregator("TransportAggregator")
    rec_agent = RecommendationAgent("RecommendationAgent")
    generator_agent = TripGeneratorAgent("TripGeneratorAgent")

    # Pipeline
    # 0. Generate smart intents from arbitrary strings before routing begins
    user_input = generator_agent.process(user_input)
    
    # 1. Routing Loop
    data = route_agent.process(user_input)
    data = cost_agent.process(data)
    data = time_agent.process(data)
    data = resource_agent.process(data)
    
    # Multimodal Integration
    multimodal_routes = transport_aggregator.process(data)
    data["routes"].extend(multimodal_routes)
    
    data = rec_agent.process(data)

    best_route = DecisionFusion.select_best(data["routes"])
    
    # NEW Travel Platform Features:
    trip_planner = TripPlannerAgent("TripPlannerAgent")
    data = trip_planner.process(data)

    return {
        "best_route": best_route,
        "all_routes": data["routes"],
        "recommended_hotels": data.get("recommended_hotels", []),
        "attractions": data.get("attractions", []),
        "restaurants": data.get("restaurants", []),
        "monuments": data.get("monuments", []),
        "parks": data.get("parks", []),
        "optimized_itinerary": data.get("optimized_itinerary", {}),
        "budget_breakdown": data.get("budget_breakdown", {})
    }
