"use client";

import React from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { ModeToggle } from "../ThemeToggle/ModeToggle";
import { useUser } from "@/lib/contexts/UserContext";
import { HomeAvatar } from "../HomeAvatar/HomeAvatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between p-5 border-b bg-background">
      <div className="text-lg font-bold">The Republic</div>
      <div className="flex items-center flex-grow mx-8">
        <div className="flex-grow mr-4">
          <SearchBar />
        </div>
        <div className="mr-4">
          <ModeToggle />
        </div>
        {user ? (
          <HomeAvatar imageUrl={user.image_url} />
        ) : (
          <Button
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign Up
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
