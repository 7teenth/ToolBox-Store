import React, { useState, useEffect } from "react";
import { getImageUrl } from "../lib/getImageUrl";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface RawSlide {
  imagePath: string;
  title: string;
  subtitle: string;
}

const rawSlides: RawSlide[] = [
  {
    imagePath: "slides/slide1.jpg",
    title: "Інструменти для професіоналів",
    subtitle: "Все, що потрібно для вашої майстерності",
  },
  {
    imagePath: "slides/slide2.jpg",
    title: "Надійність і якість",
    subtitle: "Ми обираємо лише перевірені бренди",
  },
  {
    imagePath: "slides/slide3.jpg",
    title: "Знижки та акції",
    subtitle: "Слідкуйте за новими пропозиціями",
  },
];

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);

  // Завантаження зображень із Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      const resolvedSlides: Slide[] = await Promise.all(
        rawSlides.map(async (slide) => ({
          title: slide.title,
          subtitle: slide.subtitle,
          image: await getImageUrl(slide.imagePath),
        }))
      );
      setSlides(resolvedSlides);
    };
    fetchSlides();
  }, []);

  // Автоперемикання кожні 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Фонове зображення */}
          <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          {/* Вуаль */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Текст */}
          <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
            <p className="mt-2 text-lg">{slide.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Навігаційні точки */}
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
