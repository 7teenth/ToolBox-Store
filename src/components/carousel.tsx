// components/Carousel.tsx
import React, { useState, useEffect } from "react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    image: "/images/slide1.jpg",
    title: "Инструменты для профессионалов",
    subtitle: "Все, что нужно для вашего мастерства",
  },
  {
    image: "/images/slide2.jpg",
    title: "Надежность и качество",
    subtitle: "Мы выбираем только проверенные бренды",
  },
  {
    image: "/images/slide3.jpg",
    title: "Скидки и акции",
    subtitle: "Следите за новыми предложениями",
  },
];

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  // Автопрокрутка каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Фоновое изображение */}
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          {/* Виньетка */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Текст */}
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
            <p className="mt-2 text-lg">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Навигационные точки */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400/50"
            }`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};
