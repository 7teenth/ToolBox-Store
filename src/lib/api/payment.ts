import { supabase } from "@/lib/supabase";
import type { Database } from "../../../supabase/types/database.types";

export type Payment = Database["public"]["Tables"]["payment"]["Row"];
export type PaymentCreate  = Database["public"]["Tables"]["payment"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payment"]["Update"];

export async function createPayment(payment: PaymentCreate): Promise<Payment> {
  const { data, error } = await supabase
    .from("payment")
    .insert([payment])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  return data;
}

export async function getPaymentById(id: string): Promise<Payment> {
  const { data, error } = await supabase
    .from("payment")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }

  return data;
}

export async function updatePayment(id: string, updates: PaymentUpdate): Promise<Payment> {
  const { data, error } = await supabase
    .from("payment")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment: ${error.message}`);
  }

  return data;
}

export async function deletePayment(id: string): Promise<Payment> {
  const { data, error } = await supabase
    .from("payment")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete payment: ${error.message}`);
  }

  return data;
}
