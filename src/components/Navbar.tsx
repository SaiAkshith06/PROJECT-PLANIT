import { User, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex items-center justify-end h-16 px-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
