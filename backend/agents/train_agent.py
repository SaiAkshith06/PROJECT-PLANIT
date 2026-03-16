import json
import os
from agents.route_agent import BaseAgent

class TrainAgent(BaseAgent):
    def __init__(self, name="TrainAgent"):
        super().__init__(name)
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'trains.json')
        self.trains = self.load_data(data_path)

    def load_data(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
        return []

    def process(self, data):
        print(f"[{self.name}] Filtering train routes...")
        source = data.get("source", "").lower().strip()
        destination = data.get("destination", "").lower().strip()
        distance_km = data.get("distance_km", 300)
        from agents.price_estimator import estimate_price
        
        train_options = []
        for train in self.trains:
            t_source = train["source"].lower().strip()
            t_dest = train["destination"].lower().strip()
            
            if t_source in source or source in t_source:
                if t_dest in destination or destination in t_dest:
                    
                    # Estimate Duration: average speed 60 km/h
                    duration_mins = train.get("duration")
                    if not duration_mins:
                        duration_mins = int((distance_km / 60) * 60)
                        
                    price = train.get("price")

                    train_options.append({
                        "category": "train",
                        "mode": train.get("mode", "train"),
                        "provider": train.get("provider", "Train"),
                        "time_seconds": duration_mins * 60,
                        "cost": price,
                        "distance_meters": distance_km * 1000,
                        "route": f"Train Route: {source.capitalize()} to {destination.capitalize()}",
                        "tolls": [],
                        "api_source": "Offline DB (Enhanced)"
                    })
                    
        # Sort and limit by duration
        train_options = sorted(train_options, key=lambda x: x["time_seconds"])[:5]
        
        for t in train_options:
            if not t.get("cost"):
                t["cost"] = estimate_price("train", distance_km)
                t["estimated"] = True
                
        if len(train_options) < 3:
            print(f"[{self.name}] Generating estimated fallback trains...")
            train_names = ["Vande Bharat Express", "Shatabdi Express", "Rajdhani Express", "Duronto Express", "Superfast Express"]
            while len(train_options) < 3:
                idx = len(train_options) + 1
                provider_name = train_names[idx % len(train_names)]
                train_options.append({
                    "category": "train",
                    "mode": "train",
                    "provider": f"{provider_name} (Estimated)",
                    "time_seconds": int((distance_km / 60) * 3600),
                    "cost": estimate_price("train", distance_km),
                    "distance_meters": distance_km * 1000,
                    "route": f"Estimated Train Route: {source.capitalize()} to {destination.capitalize()}",
                    "tolls": [],
                    "api_source": "Estimator",
                    "estimated": True
                })
                
        return train_options
