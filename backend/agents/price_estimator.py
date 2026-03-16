price_rates = {
    "bike": 3,
    "car": 8,
    "bus": 2,
    "train": 1.5,
    "flight": 12
}

def calculate_distance(route):
    """
    Extracts route distance from the OSRM response (in kilometers).
    Defaults to 300km if distance_meters is missing.
    """
    return route.get("distance_meters", 300000) / 1000.0

def estimate_price(mode, distance):
    """
    Estimates the price of a transport mode given a distance in km.
    Formula: price = distance * price_rates[mode]
    """
    rate = price_rates.get(mode.lower(), 1.0)
    return round(distance * rate)
