"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex w-max h-full mb-16 items-center">
            <form className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder="Email" id="email" required/>
                <div className="flex flex-row mt-2">
                    <Label htmlFor="password">Password</Label>
                    <p 
                        className="text-xs ml-3"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </p>
                </div>
                <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" id="password" required/>
                <p className="mt-2 text-sm">Don&apos;t have an account? <a href="/signup">Signup</a></p> 
                <Button type="submit" className="mt-4">Login</Button>
            </form>
        </div>
    );
}
