import React from "react";
import "@/styles/globals.css";
import "react-circular-progressbar/dist/styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/lib/contexts/UserContext";
import QueryProvider from "@/components/ReactQuery/QueryProvider";
import { OrganizationProvider } from "@/lib/contexts/OrganizationProvider"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <UserProvider>
              <OrganizationProvider>
                {children}
                <Toaster />
              </OrganizationProvider>
            </UserProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}