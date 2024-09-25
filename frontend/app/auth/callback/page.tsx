"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/globals";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during authentication:", error);
        router.push("/signup");
        return;
      }

      if (data?.session) {
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("created_at")
          .eq("user_id", data.session.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          router.push("/signup");
          return;
        }

        const createdAt = new Date(userData.created_at);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        if (createdAt > fiveMinutesAgo) {
          router.push("/completeSignUp");
        } else {
          router.push("/");
        }
      } else {
        router.push("/signup");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );
}