import json
import os
import math
from services.weather_service import WeatherService

class DestinationIntelligence:
    def __init__(self):
        self.weather_service = WeatherService()
        self.dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'destinations.json')
        self.destinations = self._load_destinations()

    def _load_destinations(self):
        try:
            with open(self.dataset_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[DestinationIntelligence] Error loading dataset: {e}")
            return []

    def get_top_opportunities(self, start_lat: float, start_lon: float, budget: float, current_season: str) -> list:
        scored_dests = []
        for dest in self.destinations:
            # 1. Weather Score
            weather_score = 5.0 # Default if API fails
            try:
                weather_data = self.weather_service.get_weather(dest["lat"], dest["lon"])
                if weather_data["condition"] != "Unknown":
                    # Ideal temp ~ 20-30C
                    temp = weather_data.get("temperature", 0)
                    if isinstance(temp, str): temp = float(temp.replace('°C', '').strip())
                    
                    if 20 <= temp <= 30:
                        weather_score = 9.0
                    elif 15 <= temp < 20 or 30 < temp <= 35:
                        weather_score = 7.0
                    else:
                        weather_score = 4.0
                    
                    # Penalize rain
                    rain_prob = weather_data.get("rain_probability", 0)
                    if rain_prob > 50:
                        weather_score -= 3.0
                    elif rain_prob > 20:
                        weather_score -= 1.5
                        
                    weather_score = max(0.0, min(10.0, weather_score))
            except dict:
                pass

            # 2. Cost Score
            avg_trip_cost = dest.get("avg_trip_cost", 5000)
            cost_difference = budget - avg_trip_cost
            if cost_difference >= 0:
                cost_score = min(10.0, 5.0 + (cost_difference / 1000.0))
            else:
                cost_score = max(0.0, 5.0 - (abs(cost_difference) / 500.0))

            # 3. Travel Time Score (Based on Haversine distance as proxy)
            distance = self._haversine(start_lat, start_lon, dest["lat"], dest["lon"])
            # Assuming max domestic travel is ~2500km
            time_score = max(0.0, 10.0 - (distance / 250.0))

            # 4. Popularity Score (Mock static attribute, assign random-ish high score for demo)
            # You'd hook this to real search volume in production
            popularity_score = 8.0 

            # 5. Season Match
            season_score = 10.0 if current_season.lower() in [s.lower() for s in dest.get("best_season", [])] else 3.0

            # Calculate Final Weighted Score
            final_score = (0.3 * weather_score) + (0.25 * cost_score) + (0.2 * time_score) + (0.15 * popularity_score) + (0.1 * season_score)

            scored_dests.append({
                "destination": dest["name"],
                "score": round(final_score, 1),
                "estimated_cost": avg_trip_cost,
                "type": dest["type"]
            })

        # Sort desc by score
        scored_dests.sort(key=lambda x: x["score"], reverse=True)
        return scored_dests[:5]

    def _haversine(self, lat1, lon1, lat2, lon2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        return R * c
