import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type OrderStatus = Database["public"]["Tables"]["order_status"]["Row"];
export type OrderStatusCreate  = Database["public"]["Tables"]["order_status"]["Insert"];
export type OrderStatusUpdate = Database["public"]["Tables"]["order_status"]["Update"];

export async function createOrderStatus(record: OrderStatusCreate): Promise<OrderStatus> {
  const { data, error } = await supabase
    .from("order_status")
    .insert([record])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order_status: ${error.message}`);
  }

  return data;
}

export async function getOrderStatusById(id: string): Promise<OrderStatus> {
  const { data, error } = await supabase
    .from("order_status")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order_status: ${error.message}`);
  }

  return data;
}

export async function updateOrderStatus(id: string, updates: OrderStatusUpdate): Promise<OrderStatus> {
  const { data, error } = await supabase
    .from("order_status")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order_status: ${error.message}`);
  }

  return data;
}

export async function deleteOrderStatus(id: string): Promise<OrderStatus> {
  const { data, error } = await supabase
    .from("order_status")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete order_status: ${error.message}`);
  }

  return data;
}
