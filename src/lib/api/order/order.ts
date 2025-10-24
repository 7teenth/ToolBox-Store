'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type Order = Database["public"]["Tables"]["order"]["Row"];
export type OrderCreate  = Database["public"]["Tables"]["order"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["order"]["Update"];

export async function createOrder(order: OrderCreate): Promise<Order> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .insert([order])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
}

export async function getOrderById(id: string): Promise<Order> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data;
}

export async function updateOrder(id: string, updates: OrderUpdate): Promise<Order> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return data;
}

export async function deleteOrder(id: string): Promise<Order> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete order: ${error.message}`);
  }

  return data;
}
