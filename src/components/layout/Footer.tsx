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
  { name: "Academics", href: "/resources", icon: BookOpen },
  { name: "Gigs & Internships", href: "/services", icon: Rocket },
  { name: "Community", href: "/marketplace", icon: Users },
];

const resources = [
  { name: "Help Center", href: "/help" },
  { name: "Safety Guidelines", href: "/safety" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-background/50 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
      
      <div className="container py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow-sm group-hover:shadow-glow transition-shadow">
                <span className="text-xl font-bold text-primary-foreground">D</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">DTU</span>
                <span className="text-lg font-bold text-gradient"> Multimart</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The exclusive marketplace for DTU students. Buy, sell, learn, and grow together.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <item.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Resources</h3>
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
            <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wider text-sm">Contact</h3>
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
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DTU Multimart. Made with ❤️ by DTU Students.
          </p>
          <p className="text-xs text-muted-foreground glass px-4 py-2 rounded-full">
            Exclusively for @dtu.ac.in email holders
          </p>
        </div>
      </div>
    </footer>
  );
}
