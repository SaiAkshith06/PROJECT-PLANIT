"""
Routing service interacting with OSRM to get routes and geometries.
"""
import requests
from datetime import datetime
import random

def get_osrm_routes(src_coords, dst_coords, source_name, dest_name):
    """
    Fetch routes from OSRM and generate base and cab route options.
    """
    routes = []
    modes_map = {
        "driving": "car"
    }
    
    cab_services = [
        {"provider": "UberGo", "multiplier": 1.0, "base_fare": 50},
        {"provider": "UberXL", "multiplier": 1.5, "base_fare": 80},
        {"provider": "Ola Mini", "multiplier": 0.95, "base_fare": 45},
        {"provider": "Ola Prime SUV", "multiplier": 1.4, "base_fare": 70},
        {"provider": "Rapido Bike", "multiplier": 0.4, "base_fare": 20},
    ]
    
    for mode_name, osrm_profile in modes_map.items():
        # Request route with geometry (geojson format) for Leaflet rendering and alternative routes
        osrm_url = f"http://router.project-osrm.org/route/v1/{osrm_profile}/{src_coords};{dst_coords}?overview=full&geometries=geojson&alternatives=3"
        
        try:
            response = requests.get(osrm_url)
            if response.status_code == 200:
                data = response.json()
                if data["code"] == "Ok" and len(data["routes"]) > 0:
                    for route_idx, route_data in enumerate(data["routes"]):
                        distance_meters = route_data["distance"]
                        duration_seconds = route_data["duration"]
                        geometry = route_data["geometry"]
                        
                        # Format for human reading
                        dist_km = distance_meters / 1000
                        dist_text = f"{dist_km:.1f} km"
                        
                        mins = int(duration_seconds // 60)
                        hours = mins // 60
                        mins = mins % 60
                        time_text = f"{hours}h {mins}m" if hours > 0 else f"{mins} mins"

                        now = datetime.now()
                        
                        # Parse short names for UI display
                        short_source = source_name.split(',')[0].strip()[:15] if source_name else "Origin"
                        short_dest = dest_name.split(',')[0].strip()[:15] if dest_name else "Destination"
                        
                        # 1. ALWAYS emit a base "Personal Driving" route
                        routes.append({
                            "mode": "driving",
                            "category": "personal",
                            "route": f"Personal Car (Route {route_idx + 1})",
                            "provider": "Your Car",
                            "depart_time": short_source,
                            "arrival_time": short_dest,
                            "eta_mins": 0,
                            "surge": 1.0,
                            "base_fare": 0,
                            "rate_multiplier": 1.0, # Uses standard Fuel/Toll rate in CostAgent
                            "distance_text": dist_text,
                            "distance_meters": distance_meters,
                            "time_text": time_text,
                            "time_seconds": duration_seconds,
                            "geometry": geometry
                        })
                        
                        # 2. ALSO generate a subset of cab options along this same route geometry
                        available_cabs = random.sample(cab_services, random.randint(3, 5))
                        
                        for cab in available_cabs:
                            # Generate random wait time (ETA)
                            eta_mins = random.randint(1, 15)
                            # Surge multiplier
                            surge = round(random.uniform(1.2, 2.5), 1) if random.random() > 0.6 else 1.0
                            
                            depart_timestamp = now.timestamp() + (eta_mins * 60)
                            arrival_timestamp = depart_timestamp + duration_seconds
                            
                            depart_dt = datetime.fromtimestamp(depart_timestamp)
                            arrival_dt = datetime.fromtimestamp(arrival_timestamp)
                            
                            depart_str = depart_dt.strftime("%I:%M %p")
                            arrival_str = arrival_dt.strftime("%I:%M %p")

                            routes.append({
                                "mode": "driving",
                                "category": "cab",
                                "route": f"Route {route_idx + 1}",
                                "provider": cab["provider"],
                                "depart_time": depart_str,
                                "arrival_time": arrival_str,
                                "eta_mins": eta_mins,
                                "surge": surge,
                                "base_fare": cab["base_fare"],
                                "rate_multiplier": cab["multiplier"],
                                "distance_text": dist_text,
                                "distance_meters": distance_meters,
                                "time_text": time_text,
                                "time_seconds": duration_seconds,
                                "geometry": geometry # Will pass directly to Leaflet
                            })

        except Exception as e:
            print(f"[RoutingService] OSRM Route Error ({mode_name}): {e}")
            
    # If OSRM fails or specific modes fail, fallback
    if not routes:
        routes = [
            {
                "mode": "driving", "category": "cab", "route": "Simulated Route", "provider": "UberGo",
                "depart_time": "Now", "arrival_time": "Later", "eta_mins": 5, "surge": 1.0,
                "base_fare": 50, "rate_multiplier": 1.0,
                "distance_meters": 10000, "time_seconds": 1200, "geometry": None
            }
        ]
    
    return routes
