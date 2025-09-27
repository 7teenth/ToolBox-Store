import React from "react";

export interface Review {
  id: number;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO или формат даты
}

interface ReviewsProps {
  reviews: Review[];
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <section className="reviews-section mt-12 mb-12 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Отзывы покупателей
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
              <span className="font-semibold">{review.userName}</span>
              <span>{new Date(review.date).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
