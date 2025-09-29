import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || rating === 0 || !comment.trim()) {
      toast.error("Будь ласка, заповніть всі поля");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        product_id: productId,
        user_name: userName,
        rating,
        comment,
        date: new Date().toISOString().split("T")[0],
      },
    ]);

    if (error) {
      toast.error("Помилка при надсиланні відгуку");
      console.error(error);
    } else {
      toast.success("Відгук надіслано!");
      setUserName("");
      setRating(0);
      setComment("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-800">📝 Залишити відгук</h3>

      <input
        type="text"
        placeholder="Ваше ім’я"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
        required
      />

      <div>
        <label className="block font-medium text-gray-700 mb-1">Оцінка:</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className={`text-2xl ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Ваш коментар..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
        rows={4}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
      >
        ✅ Надіслати відгук
      </button>
    </form>
  );
};
