"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/lib/globals";

interface User {
  fullname: string;
  image_url: string;
}

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Failed to retrieve session:', sessionError);
        return;
      }

      if (session) {
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Failed to retrieve user:', userError);
          return;
        }

        if (authUser) {
          try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${authUser.id}`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
            });

            if (!userResponse.ok) {
              throw new Error('Failed to fetch user data');
            }
            const userData: User = await userResponse.json();
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};