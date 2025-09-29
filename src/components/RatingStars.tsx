import React from "react";

interface RatingStarsProps {
  rating: number; // от 0 до 5
  size?: number; // px
  color?: string; // tailwind-класс
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 20,
  color = "text-yellow-400",
  className = "",
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} filled size={size} color={color} />
      ))}
      {hasHalfStar && <Star half size={size} color={color} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} />
      ))}
    </div>
  );
};

const Star: React.FC<{
  filled?: boolean;
  half?: boolean;
  size: number;
  color?: string;
}> = ({ filled, half, size, color = "text-yellow-400" }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  if (half) {
    return (
      <svg
        style={style}
        className={color}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half)"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  }

  return (
    <svg
      style={style}
      className={filled ? color : "text-gray-300"}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};
