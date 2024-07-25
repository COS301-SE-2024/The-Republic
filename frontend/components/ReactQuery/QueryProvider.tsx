"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/components/ReactQuery/QueryClient";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
