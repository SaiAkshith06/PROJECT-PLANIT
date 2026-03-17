from agents.route_agent import BaseAgent
from agents.hotel_agent import HotelAgent
from agents.poi_agent import POIAgent
from services.route_optimizer import RouteOptimizer


class TripPlannerAgent(BaseAgent):
    """
    Master orchestrator for the Travel Platform.
    Includes:
    ✔ preference filtering
    ✔ ranking + route optimization
    ✔ time-based itinerary
    """

    def __init__(self, name="TripPlannerAgent"):
        super().__init__(name)
        self.hotel_agent = HotelAgent()
        self.poi_agent = POIAgent()
        self.optimizer = RouteOptimizer()

    def process(self, data):
        print(f"[{self.name}] Building Smart Trip Itinerary...")

        user_input = data.get("user_input", {})
        dest_coords = data.get("destCoords") or user_input.get("destCoords")

        duration_days = int(user_input.get("duration", 3))
        preference = user_input.get("preference", "general")

        if not dest_coords:
            print(f"[{self.name}] No destination coordinates. Skipping.")
            return data

        # =========================
        # 1. HOTELS
        # =========================
        hotels = self.hotel_agent.process(data)
        data["recommended_hotels"] = hotels

        # =========================
        # 2. POIs
        # =========================
        pois = self.poi_agent.process(data)

        data["attractions"] = pois.get("attractions", [])
        data["restaurants"] = pois.get("restaurants", [])
        data["parks"] = pois.get("parks", [])
        data["monuments"] = pois.get("monuments", [])

        # =========================
        # 3. APPLY PREFERENCE FILTER
        # =========================
        all_sightseeing = (
            data["attractions"]
            + data["monuments"]
            + data["parks"]
        )

        # Ensure Curated Places ALWAYS stay
        curated = [p for p in all_sightseeing if p.get("source") == "curated"]

        if preference != "general":
            print(f"[{self.name}] Applying preference: {preference}")

            filtered = [
                p for p in all_sightseeing
                if p.get("category") == preference
            ]

            # Merge curated back in (No duplicates)
            for c in curated:
                if c not in filtered:
                    filtered.append(c)

            if filtered:
                all_sightseeing = filtered
            else:
                print(f"[{self.name}] No matches found, using all POIs")
        else:
            # If general, still boost curated so they are at top of list
            pass

        # =========================
        # 4. START POINT
        # =========================
        start_lat, start_lon = None, None

        if hotels and len(hotels) > 0:
            h = hotels[0]
            try:
                start_lat = float(h["lat"])
                start_lon = float(h["lon"])
            except (ValueError, TypeError):
                pass

        # fallback
        if not start_lat and isinstance(dest_coords, str):
            parts = dest_coords.split(',')
            start_lon = float(parts[0])
            start_lat = float(parts[1])

        if not start_lat:
            data["optimized_itinerary"] = {}
            return data

        # =========================
        # 5. OPTIMIZE ROUTE
        # =========================
        optimized_tour = self.optimizer.optimize_route(
            start_lat,
            start_lon,
            all_sightseeing
        )

        # =========================
        # 6. BUILD ITINERARY (STRICT GEOGRAPHIC CLUSTERING)
        # =========================
        itinerary = {}
        
        # Step 1: Pre-Cluster ALL available sightseeing based on 2km proximity
        remaining_pool = list(optimized_tour)
        all_clusters = []
        
        while remaining_pool:
            seed = remaining_pool.pop(0)
            cluster = [seed]
            
            # Recursive expansion: find everything within 2km of the current cluster
            expanding = True
            while expanding:
                expanding = False
                unassigned = []
                for p in remaining_pool:
                    in_range = False
                    for c_poi in cluster:
                        dist = self.optimizer.haversine(
                            c_poi.get("lat"), c_poi.get("lon"),
                            p.get("lat"), p.get("lon")
                        )
                        if dist <= 2.0:
                            in_range = True
                            break
                    if in_range:
                        cluster.append(p)
                        expanding = True
                    else:
                        unassigned.append(p)
                remaining_pool = unassigned
            
            # Sort individual cluster by rank to ensure best within 2km are targeted
            cluster.sort(key=lambda x: x.get("score", 0), reverse=True)
            all_clusters.append(cluster)
            
        # Step 2: Sort Clusters by their highest rank POI
        all_clusters.sort(key=lambda x: x[0].get("score", 0) if x else 0, reverse=True)
        
        # Step 3: Assign top N clusters to days
        selected_day_clusters = all_clusters[:duration_days]
        while len(selected_day_clusters) < duration_days:
            selected_day_clusters.append([])
            
        day_pois = [c[:3] for c in selected_day_clusters] # Step 4: Include ALL top (up to 3)
        
        # Step 5: Hard Validation (Fill days to at least 3 spots if possible)
        used_names = {p['name'] for day in day_pois for p in day}
        
        for i in range(duration_days):
            # Target 3 spots per day
            while len(day_pois[i]) < 3:
                best_add = None
                seed = day_pois[i][0] if day_pois[i] else None
                
                # First try to find anything within 2-5km of the day's seed
                for p in optimized_tour:
                    if p['name'] not in used_names:
                        if not seed:
                            best_add = p
                            break
                        
                        dist = self.optimizer.haversine(
                            seed.get("lat"), seed.get("lon"),
                            p.get("lat"), p.get("lon")
                        )
                        # Proximity forcing: prioritize nearby items to maintain "geographic zone" feel
                        if dist <= 3.0: 
                            best_add = p
                            break
                
                if not best_add:
                    # Absolute fallback to next best overall
                    for p in optimized_tour:
                        if p['name'] not in used_names:
                            best_add = p
                            break
                
                if best_add:
                    day_pois[i].append(best_add)
                    used_names.add(best_add['name'])
                else:
                    break
                    
        # Force Top 3 POIs if missing
        top_3_names = [p['name'] for p in optimized_tour[:min(3, len(optimized_tour))]]
        for top_name in top_3_names:
            if top_name not in used_names:
                for p in optimized_tour:
                    if p['name'] == top_name:
                        # Find smallest day and force it in
                        day_pois.sort(key=len)
                        if len(day_pois[0]) >= 3:
                            day_pois[0].pop()
                        day_pois[0].append(p)
                        used_names.add(top_name)
                        break
                        
        # Step 6: Fix Restaurants (Fallback)
        if len(data.get("restaurants", [])) < 3:
            print(f"[{self.name}] Not enough restaurants, adding fallbacks.")
            fallbacks = [
                {"name": "Local Premium Diner", "category": "food", "lat": start_lat, "lon": start_lon, "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", "type": "restaurant"},
                {"name": "Authentic Cuisine Restaurant", "category": "food", "lat": start_lat, "lon": start_lon, "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9", "type": "restaurant"},
                {"name": "City View Cafe", "category": "food", "lat": start_lat, "lon": start_lon, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", "type": "restaurant"}
            ]
            data["restaurants"] = data.get("restaurants", []) + fallbacks

        # Final Build Loop
        slots_order = ["Morning", "Midday", "Afternoon"]
        for day in range(1, duration_days + 1):
            day_plan = []
            current_day_pois = day_pois[day - 1]
            avail_slots = list(slots_order)
            
            # Sort within day by score for slot assignment
            current_day_pois.sort(key=lambda x: x.get("score", 0), reverse=True)
            
            for poi in current_day_pois:
                cat = poi.get("category", "general")
                # Time distribution mapping
                if "culture" in cat or "spiritual" in cat: 
                    target_slot = "Morning" if "Morning" in avail_slots else (avail_slots[0] if avail_slots else "Midday")
                elif "nature" in cat: 
                    target_slot = "Afternoon" if "Afternoon" in avail_slots else (avail_slots[0] if avail_slots else "Midday")
                else:
                    target_slot = "Midday" if "Midday" in avail_slots else (avail_slots[0] if avail_slots else "Morning")
                
                day_plan.append({
                    "time": target_slot,
                    "activity": f"Visit {poi['name']}",
                    "name": poi['name'],
                    "category": cat,
                    "image": poi.get('image'),
                    "lat": poi.get('lat'),
                    "lon": poi.get('lon'),
                    "time_slot": target_slot,
                    "type": "sightseeing"
                })
                if target_slot in avail_slots:
                    avail_slots.remove(target_slot)
                    
            # Lunch
            lunch_idx = (day - 1) % max(1, len(data["restaurants"]))
            if data["restaurants"]:
                lunch = data["restaurants"][lunch_idx]
                day_plan.append({
                    "time": "Lunch",
                    "activity": f"Lunch at {lunch['name']}",
                    "name": lunch['name'],
                    "category": "dining",
                    "image": lunch.get('image'),
                    "lat": lunch.get('lat'),
                    "lon": lunch.get('lon'),
                    "time_slot": "Lunch",
                    "type": "dining"
                })

            # Dinner
            dinner_idx = (day + duration_days - 1) % max(1, len(data["restaurants"]))
            if data["restaurants"]:
                dinner = data["restaurants"][dinner_idx]
                day_plan.append({
                    "time": "Dinner",
                    "activity": f"Dinner at {dinner['name']}",
                    "name": dinner['name'],
                    "category": "dining",
                    "image": dinner.get('image'),
                    "lat": dinner.get('lat'),
                    "lon": dinner.get('lon'),
                    "time_slot": "Dinner",
                    "type": "dining"
                })

            # Sort order
            order = {
                "Morning": 1,
                "Midday": 2,
                "Lunch": 3,
                "Afternoon": 4,
                "Dinner": 5
            }

            day_plan.sort(key=lambda x: order.get(x["time"], 99))
            itinerary[f"Day {day}"] = day_plan


        # ✅ IMPORTANT: assign to data
        data["optimized_itinerary"] = itinerary

        # =========================
        # 7. BUDGET
        # =========================
        data = self._calculate_budget_breakdown(data, hotels, duration_days)

        return data

    # =========================
    # BUDGET CALCULATION
    # =========================
    def _calculate_budget_breakdown(self, data, hotels, duration_days):
        print(f"[{self.name}] Calculating Budget Breakdown...")

        budget_summary = {
            "Transport": 0,
            "Hotel": 0,
            "Food": duration_days * 1200,
            "Activities": duration_days * 800
        }

        if hotels and len(hotels) > 0:
            budget_summary["Hotel"] = hotels[0].get("estimated_price", 2000) * duration_days

        if data.get("routes") and len(data["routes"]) > 0:
            try:
                recommended = next(
                    (r for r in data["routes"] if r.get("label") == "recommended"),
                    data["routes"][0]
                )
                budget_summary["Transport"] = recommended.get("cost", 0)
            except Exception:
                pass

        budget_summary["Total"] = sum(budget_summary.values())
        data["budget_breakdown"] = budget_summary

        return data