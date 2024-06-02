"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex w-max h-full mb-16 items-center">
            <form className="flex flex-col gap-1.5">
                <Label htmlFor="fullname">Fullname</Label>
                <Input type="fullname" placeholder="Fullname" id="fullname" required/>
                <Label htmlFor="email" className="mt-2">Email</Label>
                <Input type="email" placeholder="Email" id="email" required/>
                <Label htmlFor="username" className="mt-2">Username</Label>
                <Input type="text" placeholder="Username" id="username" required/>
                <div className="flex flex-row mt-2">
                    <Label htmlFor="password">Password</Label>
                    <p 
                        className="text-xs ml-3 cursor-default"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </p>
                </div>
                <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" id="password" required/>
                <p className="mt-2 text-sm">Already have an account? <a href="/login">Login</a></p> 
                <Button type="submit" className="mt-4">Signup</Button>
            </form>
        </div>
    );
}
