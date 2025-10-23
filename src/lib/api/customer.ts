import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type Customer = Database["public"]["Tables"]["customer"]["Row"];
export type CustomerCreate = Database["public"]["Tables"]["customer"]["Insert"];
export type CustomerUpdate = Database["public"]["Tables"]["customer"]["Update"];

export async function createCustomer(
  customer: CustomerCreate
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customer")
    .insert([customer])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }

  return data;
}

export async function getCustomerById(
  id: string
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customer")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }

  return data;
}

export async function updateCustomer(
  id: string,
  updates: CustomerUpdate
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customer")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update customer: ${error.message}`);
  }

  return data;
}

export async function deleteCustomer(
  id: string
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customer")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete customer: ${error.message}`);
  }

  return data;
}
