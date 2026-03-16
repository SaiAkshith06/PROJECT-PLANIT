// Map variables and logic moved to map3d.js
let activeTab = 'personal';
let currentRoutesData = [];
let personalRoutesData = [], cabRoutesData = [], busRoutesData = [], trainRoutesData = [], flightRoutesData = [];

// Initialize logic
document.addEventListener("DOMContentLoaded", () => {
    setupAutocomplete('source');
    setupAutocomplete('destination');

    document.getElementById('cat-transport').addEventListener('click', () => switchCategory('transport'));
    document.getElementById('cat-trip').addEventListener('click', () => switchCategory('trip'));

    // Fetch Best AI Opportunities on load
    fetchTravelOpportunities();
});

async function fetchTravelOpportunities() {
    const oppContainer = document.getElementById('ai-travel-opportunities');
    if (!oppContainer) return;

    try {
        const response = await fetch('/api/opportunities');
        const data = await response.json();

        if (response.ok && data.opportunities && data.opportunities.length > 0) {
            oppContainer.innerHTML = data.opportunities.slice(0, 3).map(dest => `
                <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                     onclick="document.getElementById('destination').value='${dest.destination}'; document.getElementById('destination').focus();">
                    <div>
                        <div class="font-bold text-sm text-white">${dest.destination} <span class="text-xs text-gray-400 font-normal">(${dest.type})</span></div>
                        <div class="text-xs text-emerald-400 font-semibold">Score: ${dest.score}/10</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-blue-400 text-sm">₹${dest.estimated_cost}</div>
                        <div class="text-[0.65rem] text-gray-500">est. cost</div>
                    </div>
                </div>
            `).join('');
        } else {
            oppContainer.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-secondary);">No opportunities found right now.</p>`;
        }
    } catch (err) {
        oppContainer.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-secondary);">Live deals unavailable.</p>`;
    }
}

// Category Switcher Logic
function switchCategory(cat) {
    const transportBtn = document.getElementById('cat-transport');
    const tripBtn = document.getElementById('cat-trip');
    const transportSec = document.getElementById('section-transport');
    const tripSec = document.getElementById('section-trip');

    if (cat === 'transport') {
        transportBtn.style.backgroundColor = '#2563eb';
        transportBtn.style.color = 'white';
        tripBtn.style.backgroundColor = '#e2e8f0';
        tripBtn.style.color = '#475569';

        transportSec.style.display = 'block';
        tripSec.style.display = 'none';

        // Re-highlight the active route if returning to transport tab
        if (window.currentRoutesData && window.currentRoutesData.length > 0) {
            drawRoutesOnMap(window.currentRoutesData);
            let activeIdx = 0;
            const cards = document.querySelectorAll('#alt-routes-container .ticket-card');
            cards.forEach((c, idx) => { if (c.classList.contains('highlight')) activeIdx = idx; });
            highlightRouteOnMap(activeIdx);
            if (window.lastData) drawPOIsOnMap(window.lastData);
        }
    } else {
        tripBtn.style.backgroundColor = '#2563eb';
        tripBtn.style.color = 'white';
        transportBtn.style.backgroundColor = '#e2e8f0';
        transportBtn.style.color = '#475569';

        transportSec.style.display = 'none';
        tripSec.style.display = 'block';
        if (window.lastData) drawPOIsOnMap(window.lastData);
    }
}

// Autocomplete Logic using Photon (ElasticSearch on OSM)
function setupAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    const wrapper = document.getElementById(`${inputId}-wrapper`);
    let timeout = null;

    input.addEventListener("input", function () {
        clearTimeout(timeout);
        closeAllLists();
        const query = this.value;
        if (!query || query.length < 3) {
            // Clear coordinates if user types to change location
            input.dataset.lat = '';
            input.dataset.lon = '';
            return false;
        }

        // Fetch after 300ms debounce
        timeout = setTimeout(async () => {
            try {
                let queriesToTry = [query];

                // 1. Wikipedia OpenSearch Alias Layer (Fixes fuzzy Indian spellings like 'Shiridi' -> 'Shirdi')
                try {
                    const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`);
                    const wikiData = await wikiRes.json();
                    if (wikiData && wikiData[1] && wikiData[1].length > 0) {
                        const suggestion = wikiData[1][0];
                        // If Wikipedia found a formal title that differs slightly (alias/correction)
                        if (suggestion.toLowerCase() !== query.toLowerCase() && suggestion.length < query.length + 8) {
                            queriesToTry.push(suggestion);
                        }
                    }
                } catch (e) { console.warn("Wikipedia alias check failed:", e); }

                let rawFeatures = [];
                // 2. Fetch from Photon using original query + Wikipedia corrected query (if any)
                for (let q of queriesToTry) {
                    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=20.5937&lon=78.9629&limit=15`);
                    const data = await res.json();
                    if (data && data.features) {
                        rawFeatures.push(...data.features);
                    }
                }

                if (rawFeatures.length > 0) {
                    const dropdown = document.createElement("div");
                    dropdown.setAttribute("class", "autocomplete-items");

                    // Filter results strictly to India and deduplicate by OSM ID
                    let seenIds = new Set();
                    const indianResults = rawFeatures.filter(f => {
                        if (f.properties.country !== "India") return false;
                        if (seenIds.has(f.properties.osm_id)) return false;
                        seenIds.add(f.properties.osm_id);
                        return true;
                    }).slice(0, 5); // Keep top 5 unique Indian results

                    if (indianResults.length === 0) {
                        const noRes = document.createElement("div");
                        noRes.innerHTML = `<em>No locations found in India...</em>`;
                        dropdown.appendChild(noRes);
                    }

                    indianResults.forEach(feature => {
                        const props = feature.properties;
                        // Build a clean display name
                        const nameParts = [props.name, props.city, props.state, props.country].filter(Boolean);
                        const uniqueParts = [...new Set(nameParts)];
                        const displayName = uniqueParts.join(", ");

                        const option = document.createElement("div");
                        // Highlight matching parts if possible, else just bold the start
                        option.innerHTML = `<strong>${displayName.substring(0, query.length)}</strong>${displayName.substring(query.length)}`;

                        option.addEventListener("click", function () {
                            input.value = displayName;
                            if (feature.geometry && feature.geometry.coordinates) {
                                input.dataset.lon = feature.geometry.coordinates[0];
                                input.dataset.lat = feature.geometry.coordinates[1];
                            }
                            closeAllLists();
                        });
                        dropdown.appendChild(option);
                    });

                    wrapper.appendChild(dropdown);
                }
            } catch (err) {
                console.error("Geocoding fetch error:", err);
            }
        }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (e.target !== input) closeAllLists();
    });

    function closeAllLists() {
        const items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            items[i].parentNode.removeChild(items[i]);
        }
    }
}

// Removed initMap - handled by map3d.js
// Handle Form Submission
document.getElementById('plan-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const sourceInput = document.getElementById('source');
    const destInput = document.getElementById('destination');

    // Grab textual names for fallback
    const sourceName = sourceInput.value;
    const destName = destInput.value;

    // NEW inputs
    const budgetVal = parseInt(document.getElementById('budget')?.value || 5000);
    const durationVal = parseInt(document.getElementById('duration')?.value || 3);

    // Grab precise coordinates if the user selected them from the autocomplete
    const sourceCoords = (sourceInput.dataset.lon && sourceInput.dataset.lat)
        ? `${sourceInput.dataset.lon},${sourceInput.dataset.lat}`
        : null;

    const destCoords = (destInput.dataset.lon && destInput.dataset.lat)
        ? `${destInput.dataset.lon},${destInput.dataset.lat}`
        : null;

    const btnBtn = document.getElementById('submit-btn');
    const originalText = btnBtn.innerHTML;
    btnBtn.innerHTML = '<span class="loader" style="display:block; margin: 0 auto;"></span>';
    btnBtn.disabled = true;

    try {
        const response = await fetch('/api/plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: sourceName,
                destination: destName,
                sourceCoords: sourceCoords,
                destCoords: destCoords,
                budget: budgetVal,
                duration: durationVal
            })
        });

        const data = await response.json();

        if (response.ok) {
            window.lastData = data; // store globally for re-rendering on tab switch
            const routePayload = data.routes || data.all_routes || [];
            displayResults(routePayload);
            drawRoutesOnMap(routePayload);
            // NEW Travel Platform Renders
            displayTravelPlatformData(data);
            drawPOIsOnMap(data);

            // Default select the Transport category
            switchCategory('transport');
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        console.error("Critical API or Rendering Error:", err);
        alert("PlanIt Error: " + err.message);
    } finally {
        btnBtn.innerHTML = originalText;
        btnBtn.disabled = false;
    }
});

// Render the Results UI
function displayResults(allRoutes) {
    // Separate routes by category
    personalRoutesData = allRoutes.filter(r => r.category === 'personal');
    cabRoutesData = allRoutes.filter(r => r.category === 'cab');
    busRoutesData = allRoutes.filter(r => r.category === 'bus');
    trainRoutesData = allRoutes.filter(r => r.category === 'train');
    flightRoutesData = allRoutes.filter(r => r.category === 'flight');

    const resultsContainer = document.getElementById('results-container');

    // Show container
    resultsContainer.classList.remove('hidden');

    // Attach Tab Listeners (only once ideally, but safe to overwrite)
    document.getElementById('tab-personal').onclick = () => switchTab('personal');
    document.getElementById('tab-cabs').onclick = () => switchTab('cab');
    document.getElementById('tab-bus').onclick = () => switchTab('bus');
    document.getElementById('tab-train').onclick = () => switchTab('train');
    document.getElementById('tab-flight').onclick = () => switchTab('flight');

    // Render default tab
    switchTab(activeTab);
}

function switchTab(tabName) {
    activeTab = tabName;

    // Update button styling
    document.getElementById('tab-personal').classList.toggle('active', tabName === 'personal');
    document.getElementById('tab-cabs').classList.toggle('active', tabName === 'cab');
    document.getElementById('tab-bus').classList.toggle('active', tabName === 'bus');
    document.getElementById('tab-train').classList.toggle('active', tabName === 'train');
    document.getElementById('tab-flight').classList.toggle('active', tabName === 'flight');

    const altRoutesContainer = document.getElementById('alt-routes-container');
    altRoutesContainer.innerHTML = '';

    let dataToRender = [];
    if (tabName === 'personal') dataToRender = personalRoutesData;
    else if (tabName === 'cab') dataToRender = cabRoutesData;
    else if (tabName === 'bus') dataToRender = busRoutesData;
    else if (tabName === 'train') dataToRender = trainRoutesData;
    else if (tabName === 'flight') dataToRender = flightRoutesData;

    // Set global data array so the map drawing logic works seamlessly
    currentRoutesData = dataToRender;

    if (!dataToRender || dataToRender.length === 0) {
        altRoutesContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; padding: 10px;">No options available for this category.</p>';
        drawRoutesOnMap([]); // clear map
        return;
    }

    dataToRender.forEach((route, index) => {
        const el = document.createElement('div');
        el.className = 'result-card';
        // Add click listener to highlight route on map
        el.addEventListener('click', () => highlightRouteOnMap(index));
        el.innerHTML = createRouteCardHTML(route, index === 0);
        altRoutesContainer.appendChild(el);
    });

    // Draw the routes on the map for the active tab, and highlight the first one
    drawRoutesOnMap(dataToRender);
    if (dataToRender.length > 0) {
        highlightRouteOnMap(0);
    }
}

// Helper to generate HTML for a route card
function createRouteCardHTML(route, isBest) {
    const distanceKm = (route.distance_meters / 1000).toFixed(1);

    // Convert seconds to human readable time
    const mins = Math.round(route.time_seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const timeStr = hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins}m`;

    const iconMap = {
        "UberGo": "🚗",
        "UberXL": "🚙",
        "Ola Mini": "🚕",
        "Ola Prime SUV": "🏎️",
        "Rapido Bike": "🛵",
    };

    let icon = iconMap[route.provider];
    if (!icon) {
        if (route.mode === 'bus') icon = "🚌";
        else if (route.mode === 'train') icon = "🚆";
        else if (route.mode === 'flight') icon = "✈️";
        else icon = "🚗";
    }
    const displayMode = route.provider;

    // Add wait time
    const waitTimeText = route.eta_mins ? `${route.eta_mins} mins away` : "";

    // Add Surge styling
    let surgeBadge = "";
    if (route.surge > 1.0) {
        surgeBadge = `<span class="surge-badge" style="background: #fee2e2; border: 1px solid #fca5a5; color: #ef4444; border-radius: 6px; padding: 2px 6px; font-weight: bold; font-size: 0.65rem; margin-left: 8px;">⬆️ ${route.surge}x Surge</span>`;
    }

    let costStr = route.cost === 0 ? 'Free' : `₹${route.cost.toLocaleString('en-IN')}`;
    if (route.estimated) {
        costStr += ' (estimated)';
    }
    let tollText = '';

    // Route Label Badges
    let labelBadge = '';
    if (route.label === "recommended") {
        labelBadge = `<div style="position: absolute; top: -1px; right: 20px; background: #2563eb; color: white; padding: 4px 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-weight: 700; font-size: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 4px;">⭐ Recommended</div>`;
    } else if (route.label === "fastest") {
        labelBadge = `<div style="position: absolute; top: -1px; right: 20px; background: #10b981; color: white; padding: 4px 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-weight: 700; font-size: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 4px;">⚡ Fastest</div>`;
    } else if (route.label === "cheapest") {
        labelBadge = `<div style="position: absolute; top: -1px; right: 20px; background: #8b5cf6; color: white; padding: 4px 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-weight: 700; font-size: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 4px;">💰 Cheapest</div>`;
    }

    // For Personal Driving, clearly show the breakdown of the total cost
    if (route.category === 'personal') {
        const fuelCost = route.base_cost.toLocaleString('en-IN');
        const tollAmount = route.toll_cost > 0 ? ` + Tolls: ₹${route.toll_cost}` : '';
        tollText = `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Fuel: ₹${fuelCost}${tollAmount}</div>`;
    } else if (route.toll_cost > 0) {
        // Cabs just show tolls as an extra warning
        tollText = `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">+ Tolls: ₹${route.toll_cost}</div>`;
    }

    return `
        <div class="ticket-card ${route.label === 'recommended' ? 'highlight' : ''}" style="cursor: pointer; position: relative;">
            ${labelBadge}
            <div class="ticket-header" style="align-items: center; padding-top: ${labelBadge !== '' ? '14px' : '0'};">
                <div class="provider-info" style="display: flex; align-items: center;">
                    <span style="font-size: 1.4rem; margin-right: 8px;">${icon}</span>
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-color);">${displayMode}</span>
                    ${surgeBadge}
                </div>
                <div class="flight-number" style="color: #2563eb; font-weight: 700;">${waitTimeText}</div>
            </div>
            
            <div class="ticket-timeline">
                <div class="time-block" style="text-align: left;">
                    <span class="time">${route.depart_time || 'Now'}</span>
                    <span class="date">Pickup</span>
                </div>
                
                <div class="duration-block">
                    <div class="duration-text" style="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${timeStr}</div>
                    <div class="duration-line" style="border-top: 1.5px dashed var(--border-color);"></div>
                    <div class="flight-number" style="margin-top: 4px;">${distanceKm} km</div>
                </div>
                
                <div class="time-block" style="text-align: right;">
                    <span class="time">${route.arrival_time || 'Later'}</span>
                    <span class="date">Drop-off</span>
                </div>
            </div>
            
            <div class="ticket-footer" style="align-items: flex-end;">
                <div class="price-block">
                    <span class="price" style="font-size: 1.4rem;">${costStr}</span>
                    ${tollText}
                </div>
                <button class="book-btn" style="${route.label === 'recommended' ? 'background: #2563eb; color: white;' : 'background: #e2e8f0; color: #475569;'} font-weight: 600;">${route.label === 'recommended' ? 'Selected' : 'Select Ride'}</button>
            </div>
        </div>
    `;
}

// Removed Leaflet drawRoutesOnMap, drawTolls, highlightRouteOnMap - handled globally by map3d.js
// highlightRouteOnMap remains but only updates DOM since map flyTo is in map3d.js
function highlightRouteOnMap(activeIndex) {
    // Update active class on DOM
    const cards = document.querySelectorAll('.result-card .ticket-card');
    cards.forEach((card, i) => {
        if (i === activeIndex) {
            card.classList.add('highlight');
            card.querySelector('.book-btn').textContent = 'Selected';
        } else {
            card.classList.remove('highlight');
            card.querySelector('.book-btn').textContent = 'Select';
        }
    });
}

// ==========================================
// NEW: Travel Platform Rendering Functions
// ==========================================

function displayTravelPlatformData(data) {
    // 1. Render Budget Breakdown
    const budgetContainer = document.getElementById('budget-stats');
    const budgetTotal = document.getElementById('budget-total');
    if (data.budget_breakdown && Object.keys(data.budget_breakdown).length > 0) {
        budgetContainer.innerHTML = '';
        const b = data.budget_breakdown;

        budgetContainer.innerHTML += `<div>🚗 Transport: <strong>₹${b.Transport.toLocaleString('en-IN')}</strong></div>`;
        budgetContainer.innerHTML += `<div>🛏️ Stay: <strong>₹${b.Hotel.toLocaleString('en-IN')}</strong></div>`;
        budgetContainer.innerHTML += `<div>🍽️ Food: <strong>₹${b.Food.toLocaleString('en-IN')}</strong></div>`;
        budgetContainer.innerHTML += `<div>🎟️ Activities: <strong>₹${b.Activities.toLocaleString('en-IN')}</strong></div>`;

        budgetTotal.textContent = `₹${b.Total.toLocaleString('en-IN')}`;
    }

    // --- NEW: Inject Dashboard Data into Modal & Show Trigger Button ---
    if (data.dashboard) {
        const dash = data.dashboard;
        const dashBtnContainer = document.getElementById('budget-stats').parentElement;

        // Ensure we only add the button once
        if (!document.getElementById('open-dash-btn')) {
            const btnHtml = `
                <button id="open-dash-btn" onclick="document.getElementById('live-dashboard-modal').classList.remove('hidden')" 
                    class="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    <span>📊</span> Open Live Travel Dashboard
                </button>
             `;
            dashBtnContainer.insertAdjacentHTML('beforeend', btnHtml);
        }

        // Hydrate Modal Data safely
        const e1 = document.getElementById('dash-dest-name');
        if (e1) e1.textContent = dash.destination || 'Selected City';

        const e2 = document.getElementById('dash-weather-value');
        if (e2) e2.textContent = dash.weather || 'Unknown';

        const e3 = document.getElementById('dash-transport-value');
        if (e3) e3.textContent = dash.transport || 'Not booked';

        const e4 = document.getElementById('dash-hotel-value');
        if (e4) e4.textContent = dash.hotel || 'None';

        const listContainer = document.getElementById('dash-schedule-list');
        if (listContainer && dash.today_plan) {
            listContainer.innerHTML = dash.today_plan.map(item => `
               <li class="flex items-center gap-3 text-sm text-gray-300">
                   <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                   ${item}
               </li>
            `).join('');
        }
    }
    // -------------------------------------------------------------------

    // 2. Render Recommended Hotels
    const hotelContainer = document.getElementById('hotels-container');
    hotelContainer.innerHTML = '';
    if (data.recommended_hotels && data.recommended_hotels.length > 0) {
        data.recommended_hotels.forEach((hotel) => {
            hotelContainer.innerHTML += `
                <div class="ticket-card" style="margin-bottom: 10px; cursor: default;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="font-weight: 700; font-size: 1.05rem;">${hotel.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: capitalize;">${hotel.type.replace('_', ' ')}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; color: #2563eb;">₹${hotel.estimated_price}/night</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">(estimated)</div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        hotelContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; padding: 10px;">No hotels found for this budget/area.</p>';
    }

    // 3. Render Optimized Itinerary
    const itinContainer = document.getElementById('itinerary-container');
    itinContainer.innerHTML = '';
    if (data.optimized_itinerary && Object.keys(data.optimized_itinerary).length > 0) {
        Object.keys(data.optimized_itinerary).sort().forEach(day => {
            const dayPlan = data.optimized_itinerary[day];

            let htmlChunks = `<div style="margin-bottom: 15px;">
                <h5 style="margin: 0 0 8px 0; font-size: 0.95rem; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">📅 ${day}</h5>
                <div style="display: flex; flex-direction: column; gap: 8px;">`;

            dayPlan.forEach(step => {
                let icon = step.type === 'dining' || step.type === 'restaurant' ? '🍽️' : (step.type === 'hotel' ? '🏨' : '📍');
                let centerMapCall = '';
                if (step.poi && step.poi.lon && step.poi.lat) {
                    centerMapCall = `onclick="if(window.centerMapOn) window.centerMapOn(${step.poi.lon}, ${step.poi.lat})" style="cursor:pointer;"`;
                }

                htmlChunks += `
                    <div ${centerMapCall} class="timeline-step" style="display: flex; gap: 10px; align-items: center; font-size: 0.85rem; background: var(--surface-color); padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); transition: background-color 0.2s;">
                        <style>.timeline-step:hover{background-color:rgba(59,130,246,0.1)!important;border-color:#3b82f6!important;}</style>
                        <div style="font-weight: 600; width: 65px; color: var(--text-secondary);">${step.time}</div>
                        <div>${icon} ${step.activity}</div>
                    </div>
                `;
            });

            htmlChunks += `</div></div>`;
            itinContainer.innerHTML += htmlChunks;
        });
    } else {
        itinContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; padding: 10px;">Destination too broad or no sightseeing found to generate itinerary.</p>';
    }
}

// drawPOIsOnMap handled globally by map3d.js now
