import { MapPin, User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground tracking-tight">
            PLAN<span className="text-primary">IT</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <UserPlus className="w-4 h-4" />
            Register
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
