import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { 
  useIsAdmin, useAdminStats, usePendingListings, 
  useApproveListing, useRejectListing, useReports, 
  useUpdateReport, useAnnouncements, useCreateAnnouncement, useAllUsers 
} from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, Users, Package, Flag, Megaphone, 
  CheckCircle, XCircle, Eye, Loader2, TrendingUp, AlertTriangle 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Admin = () => {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: stats } = useAdminStats();
  const { data: pendingListings, isLoading: loadingListings } = usePendingListings();
  const { data: reports, isLoading: loadingReports } = useReports();
  const { data: announcements } = useAnnouncements();
  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const approveListing = useApproveListing();
  const rejectListing = useRejectListing();
  const createAnnouncement = useCreateAnnouncement();
  const { toast } = useToast();

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleApprove = async (id: string) => {
    try {
      await approveListing.mutateAsync(id);
      toast({ title: "Listing approved!" });
    } catch {
      toast({ title: "Failed to approve", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectListing.mutateAsync(id);
      toast({ title: "Listing rejected" });
    } catch {
      toast({ title: "Failed to reject", variant: "destructive" });
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    try {
      await createAnnouncement.mutateAsync(newAnnouncement);
      toast({ title: "Announcement created!" });
      setNewAnnouncement({ title: "", content: "" });
    } catch {
      toast({ title: "Failed to create announcement", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, listings, and platform settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Listings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalListings ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-yellow-200 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Listings
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingListings ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Reports
              </CardTitle>
              <Flag className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.pendingReports ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="listings" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Listings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Announce</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Pending Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Pending Listings</CardTitle>
                <CardDescription>
                  Review and approve or reject submitted listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingListings ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : pendingListings && pendingListings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹{listing.price} • {listing.condition || "No condition"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(listing.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(listing.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">No pending listings to review</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="space-y-2">
                    {users.slice(0, 20).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {(user.full_name || user.email)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {user.full_name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.seller_verified && (
                            <Badge variant="secondary">Verified Seller</Badge>
                          )}
                          <Badge variant="outline">{user.branch || "No branch"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No users yet</h3>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Handle user reports and moderation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingReports ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 rounded-lg border"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{report.reason}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {report.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge
                            variant={
                              report.status === "pending" ? "secondary" :
                              report.status === "resolved" ? "default" :
                              "outline"
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No reports</h3>
                    <p className="text-muted-foreground">Everything looks good!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Announcement</CardTitle>
                  <CardDescription>
                    Broadcast messages to all users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      placeholder="Announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Announcement content..."
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleCreateAnnouncement}
                    disabled={!newAnnouncement.title || !newAnnouncement.content}
                  >
                    <Megaphone className="mr-2 h-4 w-4" />
                    Publish Announcement
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements && announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 rounded-lg bg-muted/50">
                          <h4 className="font-medium">{ann.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ann.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(ann.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No active announcements
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Overview of platform activity and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stats?.totalUsers ?? 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stats?.totalListings ?? 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Listings</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary mb-2">0</div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary mb-2">₹0</div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
                <p className="text-center text-muted-foreground mt-8">
                  More detailed analytics coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
