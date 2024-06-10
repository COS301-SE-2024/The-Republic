"use client";

import Feed from "@/components/Feed/Feed";
import { UserProvider } from '@/lib/contexts/UserContext';

const Home = () => {
  return (
    <UserProvider>
      <Feed />
    </UserProvider>
  );
};

export default Home;
