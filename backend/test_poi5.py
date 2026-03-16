from services.poi_service import POIService
svc = POIService()
pois = svc.get_pois(15.2993, 73.8163, 5000)
print(f"Total POIs: {len(pois)}")
print(pois[:5])
