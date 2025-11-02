"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" richColors expand closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}