import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Briefcase, 
  BookOpen, 
  Rocket, 
  Users,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    name: "Marketplace",
    description: "Buy & sell electronics, books, cycles, and hostel essentials",
    icon: ShoppingBag,
    href: "/marketplace",
    gradient: "from-red-500 to-orange-500",
    count: "2,400+ items",
  },
  {
    name: "Services",
    description: "Find tutors, designers, developers, and more",
    icon: Briefcase,
    href: "/services",
    gradient: "from-blue-500 to-cyan-500",
    count: "500+ services",
  },
  {
    name: "Academics",
    description: "Share notes, PYQs, lab manuals, and projects",
    icon: BookOpen,
    href: "/resources",
    gradient: "from-green-500 to-emerald-500",
    count: "8,000+ resources",
  },
  {
    name: "Gigs & Internships",
    description: "Post and find internships, freelance work, and hackathons",
    icon: Rocket,
    href: "/services",
    gradient: "from-purple-500 to-pink-500",
    count: "300+ opportunities",
  },
  {
    name: "Community",
    description: "Connect, discuss, and share with fellow DTUites",
    icon: Users,
    href: "/marketplace",
    gradient: "from-amber-500 to-yellow-500",
    count: "Active discussions",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-orb bg-orb-primary opacity-30" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need,
            <span className="text-gradient"> All in One Place</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From textbooks to internships, we've got you covered for your entire DTU journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group category-card hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <category.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {category.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  {category.count}
                </span>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
