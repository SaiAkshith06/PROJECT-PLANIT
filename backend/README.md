# PLANIT Multi-Agent Planner

A Multi-Agent Application for trip planning, providing cost, route, and time analysis using Open Source Routing.

## Project Structure

- `app/`: Contains the Flask application factory and routes.
- `agents/`: Contains the AI agent logic for route, cost, time, and resource management.
- `services/`: Encapsulates external API integrations (OSRM for routing, Nominatim/Photon for geocoding).
- `data/`: Storage for local JSON or databases.
- `templates/` & `static/`: Frontend files.

## Running the Application

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the server:
   ```bash
   python run.py
   ```
