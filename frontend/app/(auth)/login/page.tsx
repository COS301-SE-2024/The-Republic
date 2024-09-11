"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Eye, EyeOff, Share2, AlertTriangle, MessageCircle, Shield, TrendingUp, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      toast({
        variant: "destructive",
        description: "Incorrect username or password. Please try again",
      });
    } else {
      router.push("/");
    }
  };

  const floatingIcons = [
    { Icon: Share2, delay: 0 },
    { Icon: AlertTriangle, delay: 0.5 },
    { Icon: MessageCircle, delay: 1 },
    { Icon: Shield, delay: 1.5 },
    { Icon: TrendingUp, delay: 2 },
  ];

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex justify-center mt-6 mb-4 sm:mt-8 sm:mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-500"
        >
        </motion.h1>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white dark:bg-transparent rounded-xl overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 bg-green-600 text-white relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Welcome to The Republic</h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">Empowering citizen engagement</p>
          <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg relative z-10">
            <li className="flex items-center"><Share2 className="mr-2 sm:mr-3" size={20} /> Share experiences</li>
            <li className="flex items-center"><AlertTriangle className="mr-2 sm:mr-3" size={20} /> Report incidents</li>
            <li className="flex items-center"><MessageCircle className="mr-2 sm:mr-3" size={20} /> Voice concerns</li>
            <li className="flex items-center"><Shield className="mr-2 sm:mr-3" size={20} /> Enhance accountability</li>
            <li className="flex items-center"><TrendingUp className="mr-2 sm:mr-3" size={20} /> Improve services</li>
          </ul>
          {floatingIcons.map(({ Icon, delay }, index) => (
            <motion.div
              key={index}
              className="absolute text-green-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Icon size={32} />
            </motion.div>
          ))}
        </div>
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 dark:text-green-500 mb-6 sm:mb-8">Login</h2>
          <form onSubmit={login} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="text-base sm:text-lg text-green-700 dark:text-green-500">Email</Label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 sm:mt-2 text-base sm:text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Enter your email"
                />
                <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={18} />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-base sm:text-lg text-green-700 dark:text-green-500">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 sm:mt-2 text-base sm:text-lg pl-10 pr-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Enter your password"
                />
                <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 dark:text-green-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-base sm:text-lg rounded-md transition duration-300">
              Login
            </Button>
          </form>
          <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-green-600 dark:text-green-400">
            No account? <a href="/signup" className="text-green-700 dark:text-green-300 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
