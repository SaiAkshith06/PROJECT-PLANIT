import os
import json

class TransitService:
    """
    Simulates parsing and querying GTFS feeds.
    In a real-world scenario, this would load routes.txt, trips.txt, and stop_times.txt
    into an in-memory graph (like NetworkX) or a strict SQL database.
    Because GTFS datasets are incredibly large (hundreds of MBs), we provide a lightweight 
    simulation using simplified routes that matches the GTFS expected output schema.
    """
    def __init__(self):
        # We will mock the loaded GTFS feed dictionary here.
        # This simulates having parsed routes.txt and trips.txt
        self.gtfs_routes = {
            ("hyderabad", "bangalore"): [
                {"route_short_name": "TSRTC Premium GTFS", "duration_mins": 580, "base_price": 1400},
                {"route_short_name": "KSRTC Airavat GTFS", "duration_mins": 620, "base_price": 1100}
            ],
            ("hyderabad", "vijayawada"): [
                {"route_short_name": "APSRTC Garuda GTFS", "duration_mins": 290, "base_price": 550}
            ]
        }

    def get_transit_routes(self, source, destination):
        """
        Mimics querying a GTFS database for trips between two cities (stops).
        """
        print(f"[TransitService] Querying GTFS graph for {source} -> {destination}")
        
        source = source.lower().strip()
        destination = destination.lower().strip()
        
        # Check direct matches
        routes = self.gtfs_routes.get((source, destination), [])
        
        # Also check reverse mapping in a real system (though buses are directional)
        if not routes:
            routes = self.gtfs_routes.get((destination, source), [])
            
        if not routes:
            raise ValueError(f"[TransitService] No GTFS trips found between {source} and {destination}")
            
        results = []
        for r in routes:
            results.append({
                "mode": "bus",
                "route": r["route_short_name"],
                "duration": r["duration_mins"],
                "price": r["base_price"],
                "source": source.capitalize(),
                "destination": destination.capitalize()
            })
            
        return results
