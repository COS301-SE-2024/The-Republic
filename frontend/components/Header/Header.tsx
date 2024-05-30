import React from 'react';
import { SearchBar } from "../SearchBar/SearchBar";
import { ModeToggle } from '../ThemeToggle/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-5 border-b bg-background">
      <div className="text-lg font-bold">The Republic</div>
      <div className="flex items-center flex-grow mx-8">
        <div className="flex-grow mr-4">
          <SearchBar  />
        </div>
        <div className="mr-4">
          <ModeToggle />
        </div>
        <Avatar>
          <AvatarImage src="https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}