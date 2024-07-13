import React from "react";
import Image from "next/image";
import styles from "@/styles/Custom.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-dvw h-dvh items-center">
      <div className="flex flex-col items-center mt-16  mb-2"> 
        <Image
          priority
          width={200} 
          height={200} 
          src="/images/b-logo-full-vert.png"
          alt="The Republic logo"
          className={styles.logo} 
        />
      </div>
      <div > 
        {children}
      </div>
    </div>
  );
}