import math


class RouteOptimizer:
    """
    Optimizes sightseeing routes using:
    1. Ranking (importance)
    2. Nearest Neighbor (distance)
    3. Time-based planning (Morning/Afternoon/Evening)
    """

    ICONIC_PLACES = [
        "charminar",
        "golconda fort",
        "hussain sagar",
        "ramoji film city",
        "birla mandir",
        "chowmahalla palace",
        "salar jung museum",
        "qutub shahi tombs",
        "taj mahal",
        "red fort",
        "lotus temple",
        "india gate",
        "akshardham",
        "victoria memorial",
        "howrah bridge",
        "dakshineswar",
        "meenakshi temple",
        "gateway of india",
        "ajanta caves",
        "ellora caves"
    ]

    def boost_iconic(self, poi):
        name = poi.get("name", "").lower()
        for place in self.ICONIC_PLACES:
            if place in name:
                return 15  # High priority
        return 0

    # =========================
    # DISTANCE FUNCTION
    # =========================
    @staticmethod
    def haversine(lat1, lon1, lat2, lon2):
        try:
            lat1, lon1, lat2, lon2 = map(
                math.radians,
                [float(lat1), float(lon1), float(lat2), float(lon2)]
            )
        except (ValueError, TypeError):
            return float('inf')

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.asin(math.sqrt(a))

        return 6371 * c

    # =========================
    # RANKING FUNCTION
    # =========================
    def rank_pois(self, pois, start_lat, start_lon):

        def safe_distance(p):
            return self.haversine(start_lat, start_lon, p.get("lat"), p.get("lon"))

        ranked = []

        for p in pois:
            score = 0

            # Source priority (Crucial step)
            source = p.get("source", "osm")
            if source == "curated":
                score += 20
            elif source == "foursquare":
                score += 10
            elif source == "osm":
                score += 2

            # Category priority
            cat = p.get("category", "general")

            if cat == "culture":
                score += 5
            elif cat == "spiritual":
                score += 4
            elif cat == "nature":
                score += 4
            elif cat == "food":
                score += 2
            
            # Distance penalty
            dist = safe_distance(p)
            score -= (dist * 0.5)

            p["score"] = score
            ranked.append(p)

        ranked.sort(key=lambda x: x.get("score", 0), reverse=True)

        return ranked

    # =========================
    # TIME SLOT FUNCTION ⭐
    # =========================
    def assign_time_slot(self, poi):
        category = poi.get("category", "general")

        if category in ["culture", "spiritual"]:
            return "Morning"
        elif category == "nature":
            return "Evening"
        else:
            return "Afternoon"

    # =========================
    # MAIN OPTIMIZER
    # =========================
    def optimize_route(self, start_lat, start_lon, pois):

        if not pois:
            return []

        # STEP 1: Rank POIs
        ranked_pois = self.rank_pois(pois, start_lat, start_lon)

        # STEP 2: Nearest Neighbor Optimization
        unvisited = list(ranked_pois)
        optimized_path = []

        current_lat = float(start_lat)
        current_lon = float(start_lon)

        while unvisited:
            closest_poi = None
            min_dist = float('inf')

            for poi in unvisited:
                try:
                    poi_lat = float(poi.get("lat"))
                    poi_lon = float(poi.get("lon"))

                    dist = self.haversine(current_lat, current_lon, poi_lat, poi_lon)

                    # Combine score + distance
                    weighted_dist = dist - (poi.get("score", 0) * 0.2)

                    if weighted_dist < min_dist:
                        min_dist = weighted_dist
                        closest_poi = poi

                except (ValueError, TypeError):
                    continue

            if not closest_poi:
                break

            # ⭐ Assign time slot HERE
            closest_poi["time_slot"] = self.assign_time_slot(closest_poi)

            optimized_path.append(closest_poi)
            unvisited.remove(closest_poi)

            current_lat = float(closest_poi["lat"])
            current_lon = float(closest_poi["lon"])

        return optimized_path