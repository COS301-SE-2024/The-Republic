"use client";

import React from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import HelpMenu from "@/components/HelpMenu/Helpmenu";
import { HomeAvatarProps } from "@/lib/types";
import { useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const sidebarProps: HomeAvatarProps = {
    username: "johndoe",
    fullname: "John Doe",
    imageUrl: "",
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        isDesktop={isDesktop}
      />
       <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          {...sidebarProps}
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          {React.cloneElement(children as React.ReactElement, { rightSidebarOpen, setRightSidebarOpen })}
        </main>
      </div>
      <HelpMenu />
    </div>
  );
}
