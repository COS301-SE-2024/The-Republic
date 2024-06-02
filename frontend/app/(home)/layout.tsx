import Header from "@/components/Header/Header";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Sidebar from "@/components/Sidebar/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
