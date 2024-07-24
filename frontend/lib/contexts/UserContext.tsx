"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/globals";
import Cookies from "js-cookie";
import { UserAlt, UserContextType } from "@/lib/types";
import { fetchUserData } from "@/lib/api/fetchUserData";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAlt | null>(null);
  
  const { data: userData, isLoading, isError, refetch } = useQuery({
    queryKey: ['user_data'],
    queryFn: fetchUserData,
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      setUser(userData);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        Cookies.set("Authorization", session?.access_token ?? "", {
          expires: new Date((session?.expires_at ?? 0) * 1000),
        });

        if (user === null) {
          refetch();
        }
      } else if (event === "SIGNED_OUT") {
        Cookies.remove("Authorization");
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userData]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
