import requests
radius, lat, lon = 10000, 15.2993, 73.8163
query = f"""
[out:json][timeout:15];
(
  node["tourism"="attraction"]["wikipedia"](around:{radius},{lat},{lon});
  node["historic"="monument"]["wikipedia"](around:{radius},{lat},{lon});
  node["amenity"="restaurant"]["wikipedia"](around:{radius},{lat},{lon});
);
out body 30;
(
  node["tourism"="attraction"](around:{radius},{lat},{lon});
  node["historic"="monument"](around:{radius},{lat},{lon});
  node["leisure"="park"](around:{radius},{lat},{lon});
  node["amenity"="restaurant"](around:{radius},{lat},{lon});
  node["amenity"="cafe"](around:{radius},{lat},{lon});
);
out body 50;
"""
response = requests.post("http://overpass-api.de/api/interpreter", data={'data': query}, timeout=20)
print(response.status_code)
if response.status_code == 200:
    els = response.json().get("elements", [])
    print(f"Total returned elements: {len(els)}")
    for el in els[:5]:
        print(el.get("tags", {}).get("name", "Unknown"))
else:
    print(response.text[:200])
