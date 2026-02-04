import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, Category } from "@/types/database";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useListings(filters?: {
  category?: string;
  search?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  hostel?: string;
  sortBy?: string;
}) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("status", "approved");

      if (filters?.category) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.category)
          .maybeSingle();
        if (cat) {
          query = query.eq("category_id", cat.id);
        }
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.condition) {
        query = query.eq("condition", filters.condition);
      }

      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters?.hostel) {
        query = query.eq("hostel", filters.hostel);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "popular":
          query = query.order("views_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Listing[];
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Listing | null;
    },
    enabled: !!id,
  });
}

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: ["user-listings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Listing[];
    },
    enabled: !!userId,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: Omit<Listing, "id" | "created_at" | "updated_at" | "views_count" | "status">) => {
      const { data, error } = await supabase
        .from("listings")
        .insert({
          ...listing,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Listing> & { id: string }) => {
      const { data, error } = await supabase
        .from("listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
    },
  });
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: ["featured-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("status", "approved")
        .order("views_count", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Listing[];
    },
  });
}
