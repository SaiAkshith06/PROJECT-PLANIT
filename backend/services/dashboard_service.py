from services.weather_service import WeatherService

class DashboardService:
    def __init__(self):
        self.weather_service = WeatherService()

    def generate_dashboard(self, destination, dest_lat, dest_lon, trip_plan):
        """
        Aggregates data for the Live Travel Dashboard from the existing generated trip plan.
        trip_plan: The final output dict containing 'hotels', 'itinerary', 'transport'
        """
        dashboard = {}
        
        # 1. Trip Overview
        dashboard["destination"] = destination
        
        # 2. Destination Weather (Live)
        if dest_lat and dest_lon:
            weather = self.weather_service.get_weather(dest_lat, dest_lon)
            if weather["condition"] != "Unknown":
                dashboard["weather"] = f"{weather['temperature']} {weather['condition']}"
                if weather.get('rain_probability', 0) > 0:
                     dashboard["weather"] += f" ({weather['rain_probability']}% Rain)"
            else:
                dashboard["weather"] = "Weather Unavailable"
        else:
            dashboard["weather"] = "Weather Unavailable"
            
        # 3. Transport Status (Simulated Live Integration)
        transports = trip_plan.get("all_routes", [])
        if transports:
            # Grab the best flight or first option
            best_tx = transports[0]
            mode = str(best_tx.get("mode", "Transport")).capitalize()
            # If mode says "train", "flight", "bus" it's general transport
            dashboard["transport"] = f"Booked via {mode} - On Time"
        else:
            dashboard["transport"] = "No Transport Booked"
            
        # 4. Hotel Details
        hotels = trip_plan.get("recommended_hotels", [])
        if hotels:
             # Grab top recommendation
             dashboard["hotel"] = hotels[0].get("name", "Unbooked Accommodation")
        else:
             dashboard["hotel"] = "No Hotel Selected"
             
        # 5. Today's Itinerary Overview
        itinerary_days = trip_plan.get("optimized_itinerary", {})
        if itinerary_days:
            day_keys = sorted(list(itinerary_days.keys()))
            if day_keys:
                day1 = itinerary_days[day_keys[0]]
                activities = [step.get("activity", "Activity") for step in day1]
                dashboard["today_plan"] = activities[:4] # Store max 4 for widget
            else:
                dashboard["today_plan"] = ["Relax and verify arrival transportation."]
        else:
            dashboard["today_plan"] = ["Relax and verify arrival transportation."]
            
        return dashboard
