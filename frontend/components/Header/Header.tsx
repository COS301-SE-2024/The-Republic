"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "../ThemeToggle/ModeToggle";
import { useUser } from "@/lib/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/Custom.module.css";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = ({ onToggleLeftSidebar, isDesktop }: { onToggleLeftSidebar: () => void, isDesktop: boolean }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/images/b-logo-full-black.png");
  const router = useRouter();

  useEffect(() => {
    const newLogoSrc = theme === "dark" ? "/images/b-logo-full.png" : "/images/b-logo-full-black.png";
    setLogoSrc(newLogoSrc);
  }, [theme]);

  return (
    <header className="flex items-center justify-between p-3 border-b">
      {isDesktop ? (
        <>
          <div className={styles.republicHeader}>
            <Image priority width={500} height={500} src={logoSrc} alt="logo" />
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <ModeToggle />
            </div>
            {!user && (
              <Button onClick={() => router.push("/login")}>
                Login
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <button onClick={onToggleLeftSidebar} className="p-2">
            <Avatar>
              <AvatarImage src={user?.image_url} />
              <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
            </Avatar>
          </button>
          <div className={`${styles.republicHeader} ${styles.mobileHeader}`}>
            <Image priority width={70} height={70} src={logoSrc} alt="logo" />
          </div>
          <div className="p-2">

          </div>
        </>
      )}
    </header>
  );
};

export default Header;