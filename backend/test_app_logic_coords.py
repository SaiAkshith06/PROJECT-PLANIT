from app.routes import bp, run_planit
import time

try:
    print("Starting planit diagnostic with Coords...")
    start_time = time.time()
    
    # Dest coords required to trigger TripPlannerAgent
    result = run_planit(
        source="Bangalore", 
        destination="Hyderabad", 
        source_coords="77.5946,12.9716", 
        dest_coords="78.4867,17.3850", 
        budget=5000, 
        duration=3
    )
    
    end_time = time.time()
    print(f"Success! Finished in {end_time - start_time:.2f} seconds.")
except Exception as e:
    print(f"FAILED inside run_planit: {e}")
    import traceback
    traceback.print_exc()
