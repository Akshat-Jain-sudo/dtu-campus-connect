import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserListings } from "@/hooks/useListings";
import { useWishlist } from "@/hooks/useWishlist";
import { useNotifications, useUnreadCount } from "@/hooks/useNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Package, Heart, Bell, Plus, Eye, Clock, 
  CheckCircle, XCircle, TrendingUp, MessageSquare 
} from "lucide-react";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { NotificationItem } from "@/components/dashboard/NotificationItem";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: listings, isLoading: listingsLoading } = useUserListings(profile?.user_id ?? "");
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  const unreadCount = useUnreadCount();

  const stats = {
    totalListings: listings?.length ?? 0,
    activeListings: listings?.filter(l => l.status === "approved").length ?? 0,
    pendingListings: listings?.filter(l => l.status === "pending").length ?? 0,
    totalViews: listings?.reduce((sum, l) => sum + (l.views_count ?? 0), 0) ?? 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your listings, wishlist, and messages all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Listings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Listings
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingListings}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link to="/sell">
              <Plus className="mr-2 h-4 w-4" />
              Post New Item
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/marketplace">
              <TrendingUp className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="listings" className="gap-2">
              <Package className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Your Listings</CardTitle>
                <CardDescription>
                  Manage all your posted items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {listingsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : listings && listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="relative">
                        <Badge 
                          className="absolute top-2 right-2 z-10"
                          variant={
                            listing.status === "approved" ? "default" :
                            listing.status === "pending" ? "secondary" :
                            "destructive"
                          }
                        >
                          {listing.status}
                        </Badge>
                        <ListingCard listing={listing} showActions />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start selling by posting your first item
                    </p>
                    <Button asChild>
                      <Link to="/sell">
                        <Plus className="mr-2 h-4 w-4" />
                        Post Your First Item
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>
                  Items you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      item.listing && <ListingCard key={item.id} listing={item.listing as any} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Save items you're interested in to view them later
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/marketplace">Browse Marketplace</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Stay updated with your activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
