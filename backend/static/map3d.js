// Map3D.js
// Modern map engine built on MapLibre GL JS replacing older Leaflet engine

let map;
let markers = [];
let routeSourceLayers = [];
let animationFrameId = null;

// Day matching colors
const DAY_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];
const EMOJI_ICONS = {
    'hotel': '🏨',
    'attraction': '📍',
    'restaurant': '🍽',
    'transport': '✈️',
    'monument': '🏛️',
    'park': '🌳'
};

document.addEventListener("DOMContentLoaded", () => {
    init3DMap();
});

function init3DMap() {
    // Use a localized raster Tile Provider that cleanly aligns with Indian Government definitions.
    // Google's localized tile servers (gl=IN) reflect official Indian boundaries for J&K and Arunachal.
    map = new maplibregl.Map({
        container: 'map',
        style: {
            'version': 8,
            'sources': {
                'google-raster': {
                    'type': 'raster',
                    'tiles': [
                        'https://mt1.google.com/vt/lyrs=m&hl=en&gl=IN&x={x}&y={y}&z={z}'
                    ],
                    'tileSize': 256
                }
            },
            'layers': [
                {
                    'id': 'google-tiles',
                    'type': 'raster',
                    'source': 'google-raster',
                    'minzoom': 0,
                    'maxzoom': 22
                }
            ]
        },
        center: [78.9629, 20.5937],
        zoom: 4,
        pitch: 45, // 3D Tilt perspective
        bearing: -10
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
}

// Override global draw functions called by main.js
window.drawRoutesOnMap = function (allRoutes) {
    if (!map) return;
    if (!map.loaded()) {
        map.once('style.load', () => window.drawRoutesOnMap(allRoutes));
        return;
    }

    clearMapLayers();
    if (!allRoutes || allRoutes.length === 0) return;

    let allMapCoordinates = [];
    let tollCoords = [];

    // Draw routes in reverse order so the primary (index 0) is drawn last and appears on top
    for (let i = allRoutes.length - 1; i >= 0; i--) {
        const route = allRoutes[i];
        if (!route.geometry) continue;

        let coordinates = [];
        if (route.geometry.type === "LineString") {
            coordinates = route.geometry.coordinates; // maplibre expects [lng, lat]
        } else {
            coordinates = Array.isArray(route.geometry) ? route.geometry.map(c => [c[1], c[0]]) : [];
        }

        if (coordinates.length > 0) {
            allMapCoordinates.push(...coordinates);

            const isPrimary = i === 0;
            const sourceId = `route-${i}`;

            map.addSource(sourceId, {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': { 'type': 'LineString', 'coordinates': coordinates }
                }
            });

            map.addLayer({
                'id': `${sourceId}-line`,
                'type': 'line',
                'source': sourceId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': isPrimary ? '#3b82f6' : '#94a3b8',
                    'line-width': isPrimary ? 6 : 4,
                    'line-opacity': isPrimary ? 0.9 : 0.6,
                    'line-dasharray': isPrimary ? [1] : [2, 2]
                }
            });
            routeSourceLayers.push(sourceId);

            // Collect tolls if available
            if (route.tolls && Array.isArray(route.tolls)) {
                route.tolls.forEach(toll => {
                    if (toll.lat && toll.lon) {
                        tollCoords.push({ lat: toll.lat, lon: toll.lon, name: toll.name || 'Toll Booth' });
                    }
                });
            }
        }
    }

    // Draw Toll Markers
    tollCoords.forEach(t => {
        addMarker(t.lon, t.lat, 'attraction', `🚧 ${t.name}`, '#f59e0b');
    });

    if (allMapCoordinates.length > 0) {
        fitBoundsToCoordinates(allMapCoordinates);
    }
};

window.drawPOIsOnMap = function (data) {
    if (!map || !map.loaded()) {
        // Queue rendering if map skipped loading
        if (map) map.once('style.load', () => window.drawPOIsOnMap(data));
        return;
    }
    clearMapLayers(); // We wipe previous lines/markers when re-rendering overall POIs without timeline

    let allCoords = [];

    // If we have a structured timeline, plot that!
    if (data.timeline && data.timeline.length > 0) {
        renderTimeline(data.timeline);
        return;
    }

    // Otherwise generic fallback rendering
    if (data.recommended_hotels) {
        data.recommended_hotels.forEach(h => {
            if (h.lon && h.lat) {
                addMarker(h.lon, h.lat, 'hotel', h.name, '#3b82f6');
                allCoords.push([h.lon, h.lat]);
            }
        });
    }

    if (allCoords.length > 0) fitBoundsToCoordinates(allCoords);
};

// ===============================================
// TIMELINE AND ANIMATOR LOGIC
// ===============================================
let globalTimeline = [];

function renderTimeline(timelineData) {
    globalTimeline = timelineData;
    let allCoords = [];

    // Ensure the Play Trip button is hooked up
    const playBtn = document.getElementById('play-trip-btn');
    if (playBtn) {
        // Clone the button to safely wipe out any old event listeners
        const newPlayBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
        newPlayBtn.addEventListener('click', animateEntireTrip);
    }

    // Clear everything
    clearMapLayers();

    // Plot static markers for full itinerary
    globalTimeline.forEach((dayObj, i) => {
        const color = DAY_COLORS[i % DAY_COLORS.length];

        dayObj.locations.forEach(loc => {
            if (loc.lon && loc.lat) {
                addMarker(loc.lon, loc.lat, loc.type, `${loc.name} (Day ${dayObj.day})`, color);
                allCoords.push([loc.lon, loc.lat]);
            }
        });
    });

    // Zoom to see itinerary
    if (allCoords.length > 0) {
        fitBoundsToCoordinates(allCoords);
    } else {
        // Fallback to center of destination from search somehow?
        // (Handled by main.js passing fallback data usually)
    }
}

// Global Animate Entire Trip sequence
async function animateEntireTrip() {
    console.log("[Map3D] Animating entire trip...", globalTimeline);
    if (!globalTimeline || globalTimeline.length === 0) {
        console.warn("[Map3D] Cannot animate: globalTimeline is empty.");
        return;
    }

    // Disable button to prevent overlapping animations
    const btn = document.getElementById('play-trip-btn');
    let originalHtml = "";
    if (btn) {
        btn.disabled = true;
        originalHtml = btn.innerHTML;
        btn.innerHTML = '<span>🎬 Animating...</span>';
    }

    try {
        clearRoutes(); // wipe just lines, keep static markers

        for (let i = 0; i < globalTimeline.length; i++) {
            const dayPlan = globalTimeline[i];
            const color = DAY_COLORS[i % DAY_COLORS.length];
            console.log(`[Map3D] Animating Day ${dayPlan.day} (${i + 1}/${globalTimeline.length})`);

            // Ensure we have at least 2 locations to draw a line
            if (dayPlan.locations.length > 1) {
                for (let j = 0; j < dayPlan.locations.length - 1; j++) {
                    const start = [dayPlan.locations[j].lon, dayPlan.locations[j].lat];
                    const end = [dayPlan.locations[j + 1].lon, dayPlan.locations[j + 1].lat];

                    // Instantly draw a faint guide line so the user sees where we are going
                    const guideId = `guide-day${dayPlan.day}-step${j}`;
                    map.addSource(guideId, {
                        'type': 'geojson',
                        'data': { 'type': 'Feature', 'geometry': { 'type': 'LineString', 'coordinates': [start, end] } }
                    });
                    map.addLayer({
                        'id': `${guideId}-layer`,
                        'type': 'line',
                        'source': guideId,
                        'layout': { 'line-join': 'round', 'line-cap': 'round' },
                        'paint': { 'line-color': color, 'line-width': 2, 'line-opacity': 0.4, 'line-dasharray': [2, 2] }
                    });
                    routeSourceLayers.push(guideId);

                    // Focus camera on start location but keep pitch lower so destination might be visible
                    map.flyTo({ center: start, zoom: 13.5, pitch: 40, speed: 1.2 });
                    await new Promise(r => setTimeout(r, 1200));

                    // Draw animated progress line
                    await animateRouteLine(start, end, `route-day${dayPlan.day}-step${j}`, color);
                }
            } else if (dayPlan.locations.length === 1) {
                const pt = [dayPlan.locations[0].lon, dayPlan.locations[0].lat];
                map.flyTo({ center: pt, zoom: 14, pitch: 30, speed: 1.2 });
                await new Promise(r => setTimeout(r, 1500));
            }
        }
    } catch (err) {
        console.error("[Map3D] Animation Error:", err);
    } finally {
        // Reset view to show whole trip when done
        let allCoords = [];
        globalTimeline.forEach(d => d.locations.forEach(l => allCoords.push([l.lon, l.lat])));
        if (allCoords.length > 0) fitBoundsToCoordinates(allCoords);

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml || '▶ Play Trip';
        }
    }
}

// Draw line block by block visually
function animateRouteLine(startCoord, endCoord, sourceId, color) {
    return new Promise((resolve) => {
        const steps = 45; // Faster drawing
        const lineCoords = [];

        map.addSource(sourceId, {
            'type': 'geojson',
            'data': { 'type': 'Feature', 'geometry': { 'type': 'LineString', 'coordinates': [startCoord] } }
        });

        map.addLayer({
            'id': `${sourceId}-layer`,
            'type': 'line',
            'source': sourceId,
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': { 'line-color': color, 'line-width': 6 }
        });

        routeSourceLayers.push(sourceId);

        let currentStep = 0;

        function stepAnimation() {
            currentStep++;
            const factor = currentStep / steps;

            // Simple linear interpolation for short city hops
            const curLng = startCoord[0] + (endCoord[0] - startCoord[0]) * factor;
            const curLat = startCoord[1] + (endCoord[1] - startCoord[1]) * factor;

            lineCoords.push([curLng, curLat]);

            const source = map.getSource(sourceId);
            if (source) {
                source.setData({
                    'type': 'Feature',
                    'geometry': { 'type': 'LineString', 'coordinates': lineCoords }
                });
            }

            // Pan camera slightly to follow the drawing line
            if (currentStep % 5 === 0) {
                map.panTo([curLng, curLat], { duration: 0 });
            }

            if (currentStep < steps) {
                animationFrameId = requestAnimationFrame(stepAnimation);
            } else {
                resolve();
            }
        }

        stepAnimation();
    });
}

// ===============================================
// HELPERS
// ===============================================

function addMarker(lng, lat, typeStr, popupText, colorStr) {
    const el = document.createElement('div');
    const icon = EMOJI_ICONS[typeStr] || '📍';
    el.innerHTML = `<div style="background-color: ${colorStr}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">${icon}</div>`;

    el.style.cursor = 'pointer';

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`<b>${popupText}</b><br>Type: ${typeStr}`);

    const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

    markers.push(marker);

    // Add click handler to simulate timeline clicking behavior
    el.addEventListener('click', () => {
        map.flyTo({ center: [lng, lat], zoom: 15, pitch: 45 });
    });
}

function clearMapLayers() {
    clearRoutes();
    markers.forEach(m => m.remove());
    markers = [];
}

function clearRoutes() {
    if (!map) return;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    routeSourceLayers.forEach(id => {
        try {
            if (map.getLayer(`${id}-layer`)) map.removeLayer(`${id}-layer`);
            if (map.getLayer(`${id}-line`)) map.removeLayer(`${id}-line`);
            if (map.getLayer(id)) map.removeLayer(id);
            if (map.getSource(id)) map.removeSource(id);
        } catch (e) {
            console.warn("Cleanup error for source/layer:", id, e);
        }
    });
    routeSourceLayers = [];
}

function fitBoundsToCoordinates(coordsArray) {
    if (!coordsArray || coordsArray.length === 0) return;

    const bounds = new maplibregl.LngLatBounds(coordsArray[0], coordsArray[0]);
    coordsArray.forEach(coord => bounds.extend(coord));

    map.fitBounds(bounds, { padding: 50, duration: 1500 });
}

// Expose click-to-center for timeline list items
window.centerMapOn = function (lng, lat) {
    if (map) map.flyTo({ center: [lng, lat], zoom: 14, pitch: 50 });
};
