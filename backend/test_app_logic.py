from app.routes import bp, run_planit
import time

try:
    print("Starting planit diagnostic...")
    start_time = time.time()
    
    # Send a small plan request directly to the logic pipeline
    result = run_planit("Bangalore", "Hyderabad", budget=5000, duration=3)
    
    end_time = time.time()
    print(f"Success! Finished in {end_time - start_time:.2f} seconds.")
except Exception as e:
    print(f"FAILED inside run_planit: {e}")
    import traceback
    traceback.print_exc()
