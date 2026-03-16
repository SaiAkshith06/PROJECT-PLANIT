from agents.route_agent import BaseAgent
from agents.bus_agent import BusAgent
from agents.train_agent import TrainAgent
from agents.flight_agent import FlightAgent

class TransportAggregator(BaseAgent):
    def __init__(self, name="TransportAggregator"):
        super().__init__(name)
        self.bus_agent = BusAgent()
        self.train_agent = TrainAgent()
        self.flight_agent = FlightAgent()

    def process(self, data):
        print(f"[{self.name}] Calling multimodal transport agents...")
        
        user_input = data.get("user_input", {})
        
        from agents.price_estimator import calculate_distance
        base_distance_km = 300
        if data.get("routes") and len(data["routes"]) > 0:
            base_distance_km = calculate_distance(data["routes"][0])
            
        user_input["distance_km"] = base_distance_km
        
        bus_options = self.bus_agent.process(user_input)
        train_options = self.train_agent.process(user_input)
        flight_options = self.flight_agent.process(user_input)
        
        # Combine results
        all_transport = []
        all_transport.extend(bus_options)
        all_transport.extend(train_options)
        all_transport.extend(flight_options)
        
        return all_transport
