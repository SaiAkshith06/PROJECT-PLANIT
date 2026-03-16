"""
Transport agent (placeholder).
Modular structure to support future bus/train/flight planning integrations.
"""

class TransportAgent:
    """
    Base abstraction for specialized transport mode agents (flight, train, bus).
    """
    def __init__(self, name):
        self.name = name

    def process(self, data):
        """
        To be implemented by specific transport sub-agents.
        """
        pass
