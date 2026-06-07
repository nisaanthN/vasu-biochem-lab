"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppBootstrap } from "./AppBootstrap";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={150}>
        <AppBootstrap />
        {children}
        <Toaster richColors position="top-right" closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
}
