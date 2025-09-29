import React from "react";
import { Review } from "@/types/review";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews.length) {
    return (
      <div className="text-gray-500 text-sm italic">
        Відгуків поки немає. Будьте першим!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800">
              {review.userName || "Анонім"}
            </span>
            <span className="text-yellow-500 font-medium">
              {review.rating} ★
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(review.date).toLocaleDateString("uk-UA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};
