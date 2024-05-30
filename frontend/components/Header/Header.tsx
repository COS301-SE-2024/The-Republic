import React from 'react';
import { SearchBar } from "../SearchBar/SearchBar";

export default function Header() {
  return (
    <header className="flex items-center p-5 border-b bg-background">
      <div className="text-lg font-bold">The Republic</div>
      <div className="flex-grow mx-20">
        <SearchBar />
      </div>
    </header>
  );
}