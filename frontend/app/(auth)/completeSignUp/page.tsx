"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/globals";
import { checkUsername } from "@/lib/api/checkUsername";
import PostSignupLocation from "@/components/PostSignupLocation/PostSignupLocation";
import { updateUserProfile } from "@/lib/api/updateProfile";
import { User, ProfileUpdate } from "@/lib/types";

export default function CompleteProfile() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUsernameAvailable = await checkUsername({ username });
    if (!isUsernameAvailable) {
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
        description: "Username is not available, already in use.",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const currentUser: User = {
        user_id: user.id,
        fullname: fullname,
        username: username,
        bio: "",
        image_url: "",
        email_address: user.email || "",
        total_issues: 0,
        resolved_issues: 0,
        user_score: 0,
        access_token: "",
        location_id: null,
      };

      const dataToUpdate: ProfileUpdate = {
        fullname: fullname,
        username: username,
        bio: "",
      };

      const result = await updateUserProfile(currentUser, dataToUpdate, null);

      if (result.error) throw new Error(result.error);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setShowLocationSetup(true);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Something Went Wrong",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handleLocationSetupComplete = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
        {!showLocationSetup ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Choose a username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        ) : (
          <PostSignupLocation 
            onComplete={handleLocationSetupComplete}
            username={username}
            fullname={fullname}
          />
        )}
      </div>
    </div>
  );
}