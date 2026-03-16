"""
Recommendation system to analyze and label multiple routes.
Identifies Recommended, Fastest, and Cheapest routes.
"""
from agents.route_agent import BaseAgent

class RecommendationAgent(BaseAgent):
    def process(self, data):
        print(f"[{self.name}] Analyzing and recommending routes...")
        routes = data.get("routes", [])
        
        if not routes:
            return data

        # Calculate scores and find minimums within each category
        # Score = (duration * 0.5) + (cost * 0.3) + (distance * 0.2)
        # Note: We normalize the metrics so they contribute more evenly to the score, 
        # otherwise distance (in meters) will dominate cost and duration.
        
        categories = {}
        
        for r in routes:
            dist_km = r["distance_meters"] / 1000.0
            dur_mins = r["time_seconds"] / 60.0
            cost = r["cost"]
            
            # Weighted Score calculation
            r["score"] = (dur_mins * 0.5) + (cost * 0.3) + (dist_km * 0.2)
            r["label"] = "normal"
            category = r.get("category", "cab")
            
            if category not in categories:
                categories[category] = []
            
            categories[category].append(r)

        # Label the best routes per category
        for category, cat_routes in categories.items():
            if not cat_routes: continue
            
            fastest = min(cat_routes, key=lambda x: x["time_seconds"])
            cheapest = min(cat_routes, key=lambda x: x["cost"])
            recommended = min(cat_routes, key=lambda x: x["score"])
            
            # Prioritize labels: Recommended > Fastest > Cheapest
            if cheapest != recommended and cheapest != fastest:
                cheapest["label"] = "cheapest"
                
            if fastest != recommended:
                fastest["label"] = "fastest"
                
            recommended["label"] = "recommended"

        data["routes"] = routes
        return data
