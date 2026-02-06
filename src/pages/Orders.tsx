import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ClipboardList, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const Orders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast({ title: `Order ${status}` });
    } catch {
      toast({ title: "Failed to update order", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <Header />
      <main className="container py-8 relative z-10 pt-24">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Your Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="glass-card">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-20 h-20 rounded-lg bg-muted/30 overflow-hidden flex-shrink-0">
                    {order.listing?.images?.[0] ? (
                      <img src={order.listing.images[0]} alt={order.listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${order.listing_id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                      {order.listing?.title ?? "Unknown Item"}
                    </Link>
                    <p className="text-xl font-bold text-primary mt-1">
                      ₹{order.total_price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[order.status] ?? ""}>{order.status}</Badge>
                    {order.seller_id === user?.id && order.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, "confirmed")}>Confirm</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order.id, "cancelled")}>Cancel</Button>
                      </div>
                    )}
                    {order.seller_id === user?.id && order.status === "confirmed" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, "completed")}>Complete</Button>
                    )}
                    {order.buyer_id === user?.id && order.status === "pending" && (
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order.id, "cancelled")}>Cancel</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Your order history will appear here</p>
            <Button asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
