import "../styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export default function App({ children }: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <CompareProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Analytics />
        </div>
      </CompareProvider>
    </CartProvider>
  );
}
