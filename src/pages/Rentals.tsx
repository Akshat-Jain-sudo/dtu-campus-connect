import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Search, MessageSquare, Calendar, Shield, Plus } from "lucide-react";
import type { Rental } from "@/types/database";

const Rentals = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rentals, isLoading } = useQuery({
    queryKey: ["rentals", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("rentals")
        .select("*")
        .eq("availability_status", "available");

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Rental[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Rental & Exchange</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rent items from fellow students or lend yours. Save money, reduce waste, build community.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rentals..."
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            List for Rent
          </Button>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">1. Browse & Find</h3>
            <p className="text-sm text-muted-foreground">
              Search for items you need to rent or borrow
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">2. Connect & Agree</h3>
            <p className="text-sm text-muted-foreground">
              Chat with the owner and agree on terms
            </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">3. Rent & Return</h3>
            <p className="text-sm text-muted-foreground">
              Pick up, use, and return on the agreed date
            </p>
          </Card>
        </div>

        {/* Rentals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : rentals && rentals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <Card key={rental.id} className="overflow-hidden hover-lift">
                <div className="aspect-video bg-muted relative">
                  {rental.images && rental.images.length > 0 ? (
                    <img
                      src={rental.images[0]}
                      alt={rental.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Clock className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    Available
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{rental.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {rental.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{rental.price_per_day}
                      </span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    {rental.deposit && (
                      <Badge variant="outline" className="gap-1">
                        <Shield className="h-3 w-3" />
                        ₹{rental.deposit} deposit
                      </Badge>
                    )}
                  </div>
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No rentals available</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to list an item for rent!
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              List Your Item
            </Button>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-muted/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Rent?</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Save Money</h3>
              <p className="text-sm text-muted-foreground">
                Pay only for what you use
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">Eco-Friendly</h3>
              <p className="text-sm text-muted-foreground">
                Reduce waste, share resources
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold mb-1">Build Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with fellow students
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold mb-1">Try Before Buy</h3>
              <p className="text-sm text-muted-foreground">
                Test items before purchasing
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rentals;
