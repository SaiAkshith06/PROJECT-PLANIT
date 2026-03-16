from agents.route_agent import BaseAgent
from services.hotel_service import HotelService
from services.recommendation_engine import RecommendationEngine

class HotelAgent(BaseAgent):
    """
    Agent responsible for requesting hotels near the destination and 
    filtering them based on user budget preferences.
    """
    def __init__(self, name="HotelAgent"):
        super().__init__(name)
        self.hotel_service = HotelService()
        self.hotel_service = HotelService()

    def process(self, data):
        print(f"[{self.name}] Discovering local Hotels...")
        
        dest_coords = data.get("destCoords") 
        user_input = data.get("user_input", {})
        
        if not dest_coords:
            dest_coords = user_input.get("destCoords")
            
        if not dest_coords:
            print(f"[{self.name}] No destination coordinates found, skipping hotel discovery.")
            return []

        try:
            if isinstance(dest_coords, str):
                parts = dest_coords.split(',')
                dest_lon = float(parts[0])
                dest_lat = float(parts[1])
            elif isinstance(dest_coords, (list, tuple)) and len(dest_coords) == 2:
                dest_lon = float(dest_coords[0])
                dest_lat = float(dest_coords[1])
            else:
                 return []
        except Exception:
             return []
             
        # Fetch raw Hotels (top 15)
        raw_hotels = self.hotel_service.get_hotels(dest_lat, dest_lon)
        
        # User defined preference map 
        budget_pref = user_input.get("budget_tier", "Mid-range")
        
        engine = RecommendationEngine()
        
        ranked_hotels = engine.rank_hotels(raw_hotels, dest_lat, dest_lon, budget_level=budget_pref)
        
        if not ranked_hotels and raw_hotels:
            print(f"[{self.name}] Smart Ranking returned empty. Returning default raw list.")
            return raw_hotels[:5]
            
        return ranked_hotels
