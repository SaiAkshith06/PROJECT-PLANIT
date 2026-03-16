import requests
import time

class HotelService:
    """
    Service to fetch hotels, hostels, guest houses, and resorts
    using the OpenStreetMap Overpass API.
    Includes a simple 15-minute TTL cache.
    """
    def __init__(self):
        self.overpass_url = "http://overpass-api.de/api/interpreter"
        self.cache = {}
        self.CACHE_TTL = 900  # 15 minutes

    def get_hotels(self, lat, lon, radius=20000):
        """
        Fetches accommodation options around a given location.
        """
        cache_key = (round(lat, 3), round(lon, 3), radius)
        
        # Check cache
        if cache_key in self.cache:
            expiry_time, cached_data = self.cache[cache_key]
            if time.time() < expiry_time:
                print(f"[HotelService] Returning cached Hotels for ({lat}, {lon})")
                return cached_data
            else:
                del self.cache[cache_key]
                
        # Overpass QL Query
        query = f"""
        [out:json][timeout:15];
        (
          node["tourism"="hotel"](around:{radius},{lat},{lon});
          node["tourism"="resort"](around:{radius},{lat},{lon});
          node["tourism"="guest_house"](around:{radius},{lat},{lon});
          node["tourism"="apartment"](around:{radius},{lat},{lon});
          node["tourism"="hostel"](around:{radius},{lat},{lon});
        );
        out body 100;
        >;
        """
        
        results = []
        try:
            print(f"[HotelService] Querying Overpass API for Hotels near ({lat}, {lon})")
            response = requests.post(self.overpass_url, data={'data': query}, timeout=20)
            response.raise_for_status()
            
            data = response.json()
            elements = data.get("elements", [])
            
            for el in elements:
                if "tags" in el:
                    tags = el["tags"]
                    
                    hotel_type = tags.get("tourism", "hotel")
                    
                    # Use fallback name if not present
                    name = tags.get("name", "Local Hotel")
                    
                    # Estimate Pricing Logic per part 5
                    est_price = 2000
                    if hotel_type == "hostel": est_price = 800
                    elif hotel_type == "guest_house": est_price = 1500
                    elif hotel_type == "apartment": est_price = 2500
                    elif hotel_type == "hotel": est_price = 3000
                    elif hotel_type == "resort": est_price = 5500
                    
                    results.append({
                        "name": name,
                        "type": hotel_type,
                        "lat": el.get("lat"),
                        "lon": el.get("lon"),
                        "estimated_price": est_price
                    })
                    
            # Sort by price as a baseline
            results = sorted(results, key=lambda x: x["estimated_price"])
            
            # Limit to top 15 results
            results = results[:15]
            
            self.cache[cache_key] = (time.time() + self.CACHE_TTL, results)
            return results
            
        except requests.exceptions.RequestException as e:
            print(f"[HotelService] Overpass API failed: {e}")
            return []
        except Exception as e:
            print(f"[HotelService] Error processing Hotels: {e}")
            return []
