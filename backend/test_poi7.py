import requests
radius, lat, lon = 5000, 15.2993, 73.8163
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
response = requests.post("http://overpass-api.de/api/interpreter", data={'data': query}, timeout=20)
print(response.status_code)
if response.status_code == 200:
    els = response.json().get("elements", [])
    print(f"Total returned elements: {len(els)}")
else:
    print(response.text[:200])
