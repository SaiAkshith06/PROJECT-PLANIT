import re

class ChatService:
    def __init__(self):
        # Basic keyword-based intent routing map
        self.intent_keywords = {
            "trip": ["trip", "plan", "visit", "vacation", "tour", "holiday"],
            "restaurant": ["restaurant", "food", "eat", "cafe", "dining", "lunch", "dinner", "breakfast"],
            "hotel": ["hotel", "stay", "room", "accommodation", "hostel", "resort", "guest house"],
            "attractions": ["attraction", "sightseeing", "monument", "park", "see", "explore", "place"],
            "transport": ["cheap", "transport", "flight", "bus", "train", "cab", "car", "get there", "travel options"],
            "destination": ["destination", "suggest", "recommend", "where to go", "places to visit", "where should", "travel under", "where to travel"],
            "dashboard": ["dashboard", "overview", "status", "today's plan", "itinerary overview"]
        }

    def determine_intent(self, message: str) -> str:
        """
        Analyzes the user's message and returns the primary intent.
        Fallback is 'general' if no specific keywords match.
        """
        msg_lower = message.lower()
        
        # Check against mapped keywords
        for intent, keywords in self.intent_keywords.items():
            if any(keyword in msg_lower for keyword in keywords):
                return intent
                
        return "general"

    def extract_location(self, message: str) -> str:
        """
        Naive location extraction. Looks for words after 'in', 'at', 'near', 'to'.
        Example: 'Find restaurants in Hyderabad' -> 'Hyderabad'
        """
        msg_lower = message.lower()
        match = re.search(r'\b(?:in|at|near|to|around)\s+([a-zA-Z\s]+)', msg_lower)
        if match:
            # Clean up the extracted string a bit, take first 2 words max but drop prepositions
            words = match.group(1).strip().split()
            if not words: return ""
            location = words[0]
            if len(words) > 1 and words[1].lower() not in ["for", "with", "under", "on", "and", "the"]:
                 location += " " + words[1]
            return location.title()
        return ""
