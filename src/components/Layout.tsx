import React from "react";
import Header from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header на всю ширину */}
      <Header />

      {/* Контент без боковых отступов */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer на всю ширину */}
      <Footer />
    </div>
  );
};
