import requests
from cachetools import cached, TTLCache

# Cache for 15 minutes
weather_cache = TTLCache(maxsize=100, ttl=900)

class WeatherService:
    @cached(weather_cache)
    def get_weather(self, lat, lon):
        """
        Fetches current weather and daily precipitation probability
        from Open-Meteo API. Maps WMO weather codes to human readable strings.
        """
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,weather_code",
            "daily": "precipitation_probability_max",
            "timezone": "auto"
        }
        
        try:
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # WMO Weather interpretation codes
            # 0: Clear sky, 1-3: Partly cloudy, 45-48: Fog, 51-55: Drizzle, 61-65: Rain, 71-75: Snow, 95+: Thunderstorm
            wmo_code = data["current"]["weather_code"]
            condition = "Clear"
            if wmo_code in [1, 2, 3]: condition = "Partly Cloudy"
            elif wmo_code in [45, 48]: condition = "Fog"
            elif wmo_code in [51, 53, 55, 61, 63, 65, 80, 81, 82]: condition = "Rain"
            elif wmo_code in [71, 73, 75, 85, 86]: condition = "Snow"
            elif wmo_code >= 95: condition = "Thunderstorm"

            temperature = data["current"]["temperature_2m"]
            rain_prob = data["daily"]["precipitation_probability_max"][0] if data.get("daily") else 0
            
            return {
                "temperature": f"{round(temperature)}°C",
                "condition": condition,
                "rain_probability": rain_prob
            }
            
        except Exception as e:
            print(f"[WeatherService] API Error: {e}")
            return {
                "temperature": "Unknown",
                "condition": "Unknown",
                "rain_probability": 0
            }
