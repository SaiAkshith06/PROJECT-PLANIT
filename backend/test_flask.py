import requests
import json
import time

try:
    print("Testing Flask Endpoint...")
    start_time = time.time()
    
    response = requests.post(
        "http://127.0.0.1:5001/api/plan", 
        json={
            "source": "Bangalore", 
            "destination": "Goa", 
            "sourceCoords": "77.5946,12.9716", 
            "destCoords": "73.8163,15.2993", 
            "budget": 5000, 
            "duration": 3
        },
        timeout=30
    )
    
    end_time = time.time()
    print(f"Status: {response.status_code}")
    print(f"Response (first 100 chars): {response.text[:100]}")
    print(f"Success! Finished in {end_time - start_time:.2f} seconds.")
except Exception as e:
    print(f"FAILED: {e}")
