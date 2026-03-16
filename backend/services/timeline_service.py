class TimelineService:
    def process_itinerary(self, optimized_itinerary: dict) -> list:
        """
        Converts the dynamic optimized itinerary object into an ordered array of
        days containing precise mapped locations for 3D route animation.
        """
        timeline = []
        
        if not optimized_itinerary:
            return timeline
            
        # The optimized_itinerary is typically keyed by "Day 1", "Day 2", etc.
        # Ensure we sort them properly by the day number.
        sorted_days = sorted(optimized_itinerary.keys(), key=lambda x: int(x.split()[1]) if len(x.split()) > 1 and x.split()[1].isdigit() else 0)
        
        for idx, day_label in enumerate(sorted_days):
            day_num = idx + 1
            day_plan = optimized_itinerary[day_label]
            
            locations = []
            for step in day_plan:
                poi = step.get('poi', {})
                if not poi:
                    continue
                    
                lat = poi.get('lat')
                lon = poi.get('lon')
                
                # Try explicit type parsing, default to type passed or generic sightseeing
                step_type = step.get('type')
                if step_type == 'lining' or 'restaurant' in step.get('activity', '').lower():
                    step_type = 'restaurant'
                elif 'hotel' in step.get('activity', '').lower() or 'stay' in step.get('activity', '').lower():
                    step_type = 'hotel'
                elif 'transport' in step.get('activity', '').lower() or 'flight' in step.get('activity', '').lower() or 'bus' in step.get('activity', '').lower():
                     step_type = 'transport'
                else:
                    step_type = 'attraction'
                
                if lat is not None and lon is not None:
                    try:
                        locations.append({
                            "name": poi.get('name', 'Unknown Spot'),
                            "lat": float(lat),
                            "lon": float(lon),
                            "type": step_type
                        })
                    except ValueError:
                        pass
                        
            timeline.append({
                "day": day_num,
                "label": day_label,
                "locations": locations
            })
            
        return timeline
