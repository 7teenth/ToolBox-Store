'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type Brand = Database["public"]["Tables"]["brand"]["Row"];
export type BrandCreate = Database["public"]["Tables"]["brand"]["Insert"];
export type BrandUpdate = Database["public"]["Tables"]["brand"]["Update"];

export async function createBrand(
  brand: BrandCreate
): Promise<Brand> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brand")
    .insert([brand])
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create brand: ${error.message}`);
  }

  return data;
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brand")
    .select("*");

  if (error) {
    throw new Error(`Failed to fetch brands: ${error.message}`);
  }

  return data;
}

export async function getBrandById(
  id: string
): Promise<Brand> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brand")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch brand: ${error.message}`);
  }

  return data;
}

export async function updateBrand(
  id: string,
  updates: BrandUpdate
): Promise<Brand> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brand")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update brand: ${error.message}`);
  }

  return data;
}

export async function deleteBrand(
  id: string
): Promise<Brand> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brand")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to delete brand: ${error.message}`);
  }

  return data;
}
