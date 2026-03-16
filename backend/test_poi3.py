import requests
import json
radius, lat, lon = 10000, 15.2993, 73.8163
fallback_query = f"""
[out:json][timeout:15];
(
  node["tourism"="attraction"](around:{radius},{lat},{lon});
  node["historic"="monument"](around:{radius},{lat},{lon});
  node["leisure"="park"](around:{radius},{lat},{lon});
  node["amenity"="restaurant"](around:{radius},{lat},{lon});
  node["amenity"="cafe"](around:{radius},{lat},{lon});
);
out body 50;
>;
"""
response = requests.post("http://overpass-api.de/api/interpreter", data={'data': fallback_query}, timeout=20)
print(response.status_code)
try:
    data = response.json()
    print("elements:", len(data.get("elements", [])))
    if data.get("elements"):
        print("keys in element:", data["elements"][0].keys())
except Exception as e:
    print("Error:", e, response.text[:200])
