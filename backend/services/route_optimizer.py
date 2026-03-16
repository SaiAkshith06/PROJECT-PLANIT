import math

class RouteOptimizer:
    """
    Optimizes a sequence of coordinates using the Nearest Neighbor algorithm 
    to create an efficient sightseeing itinerary starting from a hotel.
    """
    
    @staticmethod
    def haversine(lat1, lon1, lat2, lon2):
        """
        Calculate the great circle distance between two points 
        on the earth (specified in decimal degrees) in kilometers.
        """
        # Convert decimal degrees to radians 
        lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

        # Haversine formula 
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a)) 
        r = 6371 # Radius of earth in kilometers.
        return c * r
        
    def optimize_route(self, start_lat, start_lon, pois):
        """
        Takes a starting coordinate (e.g. Hotel) and a list of POI dictionaries:
        [{'name': 'X', 'lat': 12.3, 'lon': 45.6, 'type': 'attraction'}, ...]
        Returns an ordered list representing the optimized path.
        """
        if not pois:
            return []
            
        unvisited = list(pois)
        optimized_path = []
        
        current_lat = start_lat
        current_lon = start_lon
        
        while unvisited:
            # Find the closest unvisited POI
            closest_poi = None
            min_dist = float('inf')
            
            for poi in unvisited:
                try:
                    poi_lat = float(poi['lat'])
                    poi_lon = float(poi['lon'])
                    dist = self.haversine(current_lat, current_lon, poi_lat, poi_lon)
                    
                    if dist < min_dist:
                        min_dist = dist
                        closest_poi = poi
                except (ValueError, TypeError, KeyError):
                    continue
            
            if not closest_poi:
                break # Failsafe if structural issues arise
                
            # Move to the closest POI
            optimized_path.append(closest_poi)
            unvisited.remove(closest_poi)
            
            # Update our cursor
            current_lat = float(closest_poi['lat'])
            current_lon = float(closest_poi['lon'])
            
        return optimized_path
