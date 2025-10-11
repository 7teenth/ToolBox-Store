import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

const ReviewEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [review, setReview] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    if (id && id !== "new") fetchReview();
  }, [id]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name");
    setProducts(data || []);
  };

  const fetchReview = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setReview(data);
      setUserName(data.user_name);
      setComment(data.comment);
      setRating(data.rating);
      setProductId(data.product_id);
    }
  };

  const saveReview = async () => {
    if (id === "new") {
      await supabase.from("reviews").insert({
        user_name: userName,
        comment,
        rating,
        product_id: productId,
      });
    } else {
      await supabase
        .from("reviews")
        .update({ user_name: userName, comment, rating, product_id: productId })
        .eq("id", id);
    }
    router.push("/admin/reviews");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        {id === "new" ? "Add Review" : "Edit Review"}
      </h1>
      <div className="flex flex-col gap-4 max-w-md">
        <select
          value={productId || ""}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating ?? ""}
          onChange={(e) => setRating(parseFloat(e.target.value))}
          className="border p-2 rounded"
          min={0}
          max={5}
          step={0.1}
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={saveReview}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {id === "new" ? "Add" : "Save"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ReviewEdit;
