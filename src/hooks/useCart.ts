import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id: string;
  user_id: string;
  listing_id: string;
  quantity: number;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    user_id: string;
    status: string;
  };
}

export function useCart() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch listing details for each cart item
      const listingIds = data.map(item => item.listing_id);
      const { data: listings } = await supabase
        .from("listings")
        .select("id, title, price, images, user_id, status")
        .in("id", listingIds);

      return data.map(item => ({
        ...item,
        listing: listings?.find(l => l.id === item.listing_id) ?? undefined,
      })) as CartItem[];
    },
    enabled: !!user,
  });
}

export function useAddToCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Not authenticated");
      // Check if already in cart
      const { data: existing } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .maybeSingle();
      if (existing) throw new Error("Already in cart");

      const { error } = await supabase.from("cart").insert({
        user_id: user.id,
        listing_id: listingId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase.from("cart").delete().eq("id", cartItemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCartCount() {
  const { data: cart } = useCart();
  return cart?.length ?? 0;
}
