"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Custom.module.css";
import { useTheme } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [logoSrc, setLogoSrc] = useState("/images/b-logo-full-black-vert.png"); 
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const newLogoSrc = currentTheme === "dark" 
      ? "/images/b-logo-full-vert.png" 
      : "/images/b-logo-full-black-vert.png";
    setLogoSrc(newLogoSrc);
  }, [theme, systemTheme]);

  return (
    <div className="flex flex-col w-dvw h-dvh items-center">
      <div className="flex flex-col items-center mt-16 mb-2"> 
        <Image
          priority
          width={200} 
          height={200} 
          src={logoSrc}
          alt="The Republic logo"
          className={styles.logo} 
        />
      </div>
      <div> 
        {children}
      </div>
    </div>
  );
}