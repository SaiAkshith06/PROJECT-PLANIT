import requests
import urllib.parse


def get_coordinates(destination: str):
    """
    Reliable geocoding using OpenStreetMap Nominatim
    """

    if not destination:
        return None

    try:
        url = "https://nominatim.openstreetmap.org/search"

        params = {
            "q": f"{destination}, India",
            "format": "json",
            "limit": 1
        }

        headers = {
            "User-Agent": "planit-app"
        }

        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()

        data = response.json()

        if not data:
            print("[Geocode] No results found")
            return None

        lat = float(data[0]["lat"])
        lon = float(data[0]["lon"])

        print(f"[Geocode] {destination} → ({lat}, {lon})")

        return (lat, lon)

    except Exception as e:
        print(f"[Geocode ERROR] {e}")
        return None