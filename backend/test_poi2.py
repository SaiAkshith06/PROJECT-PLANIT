from services.poi_service import POIService
svc = POIService()
# don't use the catch block to see full traceback
try:
    pois = svc.get_pois(15.2993, 73.8163, 10000)
except Exception as e:
    import traceback
    traceback.print_exc()
