import { useState } from "react";
import { Heart, MapPin, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CommunityItinerary, CustomItinerary } from "@/data/communityItineraries";

interface UserItinerariesSectionProps {
  communityItineraries: CommunityItinerary[];
  myItineraries: CustomItinerary[];
  onCreateNew: () => void;
  onDeleteMine: (id: string) => void;
}

const ItineraryCard = ({
  name,
  author,
  avatar,
  stops,
  likes,
  isOwn,
  onDelete,
}: {
  name: string;
  author: string;
  avatar: string;
  stops: { name: string }[];
  likes?: number;
  isOwn?: boolean;
  onDelete?: () => void;
}) => (
  <div className="bg-card rounded-xl border border-border shadow-card p-4 hover:shadow-card-hover transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          {avatar}
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground text-sm leading-tight">{name}</h4>
          <p className="text-[11px] text-muted-foreground">{isOwn ? "By you" : `By ${author}`}</p>
        </div>
      </div>
      {likes !== undefined && (
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Heart className="w-3.5 h-3.5" />
          {likes}
        </div>
      )}
    </div>
    <div className="flex items-center gap-1 flex-wrap mb-3">
      {stops.map((s, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="text-[10px] bg-muted/30 text-muted-foreground rounded px-1.5 py-0.5">
            📍 {s.name}
          </span>
          {i < stops.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/50" />}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-2">
      {isOwn && onDelete && (
        <Button size="sm" variant="destructive" className="text-xs w-full" onClick={onDelete}>
          Delete Itinerary
        </Button>
      )}
      {!isOwn && (
         <Button size="sm" variant="outline" className="text-xs w-full cursor-default">
           Community Plan
         </Button>
      )}
    </div>
  </div>
);

const UserItinerariesSection = ({
  communityItineraries,
  myItineraries,
  onCreateNew,
  onDeleteMine,
}: UserItinerariesSectionProps) => {
  const [tab, setTab] = useState<"community" | "mine">("community");

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          User Itineraries
        </h2>
        <Button size="sm" onClick={onCreateNew} className="gap-1.5 text-xs">
          <MapPin className="w-3 h-3" /> Create Your Own
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("community")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "community"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          Community ({communityItineraries.length})
        </button>
        <button
          onClick={() => setTab("mine")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "mine"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
          }`}
        >
          My Itineraries ({myItineraries.length})
        </button>
      </div>

      {tab === "community" && (
        <div className="space-y-3">
          {communityItineraries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No community itineraries for this destination yet.</p>
          ) : (
            communityItineraries.map((it) => (
              <ItineraryCard
                key={it.id}
                name={it.name}
                author={it.author}
                avatar={it.avatar}
                stops={it.stops}
                likes={it.likes}
              />
            ))
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-3">
          {myItineraries.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">You haven't created any itineraries yet.</p>
              <Button size="sm" onClick={onCreateNew} className="gap-1.5">
                <MapPin className="w-3 h-3" /> Create Your First
              </Button>
            </div>
          ) : (
            myItineraries.map((it) => (
              <ItineraryCard
                key={it.id}
                name={it.name}
                author="You"
                avatar="ME"
                stops={it.stops}
                isOwn
                onDelete={() => onDeleteMine(it.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserItinerariesSection;
