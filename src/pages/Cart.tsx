import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart, useRemoveFromCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ShoppingBag, Package } from "lucide-react";

const Cart = () => {
  const { user } = useAuth();
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const navigate = useNavigate();

  const total = cart?.reduce((sum, item) => sum + (item.listing?.price ?? 0) * item.quantity, 0) ?? 0;

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCart.mutateAsync(cartItemId);
      toast({ title: "Removed from cart" });
    } catch {
      toast({ title: "Failed to remove", variant: "destructive" });
    }
  };

  const handlePlaceOrder = async (item: typeof cart extends (infer T)[] | undefined ? T : never) => {
    if (!item.listing) return;
    try {
      await createOrder.mutateAsync({
        listingId: item.listing_id,
        sellerId: item.listing.user_id,
        totalPrice: item.listing.price * item.quantity,
      });
      await removeFromCart.mutateAsync(item.id);
      toast({ title: "Order placed successfully!" });
      navigate("/orders");
    } catch {
      toast({ title: "Failed to place order", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-mesh-gradient pointer-events-none" />
      <Header />
      <main className="container py-8 relative z-10 pt-24">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Your Cart
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : cart && cart.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="glass-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg bg-muted/30 overflow-hidden flex-shrink-0">
                      {item.listing?.images?.[0] ? (
                        <img src={item.listing.images[0]} alt={item.listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.listing_id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {item.listing?.title ?? "Unknown Item"}
                      </Link>
                      <p className="text-xl font-bold text-primary mt-1">
                        ₹{(item.listing?.price ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handlePlaceOrder(item)}>
                        Order Now
                      </Button>
                      <Button size="icon" variant="destructive" className="h-9 w-9" onClick={() => handleRemove(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card h-fit">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Total ({cart.length} items)</span>
                  <span className="font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Browse the marketplace to find items</p>
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

export default Cart;
