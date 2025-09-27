// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
