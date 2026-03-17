import os
import requests

import hashlib

def get_fallback_image(query: str) -> str:
    """Generates a pseudo-random but consistent vibrant image URL based on the query hash."""
    fallbacks = [
        "https://images.unsplash.com/photo-1524492459426-03716d3f231e", # India Gate
        "https://images.unsplash.com/photo-1514222134-b57cbb4ce073",    # Taj Mahal sunset
        "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f",    # Hawa Mahal
        "https://images.unsplash.com/photo-1587474260584-136574528ed5", # Delhi Street
        "https://images.unsplash.com/photo-1561577553-685cb68ebf6e",    # Kerala Backwaters
        "https://images.unsplash.com/photo-1506461883276-594543d0e22b", # Elephants Nature
        "https://images.unsplash.com/photo-1477587458883-47145ed94245"  # General Architecture
    ]
    hash_val = int(hashlib.md5(query.encode('utf-8')).hexdigest(), 16)
    idx = hash_val % len(fallbacks)
    return fallbacks[idx]

def get_image(query: str):
    """
    Fetches a high-quality image URL from Unsplash for a given query (e.g., 'Eiffel Tower').
    """
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        return get_fallback_image(query)

    url = f"https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": access_key,
        "per_page": 1,
        "orientation": "landscape"
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        if data.get("results"):
            return data["results"][0]["urls"]["regular"]
    except Exception as e:
        print(f"[UnsplashService] Error fetching image for '{query}': {e}")

    # Fallback to a generic travel image
    return get_fallback_image(query)