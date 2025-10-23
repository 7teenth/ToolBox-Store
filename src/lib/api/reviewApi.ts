import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type Review = Database["public"]["Tables"]["review"]["Row"];
export type ReviewCreate  = Database["public"]["Tables"]["review"]["Insert"];
export type ReviewUpdate = Database["public"]["Tables"]["review"]["Update"];

export async function createReview(review: ReviewCreate): Promise<Review> {
  const {
    data,
    error,
  } = await supabase
    .from("review")
    .insert([review])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return data;
}

export async function getReviewById(id: string): Promise<Review> {
  const {
    data,
    error,
  } = await supabase
    .from("review")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return data;
}

export async function updateReview(id: string, updates: ReviewUpdate): Promise<Review> {
  const {
    data,
    error,
  } = await supabase
    .from("review")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }

  return data;
}

export async function deleteReview(id: string): Promise<Review> {
  const {
    data,
    error,
  } = await supabase
    .from("review")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }

  return data;
}
