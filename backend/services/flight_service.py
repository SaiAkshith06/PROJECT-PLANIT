import os
import requests
import time

class FlightService:
    def __init__(self):
        self.api_key = os.environ.get("AMADEUS_API_KEY")
        self.api_secret = os.environ.get("AMADEUS_API_SECRET")
        self.token = None
        self.token_expiry = 0
        
        # Rate Limiting & Caching
        from collections import deque
        self.api_call_timestamps = deque()
        self.MAX_CALLS_PER_MIN = 5
        
        self.cache = {}
        self.CACHE_TTL = 600  # 10 minutes
        
        # Simple mapping for common Indian cities to IATA codes
        self.iata_map = {
            "hyderabad": "HYD",
            "bangalore": "BLR",
            "bengaluru": "BLR",
            "mumbai": "BOM",
            "delhi": "DEL",
            "chennai": "MAA",
            "kolkata": "CCU",
            "vijayawada": "VGA",
            "warangal": "WGC" # Note: Warangal doesn't have a major active commercial airport, but for API mapping we use a code or let it fallback.
        }

    def _get_token(self):
        if self.token and time.time() < self.token_expiry:
            return self.token

        if not self.api_key or not self.api_secret:
            print("[FlightService] Missing AMADEUS_API_KEY or AMADEUS_API_SECRET")
            return None

        try:
            url = "https://test.api.amadeus.com/v1/security/oauth2/token"
            data = {
                "grant_type": "client_credentials",
                "client_id": self.api_key,
                "client_secret": self.api_secret
            }
            # Add timeout protection
            response = requests.post(url, data=data, timeout=5)
            response.raise_for_status()
            token_data = response.json()
            self.token = token_data.get("access_token")
            # Set expiry with a small buffer
            self.token_expiry = time.time() + token_data.get("expires_in", 1799) - 60
            return self.token
        except requests.exceptions.RequestException as e:
            print(f"[FlightService] Failed to authenticate with Amadeus: {e}")
            return None

    def search_flights(self, origin, destination, date="2026-04-01"):
        """
        Fetches flights using Amadeus API with caching and rate limiting.
        """
        source_iata = self.iata_map.get(origin.lower())
        dest_iata = self.iata_map.get(destination.lower())

        if not source_iata or not dest_iata:
            print(f"[FlightService] Unmapped cities for flights: {origin} -> {destination}")
            raise ValueError(f"No IATA mapping found for {origin} or {destination}")

        cache_key = (source_iata, dest_iata, date)
        
        # Check Cache
        if cache_key in self.cache:
            expiry_time, cached_results = self.cache[cache_key]
            if time.time() < expiry_time:
                print(f"[FlightService] Returning cached results for {origin} -> {destination}")
                return cached_results
            else:
                del self.cache[cache_key] # expire cache

        # Check Rate Limit
        current_time = time.time()
        # Clean up old timestamps
        while self.api_call_timestamps and self.api_call_timestamps[0] < current_time - 60:
            self.api_call_timestamps.popleft()

        if len(self.api_call_timestamps) >= self.MAX_CALLS_PER_MIN:
            print(f"[FlightService] Rate limit exceeded! ({self.MAX_CALLS_PER_MIN} calls/min). Blocking request.")
            raise PermissionError("Rate limit exceeded")

        token = self._get_token()
        if not token:
            raise PermissionError("Could not retrieve Amadeus Authentication Token.")

        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        params = {
            "originLocationCode": source_iata,
            "destinationLocationCode": dest_iata,
            "departureDate": date,
            "adults": 1,
            "max": 5
        }

        try:
            print(f"[FlightService] API Call: Querying Amadeus API for {source_iata} -> {dest_iata}")
            self.api_call_timestamps.append(current_time)
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            offers = data.get("data", [])
            
            # Additional mapping for carrier names
            dictionaries = data.get("dictionaries", {}).get("carriers", {})

            results = []
            for offer in offers:
                try:
                    price = float(offer["price"]["total"])
                    # Standard rough conversion for test data (EUR -> INR approximation)
                    if offer["price"]["currency"] == "EUR":
                        price *= 90.0
                    
                    # Extract itinerary
                    itinerary = offer["itineraries"][0]
                    duration_str = itinerary["duration"] # Format: PT2H30M
                    
                    # Simple Parsing of ISO 8601 Duration (e.g. PT2H30M -> mins)
                    duration_mins = self._parse_iso_duration(duration_str)

                    # Extract carrier
                    segment = itinerary["segments"][0]
                    carrier_code = segment["carrierCode"]
                    
                    carrier_map = {
                        "6E": "IndiGo",
                        "AI": "Air India",
                        "UK": "Vistara",
                        "SG": "SpiceJet",
                        "QP": "Akasa Air",
                        "I5": "AIX Connect"
                    }
                    airline = dictionaries.get(carrier_code, carrier_map.get(carrier_code, f"{carrier_code} Airlines"))

                    results.append({
                        "mode": "flight",
                        "airline": airline,
                        "duration": duration_mins,
                        "price": round(price),
                        "source": origin.capitalize(),
                        "destination": destination.capitalize()
                    })
                except (KeyError, IndexError, ValueError) as e:
                    print(f"[FlightService] Error parsing flight offer: {e}")
                    continue
            
            # Save to Cache
            self.cache[cache_key] = (current_time + self.CACHE_TTL, results)
            
            return results

        except requests.exceptions.RequestException as e:
            print(f"[FlightService] Amadeus API request failed: {e}")
            raise

    def _parse_iso_duration(self, duration_str):
        """Simplistic parser for PT#H#M format into minutes."""
        try:
            duration_str = duration_str.replace("PT", "")
            hours = 0
            mins = 0
            if "H" in duration_str:
                parts = duration_str.split("H")
                hours = int(parts[0])
                duration_str = parts[1]
            if "M" in duration_str:
                mins = int(duration_str.split("M")[0])
            return hours * 60 + mins
        except Exception:
            return 120 # Fallback 2 hours
