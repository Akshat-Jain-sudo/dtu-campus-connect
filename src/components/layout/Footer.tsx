import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Briefcase, 
  BookOpen, 
  Rocket, 
  Users,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Instagram
} from "lucide-react";

const categories = [
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Academics", href: "/academics", icon: BookOpen },
  { name: "Gigs & Internships", href: "/gigs", icon: Rocket },
  { name: "Community", href: "/community", icon: Users },
];

const resources = [
  { name: "Help Center", href: "/help" },
  { name: "Safety Guidelines", href: "/safety" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <span className="text-xl font-bold text-primary-foreground">D</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">DTU</span>
                <span className="text-lg font-bold text-primary"> Multimart</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The exclusive marketplace for DTU students. Buy, sell, learn, and grow together.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Delhi Technological University, Shahbad Daulatpur, Delhi - 110042</span>
              </li>
              <li>
                <a
                  href="mailto:support@dtumultimart.in"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  support@dtumultimart.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DTU Multimart. Made with ❤️ by DTU Students.
          </p>
          <p className="text-xs text-muted-foreground">
            Exclusively for @dtu.ac.in email holders
          </p>
        </div>
      </div>
    </footer>
  );
}
