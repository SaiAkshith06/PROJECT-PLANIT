from services.chat_service import ChatService
from agents.trip_generator_agent import TripGeneratorAgent
from agents.poi_agent import POIAgent
from agents.hotel_agent import HotelAgent
from agents.transport_aggregator import TransportAggregator
from services.geocode_service import get_coordinates

class ChatbotAgent:
    def __init__(self):
        self.name = "ChatbotAgent"
        self.chat_service = ChatService()
        self.poi_agent = POIAgent()
        self.hotel_agent = HotelAgent()

    def process(self, query: str, context: dict = None) -> dict:
        """
        Process a natural language chat query, determine the intent,
        and route it to the appropriate subsystem. Returns chat response and structured data.
        """
        intent = self.chat_service.determine_intent(query)
        location = self.chat_service.extract_location(query)
        
        # We need a location for most queries except general chat
        if not location and intent != "general" and context and 'destination' in context:
             location = context['destination']

        if not location and intent in ["restaurant", "hotel", "attractions"]:
             return {
                 "response": "Could you specify which city or location you're asking about? For example: 'Find hotels in Warangal'.",
                 "data": {}
             }

        # Route based on explicit intent
        if intent == "trip":
            # Hand off to Trip Generator logic
            tg_agent = TripGeneratorAgent()
            # Simple simulation using the generator logic
            params = tg_agent.process({"travel_intent": query})
            dest = params.get('destination', location or 'Unknown')
            budget = params.get('budget_max', 'Unknown')
            days = params.get('duration', 'Unknown')
            
            params['destination'] = dest
            
            return {
                "response": f"I can help plan a {days}-day trip to {dest} with a budget of ₹{budget}. Should I generate the full Smart Trip for you?",
                "data": {"action": "trigger_smart_trip", "params": params}
            }

        elif intent == "restaurant":
            return self._handle_poi_query(location, category="restaurants", query=query)

        elif intent == "attractions":
             return self._handle_poi_query(location, category="attractions", query=query)

        elif intent == "hotel":
             # Extract explicit budget mention if any
             budget_level = "Medium"
             if "cheap" in query.lower() or "budget" in query.lower(): budget_level = "Budget"
             if "luxury" in query.lower() or "best" in query.lower() or "5 star" in query.lower(): budget_level = "Luxury"
             
             try:
                 coords = get_coordinates(location)
                 if not coords:
                     raise Exception("No coordinates found")
                 lat, lon = coords
                 
                 hotels = self.hotel_agent.process(lat, lon, budget_level=budget_level)
                 
                 response = f"I found {len(hotels)} {budget_level.lower()} hotels in {location}. Here are the top suggestions!"
                 if not hotels:
                     response = f"I couldn't find any {budget_level.lower()} hotels in {location} right now."
                     
                 return {
                     "response": response,
                     "data": {"recommended_hotels": hotels, "location": {"lat": lat, "lon": lon}}
                 }
             except Exception as e:
                 return {"response": f"Sorry, I had trouble finding hotels in {location}.", "data": {}}

        elif intent == "transport":
             return {
                 "response": "To find transport options, please use the main form to enter your Source and Destination, and I'll aggregate the cheapest Flights, Trains, Buses, and Cabs for you!",
                 "data": {}
             }
             
        elif intent == "destination":
            # Extract basic budget/timeline hints
            budget = 10000 # Default baseline
            
            import re
            budget_match = re.search(r'(?:under|for|budget of)?\s*₹?(\d+)', query)
            if budget_match: 
                budget = int(budget_match.group(1))
            elif "cheap" in query.lower() or "budget" in query.lower():
                budget = 5000
                
            from services.destination_intelligence import DestinationIntelligence
            import datetime
            month = datetime.datetime.now().month
            if month in [12, 1, 2]: season = "winter"
            elif month in [3, 4, 5]: season = "spring"
            elif month in [6, 7, 8]: season = "summer"
            else: season = "autumn"
            
            # Using center of India as mock geoloc
            recommender = DestinationIntelligence()
            recs = recommender.get_top_opportunities(20.5937, 78.9629, budget, season)
            
            if not recs:
                return {"response": "I couldn't find any destinations matching those constraints right now.", "data": {}}
            
            top_dest = recs[0]['destination']
            names = [f"• **{r['destination']}** (Est. ₹{r['estimated_cost']}) - AI Score: {r['score']}/10" for r in recs[:3]]
            
            return {
                "response": f"Based on your budget of ₹{budget} and current real-time weather, here are the Best Trips Right Now:\n\n" + "\n".join(names) + f"\n\nShould I start planning a trip to {top_dest}?",
                "data": {"action": "fill_destination", "params": {"destination": top_dest}}
            }

        elif intent == "dashboard":
            return {
                "response": "I'm pulling up your Live Travel Dashboard right now! You'll see today's weather, your selected hotel, and the itinerary overview.",
                "data": {"action": "trigger_smart_trip", "params": {}} # Assuming trigger_smart_trip runs the new pipeline returning the dashboard
            }

        else:
            return {
                "response": "Hi! I'm your PlanIt AI Assistant. I can help you find hotels, discover local restaurants and attractions, or generate full trip itineraries! Just ask me things like 'Find cheap hotels in Hampi' or 'Plan a 3-day trip from Hyderabad'.",
                "data": {}
            }

    def _handle_poi_query(self, location: str, category: str, query: str) -> dict:
        try:
            coords = get_coordinates(location)
            if not coords:
                raise Exception("No coordinates found")
            lat, lon = coords
            
            poi_results = self.poi_agent.process(lat, lon)
            
            items = poi_results.get(category, [])
            display_cat = "places to eat" if category == "restaurants" else "places to visit"
            
            if not items:
                return {"response": f"I couldn't find any notable {display_cat} in {location}.", "data": {}}
                
            top_names = [f"• {item['name']}" for item in items[:3]]
            response = f"I found {len(items)} {display_cat} in {location}. Here are a few top picks:\n" + "\n".join(top_names)
            
            return {
                "response": response,
                "data": {category: items, "location": {"lat": lat, "lon": lon}}
            }
        except Exception as e:
            return {"response": f"Sorry, I couldn't fetch the map data for {location}.", "data": {}}
