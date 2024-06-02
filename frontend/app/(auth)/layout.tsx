import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col w-dvw h-dvh items-center">
        <div className="text-lg font-bold w-max my-2">The Republic</div>
        {children}
      </div>
  );
}
