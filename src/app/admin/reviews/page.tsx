import React, { useEffect, useState } from "react";
import Link from "next/link";
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

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);

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
