from agents.route_agent import BaseAgent
import time
from services.poi_service import POIService
from services.recommendation_engine import RecommendationEngine

class POIAgent(BaseAgent):
    """
    Agent responsible for requesting POIs near the destination and 
    grouping/ranking them into neat categories.
    """
    def __init__(self, name="POIAgent"):
        super().__init__(name)
        self.poi_service = POIService()
        self.poi_service = POIService()

    def process(self, data):
        print(f"[{self.name}] Discovering local Points of Interest...")
        
        # We need the destination coordinates. If not directly provided, 
        # we will extract them from the user_input or general data block once geocoded
        dest_coords = data.get("destCoords") 
        if not dest_coords:
            # Look inside user_input block if it exists
            ui = data.get("user_input", {})
            dest_coords = ui.get("destCoords")
            
        if not dest_coords:
            print(f"[{self.name}] No destination coordinates found, skipping POI discovery.")
            return []

        try:
            # Extract lat/lon from "lon,lat" string or list
            if isinstance(dest_coords, str):
                parts = dest_coords.split(',')
                dest_lon = float(parts[0])
                dest_lat = float(parts[1])
            elif isinstance(dest_coords, (list, tuple)) and len(dest_coords) == 2:
                dest_lon = float(dest_coords[0])
                dest_lat = float(dest_coords[1])
            else:
                 print(f"[{self.name}] Malformed destination coordinates: {dest_coords}")
                 return []
        except Exception as e:
             print(f"[{self.name}] Could not parse destination coordinates: {e}")
             return []

        # Fetch raw POIs
        raw_pois = self.poi_service.get_pois(dest_lat, dest_lon)
        
        engine = RecommendationEngine()
        
        # Split raw into distinct lists to feed into the recommendation engine
        raw_attractions = [p for p in raw_pois if p["type"] in ["attraction", "monument", "park"]]
        raw_restaurants = [p for p in raw_pois if p["type"] in ["restaurant", "cafe"]]
        
        # Rank them intelligently
        ranked_attractions = engine.rank_attractions(raw_attractions, dest_lat, dest_lon)
        ranked_restaurants = engine.rank_restaurants(raw_restaurants, dest_lat, dest_lon)
        
        # Group to match legacy output
        grouped = {
            "attractions": [a for a in ranked_attractions if a["type"] == "attraction"],
            "parks": [a for a in ranked_attractions if a["type"] == "park"],
            "monuments": [a for a in ranked_attractions if a["type"] == "monument"],
            "restaurants": ranked_restaurants
        }
                
        return grouped
