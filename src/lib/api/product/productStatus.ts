'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type ProductStatus = Database["public"]["Tables"]["product_status"]["Row"];
export type ProductStatusCreate  = Database["public"]["Tables"]["product_status"]["Insert"];
export type ProductStatusUpdate = Database["public"]["Tables"]["product_status"]["Update"];

export async function createProductStatus(
  status: ProductStatusCreate
): Promise<ProductStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_status")
    .insert([status])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product_status: ${error.message}`);
  }

  return data;
}

export async function getProductStatusById(
  id: string
): Promise<ProductStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_status")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product_status: ${error.message}`);
  }

  return data;
}

export async function updateProductStatus(
  id: string,
  updates: ProductStatusUpdate
): Promise<ProductStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_status")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product_status: ${error.message}`);
  }

  return data;
}

export async function deleteProductStatus(
  id: string
): Promise<ProductStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_status")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete product_status: ${error.message}`);
  }

  return data;
}