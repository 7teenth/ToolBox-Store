'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type OrderShippingAddress = Database["public"]["Tables"]["order_shipping_address"]["Row"];
export type OrderShippingAddressCreate  = Database["public"]["Tables"]["order_shipping_address"]["Insert"];
export type OrderShippingAddressUpdate = Database["public"]["Tables"]["order_shipping_address"]["Update"];

export async function createOrderShippingAddress(
  address: OrderShippingAddressCreate
): Promise<OrderShippingAddress> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_shipping_address")
    .insert([address])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order_shipping_address: ${error.message}`);
  }

  return data;
}

export async function getOrderShippingAddressById(
  id: string
): Promise<OrderShippingAddress> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_shipping_address")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order_shipping_address: ${error.message}`);
  }

  return data;
}

export async function updateOrderShippingAddress(
  id: string,
  updates: OrderShippingAddressUpdate
): Promise<OrderShippingAddress> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_shipping_address")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order_shipping_address: ${error.message}`);
  }

  return data;
}

export async function deleteOrderShippingAddress(
  id: string
): Promise<OrderShippingAddress> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_shipping_address")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete order_shipping_address: ${error.message}`);
  }

  return data;
}