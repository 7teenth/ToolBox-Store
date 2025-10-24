'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type AttributeType = Database["public"]["Tables"]["attribute_type"]["Row"];
export type AttributeTypeCreate  = Database["public"]["Tables"]["attribute_type"]["Insert"];
export type AttributeTypeUpdate = Database["public"]["Tables"]["attribute_type"]["Update"];

export async function createAttributeType(
  record: AttributeTypeCreate
): Promise<AttributeType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_type")
    .insert([record])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attribute_type: ${error.message}`);
  }

  return data;
}

export async function getAttributeTypeById(
  id: string
): Promise<AttributeType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_type")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch attribute_type: ${error.message}`);
  }

  return data;
}

export async function updateAttributeType(
  id: string,
  updates: AttributeTypeUpdate
): Promise<AttributeType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_type")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update attribute_type: ${error.message}`);
  }

  return data;
}

export async function deleteAttributeType(
  id: string
): Promise<AttributeType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_type")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete attribute_type: ${error.message}`);
  }

  return data;
}
