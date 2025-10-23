import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type ProductBadge = Database["public"]["Tables"]["product_badge"]["Row"];
export type ProductBadgeCreate  = Database["public"]["Tables"]["product_badge"]["Insert"];
export type ProductBadgeUpdate = Database["public"]["Tables"]["product_badge"]["Update"];

export async function createProductBadge(
  badge: ProductBadgeCreate
): Promise<ProductBadge> {
  const { data, error } = await supabase
    .from("product_badge")
    .insert([badge])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product_badge: ${error.message}`);
  }

  return data;
}

export async function getProductBadgeById(
  id: string
): Promise<ProductBadge> {
  const { data, error } = await supabase
    .from("product_badge")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product_badge: ${error.message}`);
  }

  return data;
}

export async function updateProductBadge(
  id: string,
  updates: ProductBadgeUpdate
): Promise<ProductBadge> {
  const { data, error } = await supabase
    .from("product_badge")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product_badge: ${error.message}`);
  }

  return data;
}

export async function deleteProductBadge(
  id: string
): Promise<ProductBadge> {
  const { data, error } = await supabase
    .from("product_badge")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete product_badge: ${error.message}`);
  }

  return data;
}
