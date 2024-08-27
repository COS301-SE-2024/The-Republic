"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Eye, EyeOff, Share2, AlertTriangle, MessageCircle, Shield, TrendingUp } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center mt-12 mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-500"></h1>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white dark:bg-transparent rounded-xl overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 p-10 bg-green-600 text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome to The Republic</h2>
          <p className="text-xl mb-6">Empowering citizen engagement</p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center"><Share2 className="mr-3" size={24} /> Share experiences</li>
            <li className="flex items-center"><AlertTriangle className="mr-3" size={24} /> Report incidents</li>
            <li className="flex items-center"><MessageCircle className="mr-3" size={24} /> Voice concerns</li>
            <li className="flex items-center"><Shield className="mr-3" size={24} /> Enhance accountability</li>
            <li className="flex items-center"><TrendingUp className="mr-3" size={24} /> Improve services</li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-semibold text-green-700 dark:text-green-500 mb-8">Login</h2>
          <form onSubmit={login} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg text-green-700 dark:text-green-500">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 text-lg border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-lg text-green-700 dark:text-green-500">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 text-lg border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 pr-10 dark:bg-transparent dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-600 dark:text-green-400"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-md transition duration-300">
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-base text-green-600 dark:text-green-400">
            No account? <a href="/signup" className="text-green-700 dark:text-green-300 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}