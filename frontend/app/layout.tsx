import { Providers } from "./providers";
import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import Header from '../components/Header/Header';
import "../styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">{children}</main>
              <RightSidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}