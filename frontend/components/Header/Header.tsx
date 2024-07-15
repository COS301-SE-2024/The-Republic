"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { ModeToggle } from "../ThemeToggle/ModeToggle";
import { useUser } from "@/lib/contexts/UserContext";
import { HomeAvatar } from "../HomeAvatar/HomeAvatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/Custom.module.css";
import { useTheme } from "next-themes";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/images/b-logo-full.png"); // Default to light mode logo

  // Listen for changes in theme and update logo accordingly
  useEffect(() => {
    const newLogoSrc =
      theme === "dark"
        ? "/images/b-logo-full.png"
        : "/images/b-logo-full-black.png";
    setLogoSrc(newLogoSrc);
  }, [theme]);

  return (
    <header className="flex items-center justify-between p-5 border-b bg-background">
      <div className={styles.republicHeader}>
        <Image priority width={250} height={250} src={logoSrc} alt="logo" />
      </div>
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
