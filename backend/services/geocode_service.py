"""
Geocoding service to convert location names into coordinates using Photon API.
"""
from __future__ import annotations

import urllib.parse
import requests

def _admin_rank(props: dict) -> int:
    """
    Higher is better.

    Project constraint: only India destinations. When multiple India matches exist,
    prefer: state > city > town > village.
    """
    osm_value = (props.get("osm_value") or "").lower()
    place_type = (props.get("type") or "").lower()

    v = osm_value or place_type

    if v == "state":
        return 4
    if v == "city":
        return 3
    if v == "town":
        return 2
    if v == "village":
        return 1
    return 0


def get_coordinates(destination: str):
    """
    Geocode Indian destinations.

    - Query Photon using "{destination}, India"
    - Filter to India results only (country == "India" OR countrycode == "IN")
    - Prefer: state > city > town > village
    - If Photon yields no acceptable result, fallback to OSM Nominatim

    Returns (lat, lon) floats or None.
    """
    if not destination:
        return None

    headers = {"User-Agent": "PlanIt-MultiAgentPlanner/1.0"}

    query = f"{destination}, India"
    url = f"https://photon.komoot.io/api/?q={urllib.parse.quote(query)}&lat=20.5937&lon=78.9629&limit=10"

    def _log_selected(name: str | None, state: str | None, country: str | None, lat: float, lon: float):
        print(
            "[GeocodeService] Selected location "
            f"→ name={name!r}, state={state!r}, country={country!r}, lat={lat}, lon={lon}"
        )

    try:
        response = requests.get(url, headers=headers, timeout=8)
        data = response.json()
        
        features = (data or {}).get("features") or []

        def is_india(f: dict) -> bool:
            props = f.get("properties", {}) or {}
            country = props.get("country")
            country_code = (props.get("countrycode") or props.get("country_code") or "").upper()
            return country == "India" or country_code == "IN"

        india_features = [f for f in features if is_india(f)] if features else []

        if india_features:
            selected = max(
                india_features,
                key=lambda f: _admin_rank(f.get("properties", {})),
            )
            props = selected.get("properties", {}) or {}
            coords = (selected.get("geometry", {}) or {}).get("coordinates") or []
            if len(coords) == 2:
                lon, lat = coords[0], coords[1]
                lat_f = float(lat)
                lon_f = float(lon)
                name = props.get("name") or destination
                state = props.get("state")
                country = props.get("country")
                _log_selected(name, state, country, lat_f, lon_f)
                return (lat_f, lon_f)

        # Photon returned no India match (or malformed), fallback to Nominatim.
        nom_q = f"{destination},India"
        nom_url = (
            "https://nominatim.openstreetmap.org/search"
            f"?q={urllib.parse.quote(nom_q)}&format=json&limit=1&addressdetails=1"
        )
        nom_resp = requests.get(nom_url, headers=headers, timeout=8)
        nom_resp.raise_for_status()
        nom_data = nom_resp.json() or []
        if not nom_data:
            return None

        top = nom_data[0] or {}
        lat_f = float(top.get("lat"))
        lon_f = float(top.get("lon"))
        address = top.get("address", {}) or {}
        country = address.get("country")
        country_code = (address.get("country_code") or "").upper()
        if country != "India" and country_code != "IN":
            return None

        name = top.get("display_name") or destination
        state = address.get("state")
        _log_selected(name, state, country, lat_f, lon_f)
        return (lat_f, lon_f)
    except Exception as e:
        print(f"[GeocodeService] Error for destination={destination!r} (query={query!r}): {e}")
    return None
