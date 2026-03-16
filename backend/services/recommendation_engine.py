import math

class RecommendationEngine:
    def __init__(self):
        # Weights for hotel types
        self.hotel_weights = {
            "resort": 3,
            "hotel": 2,
            "guest_house": 1,
            "hostel": 1
        }
        
    def _haversine(self, lat1, lon1, lat2, lon2):
        """Calculates distance between two lat/lon points in km"""
        R = 6371  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) * math.sin(dlon / 2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def rank_hotels(self, hotels, target_lat, target_lon, budget_level="Medium"):
        ranked = []
        for h in hotels:
            # 1. Category Score (0 to 3) -> normalized to (0 to 1)
            h_type = h.get("type", "hotel")
            cat_weight = self.hotel_weights.get(h_type, 1)
            cat_score = cat_weight / 3.0
            
            # 2. Distance Score (Closer is better)
            dist_km = self._haversine(target_lat, target_lon, h["lat"], h["lon"])
            # Assuming max acceptable search radius is ~20km, distance > 20 gets 0 score.
            dist_score = max(0, 1 - (dist_km / 20.0))
            
            # 3. Price Score
            # Evaluate how well it fits the budget level.
            est_cost = h.get("estimated_price", 1000)
            if budget_level == "Budget" and est_cost <= 1000: price_score = 1.0
            elif budget_level == "Mid-range" and 1000 < est_cost <= 4000: price_score = 1.0
            elif budget_level == "Luxury" and est_cost > 4000: price_score = 1.0
            else: price_score = 0.3 # Penalty for being out of ideal budget bracket
            
            h["distance_km"] = round(dist_km, 2)
            
            # Formula: 0.4 × distance + 0.3 × price + 0.3 × category
            final_score = (0.4 * dist_score) + (0.3 * price_score) + (0.3 * cat_score)
            
            h["ranking_score"] = round(final_score, 3)
            ranked.append(h)
            
        # Sort by score descending and return top 5
        ranked.sort(key=lambda x: x["ranking_score"], reverse=True)
        return ranked[:5]

    def rank_attractions(self, attractions, target_lat, target_lon):
        ranked = []
        # tourism=attraction → 3, historic=monument → 2, leisure=park → 1
        for a in attractions:
            t = a.get("type", "attraction")
            if t == "attraction": cat_weight = 3
            elif t == "monument": cat_weight = 2
            elif t == "park": cat_weight = 1
            else: cat_weight = 1
            
            cat_score = cat_weight / 3.0
            
            dist_km = self._haversine(target_lat, target_lon, a["lat"], a["lon"])
            dist_score = max(0, 1 - (dist_km / 20.0))
            a["distance_km"] = round(dist_km, 2)
            
            # Formula: 0.6 × category + 0.4 × distance
            a["ranking_score"] = round((0.6 * cat_score) + (0.4 * dist_score), 3)
            ranked.append(a)
            
        ranked.sort(key=lambda x: x["ranking_score"], reverse=True)
        return ranked[:10]

    def rank_restaurants(self, restaurants, target_lat, target_lon):
        ranked = []
        # restaurant → 2, cafe → 1
        for r in restaurants:
            t = r.get("type", "restaurant")
            cat_weight = 2 if t == "restaurant" else 1
            cat_score = cat_weight / 2.0
            
            dist_km = self._haversine(target_lat, target_lon, r["lat"], r["lon"])
            dist_score = max(0, 1 - (dist_km / 10.0)) # restaurants should be closer ideally
            r["distance_km"] = round(dist_km, 2)
            
            # Score formula identical structure
            r["ranking_score"] = round((0.6 * cat_score) + (0.4 * dist_score), 3)
            ranked.append(r)
            
        ranked.sort(key=lambda x: x["ranking_score"], reverse=True)
        return ranked[:10]
