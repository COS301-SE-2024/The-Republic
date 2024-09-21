"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Eye, EyeOff, UserPlus, Mail, User, Lock, Share2, AlertTriangle, MessageCircle, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import PostSignupLocation from "@/components/PostSignupLocation/PostSignupLocation";
import { checkUsername } from "@/lib/api/checkUsername";
import GoogleSignup from "@/components/GoogleSignup/GoogleSignup";

export default function Signup() {
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUsernameAvailable = await checkUsername({"username" : username});
    if (!isUsernameAvailable) {
      toast({
        variant: "destructive",
        description: "Username is not available, already in use.",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          username,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to sign up, please try again",
      });
    } else if (data.user) {
      setShowLocationSetup(true);
    }
  };

  const handleLocationSetupComplete = () => {
    router.push("/");
  };

  const handleGoogleSignup = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to sign up with Google, please try again",
      });
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
          Create Your Account
        </motion.h1>
      </div>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white dark:bg-transparent rounded-xl overflow-hidden shadow-lg">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 bg-green-600 text-white relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Welcome to The Republic</h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">Join us in revolutionizing citizen engagement</p>
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 dark:text-green-500 mb-6 sm:mb-8">Create an Account</h2>
          <GoogleSignup onSignup={handleGoogleSignup} />
          <div className="my-4 text-center">
            <span className="px-2 bg-white dark:bg-transparent text-gray-500">or</span>
          </div>
          <form onSubmit={signup} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="fullname" className="text-base sm:text-lg text-green-700 dark:text-green-500">Full Name</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full mt-1 sm:mt-2 text-base sm:text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Enter your full name"
                />
                <UserPlus className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={18} />
              </div>
            </div>
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
              <Label htmlFor="username" className="text-base sm:text-lg text-green-700 dark:text-green-500">Username</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 sm:mt-2 text-base sm:text-lg pl-10 border-green-300 dark:border-green-700 rounded-md focus:border-green-500 focus:ring focus:ring-green-200 dark:bg-transparent dark:text-white"
                  placeholder="Choose a username"
                />
                <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" size={18} />
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 text-base sm:text-lg rounded-md transition duration-300">
              Create Account
            </Button>
          </form>
          <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-green-600 dark:text-green-400">
            Already have an account? <a href="/login" className="text-green-700 dark:text-green-300 hover:underline">Log in</a>
          </p>
          {showLocationSetup && (
            <PostSignupLocation onComplete={handleLocationSetupComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
