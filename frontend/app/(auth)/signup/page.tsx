"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const signup = async () => {
        const { error } = await supabase.auth.signUp({
            email, 
            password,
            options: {
                data: {
                    fullname,
                    username,
                }
            }
        });

        if (error) {
            toast({
                variant: "destructive",
                description: "Failed to signup, please try again"
            });
        } else {
            router.push("/");
        }
    };


    return (
        <div className="flex w-max h-full mb-16 items-center">
            <form action={signup} className="flex flex-col gap-1.5">
                <Label htmlFor="fullname">Fullname</Label>
                <Input 
                    type="fullname" 
                    placeholder="Fullname"
                    id="fullname"
                    value={fullname}
                    onChange={(event) => setFullname(event.target.value)}
                    required
                />
                <Label htmlFor="email" className="mt-2">Email</Label>
                <Input 
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <Label htmlFor="username" className="mt-2">Username</Label>
                <Input 
                    type="text"
                    placeholder="Username"
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
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
                <p className="mt-2 text-sm">Already have an account? <a href="/login">Login</a></p> 
                <Button type="submit" className="mt-4">Signup</Button>
            </form>
        </div>
    );
}
