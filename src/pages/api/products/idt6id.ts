import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Log incoming request for easier debugging in dev
    console.log("/api/products/idt6id request", { method: req.method, body: req.body });

    if (req.method === "POST") {
      const { action, name } = req.body || {};
      if (action === "createStub") {
        // Insert a minimal product row to get an id for storage paths
        const slug = (name || "").toString().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
        // Provide minimal required fields (price is NOT NULL in the schema)
        const { data, error } = await supabase
          .from("products")
          .insert({ name: name || "Untitled", slug, price: 0 })
          .select("id")
          .single();
        if (error)
          return res.status(500).json({
            error: error.message,
            details: (error as any).details ?? null,
            hint: (error as any).hint ?? null,
            code: (error as any).code ?? null,
          });
        return res.status(200).json({ id: data.id });
      }
      return res.status(400).json({ error: "Unknown POST action" });
    }

    if (req.method === "PUT") {
      const { action, payload } = req.body || {};
      if (action === "upsert" && payload) {
        // If a brand_id is provided but brand (string) is missing, resolve the brand name
        if (payload.brand_id && !payload.brand) {
          try {
            const { data: bdata, error: berr } = await supabase
              .from("brands")
              .select("name")
              .eq("id", payload.brand_id)
              .single();
            if (!berr && bdata) payload.brand = bdata.name;
          } catch (e) {
            console.warn("Failed to resolve brand name for brand_id", payload.brand_id, e);
          }
        }

        // Use upsert to insert or update full product data
        const { data, error } = await supabase
          .from("products")
          .upsert(payload, { onConflict: "id" })
          .select("id")
          .single();
        if (error)
          return res.status(500).json({
            error: error.message,
            details: (error as any).details ?? null,
            hint: (error as any).hint ?? null,
            code: (error as any).code ?? null,
          });
        return res.status(200).json({ id: data.id });
      }
      return res.status(400).json({ error: "Unknown PUT action or missing payload" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("/api/products/idt6id error:", err);
    return res.status(500).json({ error: err?.message ?? String(err), stack: err?.stack ?? null });
  }
}
