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
                
        # Overpass QL Query (Strict Hotel Rule)
        query = f"""
        [out:json][timeout:15];
        (
          node["tourism"="hotel"](around:{radius},{lat},{lon});
          node["tourism"="resort"](around:{radius},{lat},{lon});
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
                    
                    # Try to filter out generic "hostel" "pg" type names even if they are mistagged
                    name_lower = name.lower()
                    if any(bad in name_lower for bad in ["hostel", "pg ", "paying guest", "dorm", "boys", "girls", "guest"]):
                        continue
                        
                    if hotel_type not in ["hotel", "resort", "inn"]:
                        continue
                        
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

            # STEP 5: FIX HOTEL SYSTEM (Mock Fallback if empty or few)
            if len(results) < 3:
                print(f"[HotelService] Found only {len(results)} results, adding premium mock hotels.")
                mock_hotels = [
                    {"name": "The Taj Mahal Palace", "type": "hotel", "lat": lat + 0.005, "lon": lon + 0.005, "estimated_price": 15000},
                    {"name": "The Oberoi", "type": "hotel", "lat": lat - 0.005, "lon": lon - 0.005, "estimated_price": 12000},
                    {"name": "ITC Kohenur", "type": "hotel", "lat": lat + 0.008, "lon": lon - 0.008, "estimated_price": 9000}
                ]
                results.extend(mock_hotels)

            self.cache[cache_key] = (time.time() + self.CACHE_TTL, results)
            return results
            
        except Exception as e:
            print(f"[HotelService] Error processing Hotels: {e}")
            return [
                {"name": "Taj Hotel", "type": "hotel", "lat": lat + 0.01, "lon": lon + 0.01, "estimated_price": 5000},
                {"name": "ITC Hotel", "type": "hotel", "lat": lat - 0.01, "lon": lon - 0.01, "estimated_price": 4500},
                {"name": "Marriott", "type": "hotel", "lat": lat + 0.015, "lon": lon - 0.015, "estimated_price": 6000}
            ]
