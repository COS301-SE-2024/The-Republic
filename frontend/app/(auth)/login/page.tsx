"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Share2, AlertTriangle, MessageCircle, Shield, TrendingUp } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const login = async (e) => {
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <div className="flex justify-center mt-8 mb-6">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-500">THE REPUBLIC</h1>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white dark:bg-[#1e2124] rounded-xl overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 p-8 bg-green-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to The Republic</h2>
          <p className="text-lg mb-4">Empowering citizen engagement</p>
          <ul className="space-y-3">
            <li className="flex items-center"><Share2 className="mr-2" size={18} /> Share experiences</li>
            <li className="flex items-center"><AlertTriangle className="mr-2" size={18} /> Report incidents</li>
            <li className="flex items-center"><MessageCircle className="mr-2" size={18} /> Voice concerns</li>
            <li className="flex items-center"><Shield className="mr-2" size={18} /> Enhance accountability</li>
            <li className="flex items-center"><TrendingUp className="mr-2" size={18} /> Improve services</li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-500 mb-6">Login</h2>
          <form onSubmit={login} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-green-700 dark:text-green-500">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-[#2e3338] dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-green-700 dark:text-green-500">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 pr-10 dark:bg-[#2e3338] dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-600 dark:text-green-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-300">
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
            No account? <a href="/signup" className="text-green-700 dark:text-green-300 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}