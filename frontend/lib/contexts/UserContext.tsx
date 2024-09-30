"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/globals";
import Cookies from "js-cookie";
import { UserAlt, UserContextType } from "@/lib/types";
import { fetchUserData } from "@/lib/api/fetchUserData";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserAlt | null>(null);

  const { data: userData, refetch: refetchUserData } = useQuery({
    queryKey: ['user_data'],
    queryFn: () => fetchUserData(),
  });

  const {
    data: subscriptions, refetch: refetchSubscriptions
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.access_token}`,
        },
        body: JSON.stringify({ userId: userData?.user_id }),
      }).then(response => response.json()),
    enabled: !!userData,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("savedUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        Cookies.set("Authorization", session?.access_token ?? "", {
          expires: new Date((session?.expires_at ?? 0) * 1000),
        });

        if (session?.user.id !== user?.user_id) {
          if (user) setUser(null);
          refetchUserData();
          refetchSubscriptions();
        }
      } else if (event === "SIGNED_OUT") {
        Cookies.remove("Authorization");
        localStorage.removeItem("savedUser");
        localStorage.removeItem("userSubscriptions");
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, setUser]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("savedUser", JSON.stringify(userData));
    }

    if (subscriptions && userData) {
      localStorage.setItem(
        "userSubscriptions",
        JSON.stringify(subscriptions.data)
      );
    }
  }, [userData, subscriptions]);

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
