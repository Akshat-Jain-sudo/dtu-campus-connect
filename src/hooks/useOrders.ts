import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const listingIds = data.map(o => o.listing_id);
      const { data: listings } = await supabase
        .from("listings")
        .select("id, title, price, images")
        .in("id", listingIds);

      return data.map(o => ({
        ...o,
        listing: listings?.find(l => l.id === o.listing_id) ?? undefined,
      })) as Order[];
    },
    enabled: !!user,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, listing:listings(id, title, price, images)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, sellerId, totalPrice }: { listingId: string; sellerId: string; totalPrice: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("orders").insert({
        buyer_id: user.id,
        seller_id: sellerId,
        listing_id: listingId,
        total_price: totalPrice,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
    },
  });
}
