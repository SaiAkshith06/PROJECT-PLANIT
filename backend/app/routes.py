from flask import Blueprint, request, jsonify
from agents.route_agent import run_planit
from services.dashboard_service import DashboardService
from services.timeline_service import TimelineService
from services.destination_intelligence import DestinationIntelligence
from agents.chatbot_agent import ChatbotAgent
from agents.trip_planner_agent import TripPlannerAgent
from services.geocode_service import get_coordinates

bp = Blueprint('main', __name__)


# =========================
# HEALTH CHECK
# =========================
@bp.route('/', methods=['GET'])
def root():
    return jsonify({"status": "ok", "service": "planit-api"})


# =========================
# ITINERARY API
# =========================
@bp.route('/api/itinerary', methods=['POST'])
def generate_itinerary():
    """
    Generates smart itinerary using multi-agent system.
    """

    payload = request.json or {}

    destination = payload.get("destination")
    days = payload.get("days", 3)
    interests = payload.get("interests", [])

    # =========================
    # VALIDATION
    # =========================
    if not destination:
        return jsonify({"error": "destination is required"}), 400

    try:
        days = int(days)
        if days <= 0:
            return jsonify({"error": "days must be >= 1"}), 400
    except:
        return jsonify({"error": "days must be an integer"}), 400

    if not isinstance(interests, list):
        return jsonify({"error": "interests must be a list"}), 400

    try:
        print(f"[API] Request → {destination}, {days} days, interests={interests}")

        # =========================
        # STEP 1: GEOCODE
        # =========================
        dest = get_coordinates(destination)

        if not dest:
            return jsonify({"error": f"Could not geocode destination: {destination}"}), 400

        dest_lat, dest_lon = dest
        dest_coords = f"{dest_lon},{dest_lat}"

        print(f"[API] Coordinates → {dest_coords}")

        # =========================
        # STEP 2: INTEREST → PREFERENCE
        # =========================
        preference = interests[0] if interests else "general"

        # =========================
        # STEP 3: RUN PLANNER
        # =========================
        planner = TripPlannerAgent("TripPlannerAgent")

        data = {
            "destCoords": dest_coords,
            "user_input": {
                "duration": days,
                "destCoords": dest_coords,
                "destination": destination,
                "preference": preference,
            },
        }

        planned = planner.process(data)

        print("[API] Planner executed successfully")

        # =========================
        # STEP 4: RESPONSE FORMAT
        # =========================
        response = {
            "destination": destination,
            "hotels": planned.get("recommended_hotels", []),
            "experiences": (
                planned.get("attractions", [])
                + planned.get("monuments", [])
                + planned.get("parks", [])
            ),
            "restaurants": planned.get("restaurants", []),
            "day_by_day_itinerary": planned.get("optimized_itinerary", {})
        }

        return jsonify(response)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================
# FULL PLAN API (OPTIONAL)
# =========================
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
        return jsonify({"error": "Source and destination required"}), 400

    if not run_planit:
        return jsonify({"error": "PlanIt backend not available"}), 500

    try:
        result = run_planit(source, destination, source_coords, dest_coords, budget=budget, duration=duration)

        dash_svc = DashboardService()
        t_svc = TimelineService()

        lat, lon = None, None
        if isinstance(dest_coords, str):
            parts = dest_coords.split(',')
            lon = float(parts[0])
            lat = float(parts[1])

        dashboard = dash_svc.generate_dashboard(destination, lat, lon, result)
        timeline = t_svc.process_itinerary(result.get('optimized_itinerary'))

        result["dashboard"] = dashboard
        result["timeline"] = timeline

        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================
# CHAT API
# =========================
@bp.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        context = data.get('context', {})

        if not message:
            return jsonify({"response": "Message required", "data": {}}), 400

        chatbot = ChatbotAgent()
        result = chatbot.process(message, context)

        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": str(e), "data": {}}), 500