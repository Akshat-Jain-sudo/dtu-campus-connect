import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, ArrowRight } from "lucide-react";

const featuredItems = [
  {
    id: 1,
    title: "MacBook Air M1 2020",
    price: "₹55,000",
    originalPrice: "₹92,000",
    condition: "Like New",
    location: "BH-4",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    seller: "Rahul K.",
    verified: true,
  },
  {
    id: 2,
    title: "Engineering Mathematics Set",
    price: "₹800",
    originalPrice: "₹2,400",
    condition: "Good",
    location: "GH-1",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    seller: "Priya S.",
    verified: true,
  },
  {
    id: 3,
    title: "Firefox Bicycle",
    price: "₹4,500",
    originalPrice: "₹12,000",
    condition: "Good",
    location: "BH-2",
    category: "Cycles",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
    seller: "Amit D.",
    verified: true,
  },
  {
    id: 4,
    title: "Casio FX-991ES Calculator",
    price: "₹600",
    originalPrice: "₹1,500",
    condition: "Excellent",
    location: "BR Hostel",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=300&fit=crop",
    seller: "Neha R.",
    verified: true,
  },
];

export function FeaturedListings() {
  return (
    <section className="py-20">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured Listings
            </h2>
            <p className="text-muted-foreground">
              Hot deals from your fellow DTUites
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/marketplace">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              to={`/marketplace/${item.id}`}
              className="group category-card p-0 overflow-hidden hover-lift"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {item.condition}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-primary">{item.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-1">
                      {item.verified && (
                        <span className="text-accent-foreground">✓</span>
                      )}
                    {item.seller}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
