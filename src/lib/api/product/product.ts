'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type Product = Database["public"]["Tables"]["product"]["Row"];
export type ProductCreate  = Database["public"]["Tables"]["product"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["product"]["Update"];

export async function createProduct(
  product: ProductCreate
): Promise<Product> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .insert([product])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
}

export async function getProductById(
  id: string
): Promise<Product> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data;
}

export async function updateProduct(
  id: string,
  updates: ProductUpdate
): Promise<Product> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data;
}

export async function deleteProduct(
  id: string
): Promise<Product> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return data;
}
