import requests
import time
import os

from services.unsplash_service import get_image


class POIService:
    """
    Hybrid POI Service:
    - Primary: Foursquare API
    - Fallback: OpenStreetMap
    - Includes caching + filtering + category mapping + images
    """

    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"
        self.foursquare_key = os.getenv("FOURSQUARE_API_KEY")
        self.cache = {}
        self.CACHE_TTL = 900  # 15 minutes
        
        # STEP 1: FIX CURATED COORDINATES (REAL LAT/LON)
        self.CURATED_PLACES = {
            "hyderabad": [
                {"name": "Charminar", "category": "culture", "lat": 17.3616, "lon": 78.4747},
                {"name": "Golconda Fort", "category": "culture", "lat": 17.3833, "lon": 78.4011},
                {"name": "Hussain Sagar Lake", "category": "nature", "lat": 17.4239, "lon": 78.4738},
                {"name": "Ramoji Film City", "category": "culture", "lat": 17.2543, "lon": 78.6808},
                {"name": "Birla Mandir", "category": "spiritual", "lat": 17.4062, "lon": 78.4691},
                {"name": "Salar Jung Museum", "category": "culture", "lat": 17.3713, "lon": 78.4804},
                {"name": "Chowmahalla Palace", "category": "culture", "lat": 17.3578, "lon": 78.4717},
                {"name": "Qutb Shahi Tombs", "category": "culture", "lat": 17.3891, "lon": 78.3986}
            ],
            "mumbai": [
                {"name": "Gateway of India", "category": "culture", "lat": 18.9220, "lon": 72.8347},
                {"name": "Marine Drive", "category": "nature", "lat": 18.9431, "lon": 72.8230},
                {"name": "Elephanta Caves", "category": "culture", "lat": 18.9633, "lon": 72.9315},
                {"name": "Chhatrapati Shivaji महाराज Terminus", "category": "culture", "lat": 18.9400, "lon": 72.8353},
                {"name": "Bandra-Worli Sea Link", "category": "culture", "lat": 19.0330, "lon": 72.8158},
                {"name": "Siddhivinayak Temple", "category": "spiritual", "lat": 19.0170, "lon": 72.8302},
                {"name": "Haji Ali Dargah", "category": "spiritual", "lat": 18.9827, "lon": 72.8090},
                {"name": "Sanjay Gandhi National Park", "category": "nature", "lat": 19.2215, "lon": 72.9124}
            ],
            "bengaluru": [
                {"name": "Lalbagh Botanical Garden", "category": "nature", "lat": 12.9507, "lon": 77.5844},
                {"name": "Cubbon Park", "category": "nature", "lat": 12.9776, "lon": 77.5912},
                {"name": "Bangalore Palace", "category": "culture", "lat": 12.9988, "lon": 77.5921},
                {"name": "Vidhana Soudha", "category": "culture", "lat": 12.9796, "lon": 77.5912},
                {"name": "Tipu Sultan's Summer Palace", "category": "culture", "lat": 12.9593, "lon": 77.5738},
                {"name": "ISKCON Temple", "category": "spiritual", "lat": 13.0104, "lon": 77.5512},
                {"name": "Nandi Hills", "category": "nature", "lat": 13.3702, "lon": 77.6835}
            ],
            "kolkata": [
                {"name": "Victoria Memorial", "category": "culture", "lat": 22.5448, "lon": 88.3426},
                {"name": "Howrah Bridge", "category": "culture", "lat": 22.5851, "lon": 88.3468},
                {"name": "Dakshineswar Kali Temple", "category": "spiritual", "lat": 22.6550, "lon": 88.3575},
                {"name": "Indian Museum", "category": "culture", "lat": 22.5579, "lon": 88.3511},
                {"name": "Belur Math", "category": "spiritual", "lat": 22.6322, "lon": 88.3562},
                {"name": "Marble Palace", "category": "culture", "lat": 22.5815, "lon": 88.3592},
                {"name": "Prinsep Ghat", "category": "nature", "lat": 22.5562, "lon": 88.3306}
            ],
            "goa": [
                {"name": "Basilica of Bom Jesus", "category": "spiritual", "lat": 15.5009, "lon": 73.9116},
                {"name": "Baga Beach", "category": "nature", "lat": 15.5553, "lon": 73.7517},
                {"name": "Aguada Fort", "category": "culture", "lat": 15.4925, "lon": 73.7738},
                {"name": "Anjuna Beach", "category": "nature", "lat": 15.5862, "lon": 73.7430},
                {"name": "Dudhsagar Falls", "category": "nature", "lat": 15.3125, "lon": 74.3125},
                {"name": "Chapora Fort", "category": "culture", "lat": 15.6067, "lon": 73.7348}
            ]
        }


    # =========================
    # CATEGORY CLASSIFICATION
    # =========================
    def classify_poi(self, name):
        name = name.lower()

        if any(x in name for x in ["fort", "palace", "museum", "monument", "memorial", "tomb", "historic"]):
            return "culture"
        if any(x in name for x in ["temple", "mosque", "church", "mandir", "basilica", "spiritual"]):
            return "spiritual"
        if any(x in name for x in ["lake", "park", "garden", "zoo", "nature", "beach", "forest"]):
            return "nature"

        return "general"

    def map_category(self, category_str, name):
        """Combines source category with name-based classification"""
        name_cat = self.classify_poi(name)
        if name_cat != "general":
            return name_cat
        
        category = category_str.lower()
        if any(x in category for x in ["museum", "monument", "heritage", "historic", "art", "theatre"]):
            return "culture"
        elif any(x in category for x in ["park", "garden", "lake", "nature", "zoo", "aquarium"]):
            return "nature"
        elif any(x in category for x in ["restaurant", "food", "cafe", "bakery", "dining"]):
            return "food"
        elif any(x in category for x in ["temple", "mosque", "church", "shrine", "religious"]):
            return "spiritual"
        else:
            return "general"

    # =========================
    # MAIN FUNCTION
    # =========================
    def get_pois(self, lat, lon, city=None, radius=15000):
        cache_key = (round(lat, 3), round(lon, 3), radius)

        # Cache
        if cache_key in self.cache:
            expiry_time, cached_data = self.cache[cache_key]
            if time.time() < expiry_time:
                print("[POIService] Using cached data")
                return cached_data

        final_pois = []
        seen_names = set()
        
        # STEP 2: MERGE CURATED + API DATA (Prioritize Curated)
        if city:
            city_key = city.lower().strip()
            curated_list = self.CURATED_PLACES.get(city_key, [])
            
            for cp in curated_list:
                name = cp["name"]
                
                # STEP 4: FIX IMAGE SYSTEM
                image = get_image(f"{name} {city} famous landmark")
                
                poi_obj = {
                    "name": name,
                    "type": "attraction",
                    "category": cp["category"],
                    "lat": cp.get("lat", lat), 
                    "lon": cp.get("lon", lon),
                    "image": image,
                    "source": "curated"
                }
                final_pois.append(poi_obj)
                seen_names.add(name.lower())
                print(f"[POIService] Injected Curated: {name}")

        def add_api_pois(api_pois):
            for poi in api_pois:
                name = poi.get("name", "")
                if not name:
                    continue
                    
                # De-duplication logic (simple substring matching)
                name_lower = name.lower()
                is_duplicate = False
                for seen in seen_names:
                    if name_lower in seen or seen in name_lower:
                        is_duplicate = True
                        break
                        
                if not is_duplicate:
                    final_pois.append(poi)
                    seen_names.add(name_lower)

        # Try Foursquare
        if self.foursquare_key and city:
            fs_pois = self._get_foursquare_pois(city)
            if fs_pois:
                add_api_pois(fs_pois)

        # Fallback to Overpass to pad the list
        if len(final_pois) < 15:
            print("[POIService] Fetching from Overpass to supplement POIs")
            osm_pois = self._get_overpass_pois(lat, lon, radius, city)
            add_api_pois(osm_pois)

        self.cache[cache_key] = (time.time() + self.CACHE_TTL, final_pois)
        return final_pois

    # =========================
    # FOURSQUARE
    # =========================
    def _get_foursquare_pois(self, city, limit=10):
        try:
            url = "https://api.foursquare.com/v3/places/search"

            headers = {
                "Authorization": self.foursquare_key
            }

            params = {
                "query": f"top tourist attractions in {city}",
                "near": city,
                "limit": limit
            }

            print(f"[POIService] Fetching from Foursquare: {city}")

            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()
            results = []

            for place in data.get("results", []):

                name = place.get("name")
                if not name:
                    continue

                name_lower = name.lower()

                # Filter unwanted places
                if any(x in name_lower for x in ["playground", "shop", "unknown", "building", "office", "bus", "store", "hostel", "mall", "hotel"]):
                    continue

                lat_val = place.get("geocodes", {}).get("main", {}).get("latitude")
                lon_val = place.get("geocodes", {}).get("main", {}).get("longitude")

                if not lat_val or not lon_val:
                    continue

                raw_category = place.get("categories", [{}])[0].get("name", "general")

                category = self.map_category(raw_category, name)

                # STEP 5: FILTER LOW-QUALITY POIs
                if any(x in name_lower for x in ["shop", "store", "building", "playground", "unknown", "office", "bus"]):
                    continue

                # STEP 7: FIX IMAGE SYSTEM
                image = get_image(f"{name} {city} famous landmark")

                results.append({
                    "name": name,
                    "type": "attraction",
                    "category": category,
                    "lat": lat_val,
                    "lon": lon_val,
                    "image": image,
                    "source": "foursquare"
                })

            return results

        except Exception as e:
            print(f"[POIService] Foursquare failed: {e}")
            return []

    # =========================
    # OVERPASS (FALLBACK)
    # =========================
    def _get_overpass_pois(self, lat, lon, radius, city):
        query = f"""
        [out:json][timeout:15];
        (
          nwr["tourism"="attraction"](around:{radius},{lat},{lon});
          nwr["historic"~"monument|memorial|castle|ruins"](around:{radius},{lat},{lon});
          nwr["leisure"~"park|garden"](around:{radius},{lat},{lon});
          nwr["amenity"~"restaurant|cafe"](around:{radius},{lat},{lon});
        );
        out center 150;
        """

        results = []

        try:
            print("[POIService] Fetching from Overpass")

            response = requests.post(self.overpass_url, data={'data': query}, timeout=20)
            response.raise_for_status()

            elements = response.json().get("elements", [])
            seen = set()

            for el in elements:

                if el["id"] in seen:
                    continue
                seen.add(el["id"])

                tags = el.get("tags", {})
                name = tags.get("name")

                if not name:
                    continue

                lat_val = el.get("lat") or el.get("center", {}).get("lat")
                lon_val = el.get("lon") or el.get("center", {}).get("lon")

                if not lat_val or not lon_val:
                    continue

                # Basic category mapping for OSM
                category = self.classify_poi(name)

                # Identify Correct Type for POIAgent grouping
                poi_type = "attraction"
                if "monument" in tags or "historic" in tags or any(x in name.lower() for x in ["monument", "memorial", "tomb", "fort"]):
                    poi_type = "monument"
                elif "park" in tags or "leisure" in tags or any(x in name.lower() for x in ["park", "garden", "zoo"]):
                    poi_type = "park"
                elif "amenity" in tags and tags["amenity"] in ["restaurant", "cafe"]:
                    poi_type = "restaurant"
                    category = "food"

                # STEP 5: FILTER LOW-QUALITY POIs
                if any(x in name.lower() for x in ["shop", "store", "building", "playground", "unknown", "office", "bus", "hostel"]):
                    continue

                # STEP 7: FIX IMAGE SYSTEM
                image = get_image(f"{name} {city} famous landmark")

                results.append({
                    "name": name,
                    "type": poi_type,
                    "category": category,
                    "lat": lat_val,
                    "lon": lon_val,
                    "image": image,
                    "source": "osm"
                })

                if len(results) >= 15:
                    break

            return results

        except Exception as e:
            print(f"[POIService] Overpass failed: {e}")
            return []