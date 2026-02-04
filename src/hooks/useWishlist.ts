import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { WishlistItem } from "@/types/database";

export function useWishlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          listing:listings(
            *,
            category:categories(*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });
}

export function useIsInWishlist(listingId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some((item) => item.listing_id === listingId) ?? false;
}

export function useAddToWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, listing_id: listingId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useToggleWishlist() {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const isInWishlist = wishlist?.some((item) => item.listing_id === listingId);
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(listingId);
      } else {
        await addToWishlist.mutateAsync(listingId);
      }
    },
  });
}
