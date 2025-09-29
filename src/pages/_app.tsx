import type { AppProps } from "next/app";
import "../styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { CompareProvider } from "@/context/CompareContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"; // или "@vercel/analytics/next" для Next.js App Router

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <CompareProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Analytics />
        </div>
      </CompareProvider>
    </CartProvider>
  );
}
