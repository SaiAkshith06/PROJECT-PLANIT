import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Destination = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const displayName = name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : "Unknown";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {displayName}
        </h1>
        <p className="text-muted-foreground mb-8">
          Destination page coming soon. This is where you'll explore
          hotels, attractions, and build your itinerary for {displayName}.
        </p>
        <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Destination;
