"use client";

import Feed from "@/components/Feed/Feed";
import { useUser } from "@/lib/contexts/UserContext";
import { Suspense } from "react";

export default function Home() {
  const { user } = useUser();
  return (
    <Suspense>
      <Feed user={user}/>
    </Suspense>
  );
}
