import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  MapPin, 
  Plus,
  Laptop,
  Book,
  Bike,
  Home,
  Smartphone,
  MoreHorizontal
} from "lucide-react";

const categories = [
  { name: "All", icon: MoreHorizontal, value: "all" },
  { name: "Electronics", icon: Laptop, value: "electronics" },
  { name: "Books", icon: Book, value: "books" },
  { name: "Cycles", icon: Bike, value: "cycles" },
  { name: "Hostel", icon: Home, value: "hostel" },
  { name: "Phones", icon: Smartphone, value: "phones" },
];

const listings = [
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
    posted: "2 hours ago",
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
    posted: "5 hours ago",
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
    posted: "1 day ago",
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
    posted: "2 days ago",
  },
  {
    id: 5,
    title: "Study Table with Chair",
    price: "₹2,500",
    originalPrice: "₹5,000",
    condition: "Good",
    location: "BH-3",
    category: "Hostel",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
    seller: "Vikram S.",
    verified: true,
    posted: "3 days ago",
  },
  {
    id: 6,
    title: "iPhone 12 Mini",
    price: "₹28,000",
    originalPrice: "₹50,000",
    condition: "Good",
    location: "GH-2",
    category: "Phones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    seller: "Ananya P.",
    verified: true,
    posted: "4 days ago",
  },
  {
    id: 7,
    title: "DSA Book by Narasimha Karumanchi",
    price: "₹350",
    originalPrice: "₹700",
    condition: "Good",
    location: "BH-1",
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop",
    seller: "Rohan M.",
    verified: true,
    posted: "5 days ago",
  },
  {
    id: 8,
    title: "Dell Monitor 24 inch",
    price: "₹8,000",
    originalPrice: "₹15,000",
    condition: "Like New",
    location: "BH-4",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    seller: "Karan J.",
    verified: true,
    posted: "1 week ago",
  },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-orb bg-orb-primary opacity-20" />
        <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-orb bg-orb-secondary opacity-15" />
        
        <div className="container relative z-10">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Marketplace</h1>
              <p className="text-muted-foreground">Browse items from DTU students</p>
            </div>
            <Button className="shadow-glow-sm hover:shadow-glow transition-shadow" asChild>
              <Link to="/sell">
                <Plus className="h-4 w-4 mr-2" />
                Sell Something
              </Link>
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-border/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 glass border-border/40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/40">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="border-border/40 hover:bg-accent/50 hover:border-primary/50">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-glow-sm"
                    : "glass border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredListings.length} items
          </p>

          {/* Listings Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group glass-card p-0 overflow-hidden hover-lift"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button 
                    className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist
                    }}
                  >
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </button>
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground shadow-glow-sm">
                    {item.condition}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="uppercase tracking-wider">{item.category}</span>
                    <span>{item.posted}</span>
                  </div>
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
                        <span className="text-primary">✓</span>
                      )}
                      {item.seller}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" className="border-border/40 hover:bg-accent/50 hover:border-primary/50" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
