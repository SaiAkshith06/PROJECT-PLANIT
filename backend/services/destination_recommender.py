import json
import os
import math
from datetime import datetime

class DestinationRecommender:
    def __init__(self):
        dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "destinations.json")
        try:
            with open(dataset_path, "r") as f:
                self.destinations = json.load(f)
        except Exception as e:
            print(f"[DestinationRecommender] Failed to load dataset: {e}")
            self.destinations = []

    def _get_current_season(self):
        month = datetime.now().month
        if month in [12, 1, 2]: return "winter"
        elif month in [3, 4, 5]: return "spring"
        elif month in [6, 7, 8]: return "summer"
        else: return "autumn"

    def _haversine(self, lat1, lon1, lat2, lon2):
        if not lat1 or not lon1:
            return 0
        R = 6371  # Earth radius km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def recommend(self, starting_city=None, starting_lat=None, starting_lon=None, budget=None, duration=None):
        """
        Ranks top 5 destinations based on Weather (Open-Meteo), distance, and affordability.
        """
        current_season = self._get_current_season()
        
        # We need the weather service to check actual live temperatures for scoring
        from services.weather_service import WeatherService
        ws = WeatherService()
        
        ranked = []
        
        for dest in self.destinations:
            # 1. Budget hard filter
            # Avg cost is roughly per day
            total_est = dest["avg_cost"] * (duration if duration else 3)
            
            # If the user supplied a budget but it's totally impossible, heavily penalize it 
            # (or filter it out, but we prefer soft penalties so they at least get 'something')
            if budget and total_est > int(budget) * 1.5:
                continue
                
            est_cost_score = max(0, 1 - (total_est / (int(budget) if budget else 10000)))
            
            # 2. Season affinity
            season_score = 1.0 if current_season in dest["best_season"] else 0.5
            
            # 3. Weather affinity (Live data)
            weather = ws.get_weather(dest["lat"], dest["lon"])
            w_score = 1.0
            
            try:
                temp = int(weather["temperature"].replace("°C", ""))
                rain = weather.get("rain_probability", 0)
                
                # Penalize extreme heat/cold
                if temp > 35 or temp < 5: w_score -= 0.4
                elif 20 <= temp <= 28: w_score += 0.2
                
                # Penalize high rain
                if rain > 50: w_score -= 0.3
            except:
                pass

            # 4. Distance score (Closer is slightly better if everything else is equal)
            dist = self._haversine(starting_lat, starting_lon, dest["lat"], dest["lon"])
            # Assuming typical domestic flight radius of 2000km max
            dist_score = max(0, 1 - (dist / 2000.0))

            # Composite heuristic
            final_score = (w_score * 0.4) + (season_score * 0.3) + (est_cost_score * 0.2) + (dist_score * 0.1)
            
            ranked.append({
                "destination": dest["name"],
                "estimated_cost": total_est,
                "weather": f"{weather['temperature']} {weather['condition']}",
                "travel_time": f"{round(dist / 600)}h" if dist > 0 else "Unknown", # rough commercial air speed
                "score": round(final_score, 3)
            })
            
        ranked.sort(key=lambda x: x["score"], reverse=True)
        return ranked[:5]
