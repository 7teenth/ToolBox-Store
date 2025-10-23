import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type Category = Database["public"]["Tables"]["category"]["Row"];
export type CategoryCreate  = Database["public"]["Tables"]["category"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["category"]["Update"];

export async function createCategory(
  category: CategoryCreate
): Promise<Category> {
  const { data, error } = await supabase
    .from("category")
    .insert([category])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data;
}

export async function getCategoryById(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

export async function updateCategory(
  id: string,
  updates: CategoryUpdate
): Promise<Category> {
  const { data, error } = await supabase
    .from("category")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }

  return data;
}

export async function deleteCategory(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from("category")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }

  return data;
}
