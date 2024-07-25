import React from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import HelpMenu from "@/components/HelpMenu/Helpmenu";
import type { Metadata } from "next";
import { HomeAvatarProps } from "@/lib/types";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarProps: HomeAvatarProps = {
    username: "johndoe",
    fullname: "John Doe",
    imageUrl: "",
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <HelpMenu />
    </div>
  );
}
