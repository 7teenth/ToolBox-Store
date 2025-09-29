import React, { useState } from "react";

interface InteractiveRatingProps {
  value: number; // текущий рейтинг
  onRate: (rating: number) => void; // callback при выборе
  max?: number; // по умолчанию 5
  size?: number; // размер звезды
  showValue?: boolean; // показывать "4.5 / 5"
}

export const InteractiveRating: React.FC<InteractiveRatingProps> = ({
  value,
  onRate,
  max = 5,
  size = 24,
  showValue = true,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (index: number) => {
    onRate(index + 1);
  };

  const handleMouseEnter = (index: number) => {
    setHovered(index + 1);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const displayValue = hovered ?? value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(max)].map((_, i) => {
          const filled = i < displayValue;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              className={`transition-colors ${
                filled ? "text-yellow-400" : "text-gray-300"
              }`}
              style={{ fontSize: `${size}px`, lineHeight: 1 }}
              aria-label={`Оценка ${i + 1}`}
            >
              ★
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
};
