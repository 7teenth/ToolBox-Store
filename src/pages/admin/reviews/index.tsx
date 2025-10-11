import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AdminLayout } from "@/components/admin/Layout";

interface Review {
  id: string;
  product_id: string | null;
  product_name?: string | null;
  user_name: string;
  rating: number | null;
  comment: string;
  date: string;
}

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    // Получаем отзывы вместе с названием товара через join
    const { data } = await supabase
      .from("reviews")
      .select(`*, products(name)`)
      .order("date", { ascending: false });

    if (data) {
      // @ts-ignore
      const formatted = data.map((r) => ({
        id: r.id,
        product_id: r.product_id,
        product_name: r.products?.name || "-",
        user_name: r.user_name,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
      }));
      setReviews(formatted);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Rating</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="border p-2">{review.product_name}</td>
              <td className="border p-2">{review.user_name}</td>
              <td className="border p-2">{review.rating ?? "-"}</td>
              <td className="border p-2">{review.comment}</td>
              <td className="border p-2">
                {new Date(review.date).toLocaleDateString()}
              </td>
              <td className="border p-2 flex gap-2">
                <Link
                  href={`/admin/reviews/${review.id}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ReviewsAdmin;
