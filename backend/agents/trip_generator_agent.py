import re
from agents.route_agent import BaseAgent

class TripGeneratorAgent(BaseAgent):
    """
    Parses a conversational "travel intent" string to extract budget, duration,
    and fallback default origins to feed into the transport planner system.
    """
    def __init__(self, name="TripGeneratorAgent"):
        super().__init__(name)
        
    def process(self, data):
        print(f"[{self.name}] Parsing smart travel intent...")
        
        intent = data.get("travel_intent", "").lower()
        if not intent:
            return data

        # 1. Extract Budget
        # Matches patterns like "under 8000", "budget 8000", "for ₹8000", "8000 rs"
        budget_match = re.search(r'(?:under|budget|for|₹|rs\.?)\s*(\d{3,5})', intent)
        if budget_match:
            try:
                budget = int(budget_match.group(1))
                data["budget_max"] = budget
                # Assign tier heuristic
                if budget <= 10000: data["budget_tier"] = "Budget"
                elif budget <= 25000: data["budget_tier"] = "Mid-range"
                else: data["budget_tier"] = "Luxury"
                print(f"[{self.name}] Detected Budget limit: ₹{budget} ({data['budget_tier']})")
            except ValueError:
                pass
                
        # 2. Extract Duration
        # Matches patterns like "3 days", "3-day", "a week"
        duration_match = re.search(r'(\d+)\s*[-]*\s*days?', intent)
        if duration_match:
            try:
                data["duration"] = int(duration_match.group(1))
                print(f"[{self.name}] Detected Duration: {data['duration']} days")
            except ValueError:
                pass
        elif "weekend" in intent:
            data["duration"] = 2
        elif "week" in intent:
            data["duration"] = 7
            
        # 3. Destination recommendation logic is generally handled by the frontend passing
        # a selected destination to the route API. However, if 'from X' occurs without a 
        # clear destination, you could flag the system to auto-pick an affordable destination.
        
        return data
