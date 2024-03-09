"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};
