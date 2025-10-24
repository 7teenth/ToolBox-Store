'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type AttributeFilterUiType = Database["public"]["Tables"]["attribute_filter_ui_type"]["Row"];
export type AttributeFilterUiTypeCreate  = Database["public"]["Tables"]["attribute_filter_ui_type"]["Insert"];
export type AttributeFilterUiTypeUpdate = Database["public"]["Tables"]["attribute_filter_ui_type"]["Update"];

export async function createAttributeFilterUiType(
  record: AttributeFilterUiTypeCreate
): Promise<AttributeFilterUiType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_filter_ui_type")
    .insert([record])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attribute_filter_ui_type: ${error.message}`);
  }

  return data;
}

export async function getAttributeFilterUiTypeById(
  id: string
): Promise<AttributeFilterUiType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_filter_ui_type")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch attribute_filter_ui_type: ${error.message}`);
  }

  return data;
}

export async function updateAttributeFilterUiType(
  id: string,
  updates: AttributeFilterUiTypeUpdate
): Promise<AttributeFilterUiType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_filter_ui_type")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update attribute_filter_ui_type: ${error.message}`);
  }

  return data;
}

export async function deleteAttributeFilterUiType(
  id: string
): Promise<AttributeFilterUiType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attribute_filter_ui_type")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete attribute_filter_ui_type: ${error.message}`);
  }

  return data;
}
