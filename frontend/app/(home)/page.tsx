"use client";

import Feed from "@/components/Feed/Feed";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <Feed/>
    </Suspense>
  );
}
