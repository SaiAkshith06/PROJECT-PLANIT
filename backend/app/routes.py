import os
from flask import Blueprint, request, jsonify

# Try to import the planit script explicitly from the same directory
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from agents.route_agent import run_planit
    from services.dashboard_service import DashboardService
    from services.timeline_service import TimelineService
    from services.destination_intelligence import DestinationIntelligence
    from agents.chatbot_agent import ChatbotAgent
    from agents.trip_planner_agent import TripPlannerAgent
    from services.geocode_service import get_coordinates
except ImportError as e:
    print(f"Error importing modules: {e}")
    run_planit = None

bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def root():
    return jsonify({"status": "ok", "service": "planit-api"})

@bp.route('/api/itinerary', methods=['POST'])
def generate_itinerary():
    """
    API-only itinerary endpoint.

    Input JSON:
      { "destination": str, "days": int, "interests": list[str] }
    """
    payload = request.json or {}
    destination = payload.get("destination")
    days = payload.get("days", 3)
    interests = payload.get("interests", [])

    if not destination:
        return jsonify({"error": "destination is required"}), 400

    try:
        days = int(days)
    except (TypeError, ValueError):
        return jsonify({"error": "days must be an integer"}), 400

    if days <= 0:
        return jsonify({"error": "days must be >= 1"}), 400

    if interests is None:
        interests = []
    if not isinstance(interests, list):
        return jsonify({"error": "interests must be a list"}), 400

    try:
        dest = get_coordinates(destination)
        if not dest:
            return jsonify({"error": f"Could not geocode destination: {destination}"}), 400
        dest_lat, dest_lon = dest
        # Keep internal convention for agents: "lon,lat"
        dest_coords = f"{dest_lon},{dest_lat}"

        planner = TripPlannerAgent("TripPlannerAgent")
        data = {
            "destCoords": dest_coords,
            "user_input": {
                "duration": days,
                "destCoords": dest_coords,
                "destination": destination,
                "interests": interests,
            },
        }
        planned = planner.process(data)

        hotels = planned.get("recommended_hotels", [])
        restaurants = planned.get("restaurants", [])
        experiences = (
            planned.get("attractions", [])
            + planned.get("monuments", [])
            + planned.get("parks", [])
        )
        day_by_day_itinerary = planned.get("optimized_itinerary", {})

        return jsonify(
            {
                "destination": destination,
                "hotels": hotels,
                "experiences": experiences,
                "restaurants": restaurants,
                "day_by_day_itinerary": day_by_day_itinerary,
            }
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@bp.route('/api/plan', methods=['POST'])
def plan_trip():
    data = request.json
    source = data.get('source')
    destination = data.get('destination')
    source_coords = data.get('sourceCoords')
    dest_coords = data.get('destCoords')
    budget = data.get('budget', 5000)
    duration = data.get('duration', 3)
    
    if not source or not destination:
        return jsonify({"error": "Source and destination are required"}), 400

    if not run_planit:
        return jsonify({"error": "PlanIt backend not found"}), 500

    try:
        # Call our refactored multi-agent planning pipeline with optional exact coords
        result_dict = run_planit(source, destination, source_coords, dest_coords, budget=budget, duration=duration)
        
        dash_svc = DashboardService()
        
        # We need destination coordinates for the weather API inside DashboardService
        # If dest_coords is a string like '78.4867,17.3850', parse it:
        lat, lon = None, None
        if isinstance(dest_coords, str):
            try:
                parts = dest_coords.split(',')
                lon = float(parts[0])
                lat = float(parts[1])
            except: pass
        elif isinstance(dest_coords, (list, tuple)) and len(dest_coords) == 2:
             lon = float(dest_coords[0])
             lat = float(dest_coords[1])
             
        dashboard_block = dash_svc.generate_dashboard(destination, lat, lon, result_dict)
        
        t_svc = TimelineService()
        timeline_data = t_svc.process_itinerary(result_dict.get('optimized_itinerary'))
        
        result_dict["dashboard"] = dashboard_block
        result_dict["recommended_destinations"] = [destination]
        result_dict["timeline"] = timeline_data
        
        return jsonify(result_dict)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@bp.route('/api/opportunities', methods=['GET'])
def get_opportunities():
    """Serves the top 5 Best Trips Right Now suggestions based on live metrics"""
    try:
        import datetime
        
        # Determine current primary season based on month
        month = datetime.datetime.now().month
        if month in [12, 1, 2]: season = "winter"
        elif month in [3, 4, 5]: season = "spring"
        elif month in [6, 7, 8]: season = "summer"
        else: season = "autumn"
        
        # Default proxy start location (e.g. Center of India)
        # In a real app, this would be grabbed from the user's IP or geolocation
        start_lat = 20.5937
        start_lon = 78.9629
        
        # Assume a standard baseline budget of ₹10,000 for "general" opportunities
        baseline_budget = 10000 
        
        intelligence = DestinationIntelligence()
        top_dests = intelligence.get_top_opportunities(start_lat, start_lon, baseline_budget, season)
        
        return jsonify({"opportunities": top_dests})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to compute travel opportunities"}), 500

@bp.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint for processing natural language intents and returning Chatbot/Map data"""
    try:
        data = request.json
        user_message = data.get('message', '')
        context = data.get('context', {})
        
        if not user_message:
            return jsonify({"response": "Please provide a message", "data": {}}), 400
            
        chatbot = ChatbotAgent()
        result = chatbot.process(user_message, context)
        
        return jsonify(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": f"Sorry, I encountered an internal error: {e}", "data": {}}), 500
