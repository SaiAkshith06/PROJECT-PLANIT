import requests
import time

class POIService:
    """
    Service to discover points of interest (Attractions, Restaurants, Parks, Monuments)
    using the OpenStreetMap Overpass API.
    Includes a simple 15-minute TTL cache to reduce external API load.
    """
    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"
        self.cache = {}
        self.CACHE_TTL = 900  # 15 minutes

    def get_pois(self, lat, lon, radius=15000):
        """
        Fetches POIs around a given location.
        """
        cache_key = (round(lat, 3), round(lon, 3), radius)
        
        # Check cache
        if cache_key in self.cache:
            expiry_time, cached_data = self.cache[cache_key]
            if time.time() < expiry_time:
                print(f"[POIService] Returning cached POIs for ({lat}, {lon})")
                return cached_data
        # Overpass QL Query: We fetch a mix of objects and sort in Python to avoid 429 Too Many Requests
        query = f"""
        [out:json][timeout:15];
        (
          nwr["tourism"="attraction"](around:{radius},{lat},{lon});
          nwr["historic"="monument"](around:{radius},{lat},{lon});
          nwr["leisure"="park"](around:{radius},{lat},{lon});
          nwr["amenity"="restaurant"](around:{radius},{lat},{lon});
          nwr["amenity"="cafe"](around:{radius},{lat},{lon});
        );
        out center 150;
        """
        
        results = []
        try:
            print(f"[POIService] Querying Overpass API for POIs near ({lat}, {lon})")
            response = requests.post(self.overpass_url, data={'data': query}, timeout=20)
            response.raise_for_status()
            
            elements = response.json().get("elements", [])
            
            # Sort elements so that those with 'wikipedia' or 'wikidata' tags are prioritized
            def is_popular(el):
                tags = el.get("tags", {})
                return 1 if ("wikipedia" in tags or "wikidata" in tags) else 0

            elements.sort(key=is_popular, reverse=True)

            # Deduplicate by ID and cap to top 50
            seen_ids = set()
            unique_elements = []
            for el in elements:
                if el["id"] not in seen_ids:
                    seen_ids.add(el["id"])
                    unique_elements.append(el)
                    if len(unique_elements) >= 50:
                        break
            
            for el in unique_elements:
                if "tags" in el and "name" in el["tags"]:
                    tags = el["tags"]
                    
                    poi_type = "unknown"
                    if tags.get("tourism") == "attraction": poi_type = "attraction"
                    elif tags.get("historic") == "monument": poi_type = "monument"
                    elif tags.get("leisure") == "park": poi_type = "park"
                    elif tags.get("amenity") == "restaurant": poi_type = "restaurant"
                    elif tags.get("amenity") == "cafe": poi_type = "cafe"
                    lat = el.get("lat") or el.get("center", {}).get("lat")
                    lon = el.get("lon") or el.get("center", {}).get("lon")
                    
                    if lat and lon:
                        results.append({
                            "name": tags["name"],
                            "type": poi_type,
                            "lat": lat,
                            "lon": lon
                        })
                    
            # Cache results
            self.cache[cache_key] = (time.time() + self.CACHE_TTL, results)
            return results
            
        except requests.exceptions.RequestException as e:
            print(f"[POIService] Overpass API request failed: {e}")
            return [] # Fail gracefully empty list per requirements
        except Exception as e:
            print(f"[POIService] Error processing POIs: {e}")
            return []
