'use client'
import React, { useState, useEffect } from "react";
import { SearchBar } from "../SearchBar/SearchBar";
import { ModeToggle } from "../ThemeToggle/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/globals";
import { User } from '@supabase/supabase-js';
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Failed to retrieve session:', sessionError);
        return;
      }
      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Failed to retrieve user:', userError);
          return;
        }
        setUser(user);
      }
      
    }

    checkAuth();
  }, []);

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
          <Avatar>
            <AvatarImage
              src={"https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg"}
            />
            <AvatarFallback>{"JD"}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            onClick={() => {
              router.push("/signup")
            }}
            
          >
            Sign Up
          </Button>
        )}
      </div>
    </header>
  );
}
