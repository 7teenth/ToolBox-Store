'use server'

import { createClient } from "@/lib/supabase/server";
import type { Database } from "../../../../supabase/types/database.types";

export type PaymentStatus = Database["public"]["Tables"]["payment_status"]["Row"];
export type PaymentStatusCreate  = Database["public"]["Tables"]["payment_status"]["Insert"];
export type PaymentStatusUpdate = Database["public"]["Tables"]["payment_status"]["Update"];

export async function createPaymentStatus(
  status: PaymentStatusCreate
): Promise<PaymentStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_status")
    .insert([status])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment_status: ${error.message}`);
  }

  return data;
}

export async function getPaymentStatusById(
  id: string
): Promise<PaymentStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_status")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch payment_status: ${error.message}`);
  }

  return data;
}

export async function updatePaymentStatus(
  id: string,
  updates: PaymentStatusUpdate
): Promise<PaymentStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_status")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment_status: ${error.message}`);
  }

  return data;
}

export async function deletePaymentStatus(
  id: string
): Promise<PaymentStatus> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_status")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to delete payment_status: ${error.message}`);
  }

  return data;
}
