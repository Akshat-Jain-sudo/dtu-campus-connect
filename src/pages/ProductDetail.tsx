import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useListing } from "@/hooks/useListings";
import { useToggleWishlist, useIsInWishlist } from "@/hooks/useWishlist";
import { useStartConversation } from "@/hooks/useMessages";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, MessageSquare, Share2, Flag, MapPin, 
  Calendar, Eye, ArrowLeft, Tag, Check 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: listing, isLoading } = useListing(id ?? "");
  const isInWishlist = useIsInWishlist(id ?? "");
  const toggleWishlist = useToggleWishlist();
  const startConversation = useStartConversation();

  const handleWishlist = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    try {
      await toggleWishlist.mutateAsync(id ?? "");
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const handleContact = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!listing) return;

    try {
      const conversationId = await startConversation.mutateAsync({
        sellerId: listing.user_id,
        listingId: listing.id,
      });
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
            <p className="text-muted-foreground mb-6">
              This listing may have been removed or doesn't exist.
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const conditionLabels: Record<string, string> = {
    new: "New",
    like_new: "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((image, i) => (
                  <button
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-primary transition-colors"
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              {listing.category && (
                <Badge variant="secondary">{listing.category.name}</Badge>
              )}
              {listing.condition && (
                <Badge variant="outline">
                  {conditionLabels[listing.condition] || listing.condition}
                </Badge>
              )}
              {listing.is_negotiable && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Negotiable
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold">{listing.title}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                ₹{listing.price.toLocaleString()}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.views_count} views
              </span>
              {listing.hostel && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.hostel}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleContact}
                disabled={listing.user_id === user?.id}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlist}
                className={cn(isInWishlist && "text-red-500 border-red-500")}
              >
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-current")} />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {listing.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Seller Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">DTU Student</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Report Button */}
            <Button variant="ghost" className="text-muted-foreground">
              <Flag className="mr-2 h-4 w-4" />
              Report this listing
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
