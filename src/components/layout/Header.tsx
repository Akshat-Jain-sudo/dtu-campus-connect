import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Briefcase, 
  BookOpen, 
  Rocket, 
  Users,
  LogIn
} from "lucide-react";

const navItems = [
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Academics", href: "/academics", icon: BookOpen },
  { name: "Gigs", href: "/gigs", icon: Rocket },
  { name: "Community", href: "/community", icon: Users },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <span className="text-xl font-bold text-primary-foreground">D</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-foreground">DTU</span>
              <span className="text-lg font-bold text-primary"> Multimart</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2 px-4">
              <Button variant="outline" asChild>
                <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
