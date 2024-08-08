"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to sign in, please try again",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex w-max h-full mb-16 items-center">
      <form action={login} className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <div className="flex flex-row mt-2">
          <Label htmlFor="password">Password</Label>
          <p
            className="text-xs ml-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </p>
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <p className="mt-2 text-sm">
          Don&apos;t have an account? <a href="/signup">Signup</a>
        </p>
        <Button type="submit" className="mt-4">
          Login
        </Button>
      </form>
    </div>
  );
}
