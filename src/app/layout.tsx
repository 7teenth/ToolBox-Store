import Providers from "@/app/providers";
import React from "react";
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}