"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "../ThemeToggle/ModeToggle";
import { useUser } from "@/lib/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/Custom.module.css";
import { useTheme } from "next-themes";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/images/b-logo-full.png"); 

  
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
        <Image priority width={400} height={400} src={logoSrc} alt="logo" />
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <ModeToggle />
        </div>
        {!user && (
          <Button
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;