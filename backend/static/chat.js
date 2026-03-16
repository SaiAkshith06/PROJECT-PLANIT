document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('chat-header');
    const widget = document.getElementById('chat-widget');
    const toggleBtn = document.getElementById('chat-toggle');

    header.addEventListener('click', () => {
        widget.classList.toggle('collapsed');
        toggleBtn.textContent = widget.classList.contains('collapsed') ? '▲' : '▼';
    });
});

function handleChatEnter(event) {
    if (event.key === "Enter") {
        sendChatMessage();
    }
}

function appendMessage(sender, text) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.innerText = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendChatMessage() {
    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('chat-send-btn');
    const message = inputField.value.trim();

    if (!message) return;

    // UI Updates
    appendMessage('user', message);
    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    // Grab current context (like destination from main form)
    const context = {
        destination: document.getElementById('destination')?.value || ''
    };

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context })
        });

        const result = await response.json();

        if (response.ok) {
            appendMessage('ai', result.response);
            handleChatbotData(result.data);
        } else {
            appendMessage('ai', 'Oops, something went wrong. ' + (result.response || ''));
        }
    } catch (err) {
        console.error("Chat Error:", err);
        appendMessage('ai', 'Network error. Please try again later.');
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
    }
}

// Logic to integrate chatbot structured data back into the main map / UI
function handleChatbotData(data) {
    if (!data) return;

    // If it triggers a smart trip fill
    if (data.action === "trigger_smart_trip" && data.params) {
        if (data.params.destination) document.getElementById('destination').value = data.params.destination;
        if (data.params.budget) document.getElementById('budget').value = data.params.budget;
        if (data.params.duration) document.getElementById('duration').value = data.params.duration;

        // Auto-click the generate button to start the full pipeline
        document.getElementById('submit-btn').click();
    }

    // New AI Destination Recommender UI Hook
    if (data.action === "fill_destination" && data.params) {
        const dest = data.params.destination;
        const chatBody = document.getElementById('chat-body');

        const btnDiv = document.createElement('div');
        btnDiv.className = 'chat-message ai';
        btnDiv.style.background = 'transparent';
        btnDiv.style.border = 'none';
        btnDiv.style.padding = '0';
        btnDiv.style.marginTop = '-5px';

        btnDiv.innerHTML = `
            <button onclick="document.getElementById('destination').value='${dest}'; document.getElementById('destination').focus();" 
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-1.5 px-4 rounded-full text-sm shadow-md transition-colors">
                ✨ Set Destination to ${dest}
            </button>
        `;
        chatBody.appendChild(btnDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // If it returns points of interest or hotels to draw on map
    if (typeof drawPOIsOnMap === 'function') {
        // Mock a master data payload for the existing draw plugin
        const mockPayload = {};
        let centerCoords = data.location;

        if (data.recommended_hotels) mockPayload.recommended_hotels = data.recommended_hotels;
        if (data.restaurants) mockPayload.restaurants = data.restaurants;
        if (data.attractions) mockPayload.attractions = data.attractions;

        if (Object.keys(mockPayload).length > 0) {
            // clear old markers first
            if (window.locationMarkers) {
                window.locationMarkers.forEach(m => window.map.removeLayer(m));
                window.locationMarkers = [];
            }
            drawPOIsOnMap(mockPayload);

            // Pan Map safely
            if (centerCoords && centerCoords.lat && centerCoords.lon && window.map) {
                window.map.setView([centerCoords.lat, centerCoords.lon], 13);
            }
        }
    }
}
