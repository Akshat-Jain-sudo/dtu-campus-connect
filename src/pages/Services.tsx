import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, Code, FileText, Briefcase, Search, 
  Clock, DollarSign, Star, MessageSquare 
} from "lucide-react";
import type { Service } from "@/types/database";

const SERVICE_CATEGORIES = [
  { value: "all", label: "All Services", icon: Star },
  { value: "tutoring", label: "Tutoring", icon: GraduationCap },
  { value: "freelance", label: "Freelance", icon: Code },
  { value: "assignment_help", label: "Assignment Help", icon: FileText },
  { value: "internship_referral", label: "Internships", icon: Briefcase },
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", activeCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("services")
        .select("*")
        .eq("status", "active");

      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Service[];
    },
  });

  const getPriceLabel = (service: Service) => {
    switch (service.price_type) {
      case "free":
        return "Free";
      case "hourly":
        return `₹${service.price}/hr`;
      case "fixed":
        return `₹${service.price}`;
      case "negotiable":
        return "Negotiable";
      default:
        return "Contact for price";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = SERVICE_CATEGORIES.find((c) => c.value === category);
    return cat?.icon || Star;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DTU Services Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find tutoring, freelance help, assignment assistance, and internship referrals from fellow DTU students
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-5 h-auto p-1">
            {SERVICE_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <cat.icon className="h-5 w-5" />
                <span className="text-xs hidden sm:block">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const CategoryIcon = getCategoryIcon(service.category);
              return (
                <Card key={service.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="gap-1">
                        <CategoryIcon className="h-3 w-3" />
                        {SERVICE_CATEGORIES.find((c) => c.value === service.category)?.label}
                      </Badge>
                      <span className="font-bold text-primary">
                        {getPriceLabel(service)}
                      </span>
                    </div>
                    <CardTitle className="mt-2 line-clamp-2">{service.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Available</span>
                      </div>
                      <Button size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first to offer a service!"}
            </p>
            <Button>Offer a Service</Button>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="text-center p-6">
            <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Expert Tutoring</h3>
            <p className="text-sm text-muted-foreground">
              Get help from seniors who've aced your courses
            </p>
          </Card>
          <Card className="text-center p-6">
            <Code className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Freelance Skills</h3>
            <p className="text-sm text-muted-foreground">
              Web development, design, and more from talented peers
            </p>
          </Card>
          <Card className="text-center p-6">
            <Briefcase className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold mb-2">Internship Referrals</h3>
            <p className="text-sm text-muted-foreground">
              Get referred by alumni working at top companies
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
