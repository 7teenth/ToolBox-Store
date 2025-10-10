import React from "react";
import { Review } from "@/types/review";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews.length) {
    return (
      <div className="text-gray-500 text-sm italic text-center py-6">
        Відгуків поки немає 😔 <br /> Будьте першим, хто поділиться своєю
        думкою!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-800 text-base">
                {review.userName || "Анонім"}
              </span>
            </div>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < review.rating ? "#FACC15" : "none"}
                  stroke="#FACC15"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{review.comment}</p>

          <p className="text-xs text-gray-400 mt-3">
            {new Date(review.date).toLocaleDateString("uk-UA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
