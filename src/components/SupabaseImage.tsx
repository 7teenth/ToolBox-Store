import React, { useState } from "react";
import { getImageUrl } from "../lib/getImageUrl";

interface SupabaseImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // путь внутри Supabase, например: "products/drill.jpg"
  fallback?: string; // путь к fallback, по умолчанию "defaults/default-product.png"
}

export const SupabaseImage: React.FC<SupabaseImageProps> = ({
  src,
  fallback = "defaults/default-product.png",
  alt = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));

  const handleError = () => {
    setImgSrc(getImageUrl(fallback));
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};
