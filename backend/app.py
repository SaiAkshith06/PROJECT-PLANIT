from flask_cors import CORS
CORS(app)
from flask import Flask, request, jsonify

# Try to import the planit script explicitly from the same directory
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from agents.route_agent import run_planit
except ImportError as e:
    print(f"Error importing run_planit: {e}")
    run_planit = None

app = Flask(__name__, static_folder=None)

@app.route('/')
def index():
    return jsonify({"status": "ok", "service": "planit-api"})

@app.route('/api/plan', methods=['POST'])
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
        
        from services.dashboard_service import DashboardService
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
        
        result_dict["dashboard"] = dashboard_block
        result_dict["recommended_destinations"] = [destination]
        
        from services.timeline_service import TimelineService
        timeline_svc = TimelineService()
        if "optimized_itinerary" in result_dict:
            result_dict["timeline"] = timeline_svc.process_itinerary(result_dict["optimized_itinerary"])
        
        return jsonify(result_dict)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/opportunities', methods=['GET'])
def get_opportunities():
    """Serves the top 5 Best Trips Right Now suggestions based on live metrics"""
    try:
        from services.destination_intelligence import DestinationIntelligence
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

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint for processing natural language intents and returning Chatbot/Map data"""
    try:
        from agents.chatbot_agent import ChatbotAgent
        
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

if __name__ == '__main__':
    # Run the server on port 5001 to avoid macOS ControlCenter conflict
    app.run(debug=True, port=5001)
