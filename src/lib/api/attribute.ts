import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type Attribute = Database["public"]["Tables"]["attribute"]["Row"];
export type AttributeCreate  = Database["public"]["Tables"]["attribute"]["Insert"];
export type AttributeUpdate = Database["public"]["Tables"]["attribute"]["Update"];

export async function createAttribute(
  attribute: AttributeCreate
): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attribute")
    .insert([attribute])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attribute: ${error.message}`);
  }

  return data;
}

export async function getAttributeById(id: string): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attribute")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch attribute: ${error.message}`);
  }

  return data;
}

export async function updateAttribute(
  id: string,
  updates: AttributeUpdate
): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attribute")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update attribute: ${error.message}`);
  }

  return data;
}

export async function deleteAttribute(id: string): Promise<Attribute> {
  const { data, error } = await supabase
    .from("attribute")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete attribute: ${error.message}`);
  }

  return data;
}
