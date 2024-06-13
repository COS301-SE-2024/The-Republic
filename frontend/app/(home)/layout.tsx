import React from 'react';
import Header from "@/components/Header/Header";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { UserProvider } from "@/lib/contexts/UserContext";
import type { Metadata } from "next";
import { HomeAvatarProps } from '@/lib/types';

export const metadata: Metadata = {
  title: "Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarProps: HomeAvatarProps = {
    username: 'johndoe',
    fullname: 'John Doe',
    imageUrl: ''
  };

  return (
    <div className="flex flex-col min-h-screen">
      <UserProvider>
        <Header />
        <div className="flex flex-1">
          <Sidebar  {...sidebarProps}/>
          <main className="flex-1 p-4">{children}</main>
          <RightSidebar />
        </div>
      </UserProvider>
    </div>
  );
}