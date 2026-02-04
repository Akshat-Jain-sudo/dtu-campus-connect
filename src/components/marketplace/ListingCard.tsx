import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MapPin, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToggleWishlist, useIsInWishlist } from "@/hooks/useWishlist";
import { useDeleteListing } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/database";

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
}

export function ListingCard({ listing, showActions = false }: ListingCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isInWishlist = useIsInWishlist(listing.id);
  const toggleWishlist = useToggleWishlist();
  const deleteListing = useDeleteListing();

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please sign in to save items" });
      return;
    }
    try {
      await toggleWishlist.mutateAsync(listing.id);
    } catch {
      toast({ title: "Failed to update wishlist", variant: "destructive" });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing.mutateAsync(listing.id);
        toast({ title: "Listing deleted" });
      } catch {
        toast({ title: "Failed to delete listing", variant: "destructive" });
      }
    }
  };

  const conditionLabels: Record<string, string> = {
    new: "New",
    like_new: "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };

  return (
    <Link to={`/product/${listing.id}`}>
      <Card className="overflow-hidden hover-lift group h-full">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-4xl opacity-50">📦</span>
            </div>
          )}
          
          {/* Wishlist Button */}
          {!showActions && (
            <button
              onClick={handleWishlistClick}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background",
                isInWishlist && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
            </button>
          )}

          {/* Edit/Delete for owner */}
          {showActions && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium line-clamp-2 flex-1">{listing.title}</h3>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary">
              ₹{listing.price.toLocaleString()}
            </span>
            {listing.is_negotiable && (
              <Badge variant="outline" className="text-xs">Negotiable</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {listing.condition && (
              <Badge variant="secondary" className="text-xs">
                {conditionLabels[listing.condition] || listing.condition}
              </Badge>
            )}
            {listing.category && (
              <Badge variant="outline" className="text-xs">
                {(listing.category as any).name}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {listing.views_count}
              </span>
              {listing.hostel && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {listing.hostel.split(" ").slice(0, 2).join(" ")}
                </span>
              )}
            </div>
            <span>
              {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
