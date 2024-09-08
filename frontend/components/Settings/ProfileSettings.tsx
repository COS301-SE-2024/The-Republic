import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateUsername } from "@/lib/api/updateProfile";

const ProfileSettings: React.FC<{ currentUsername: string }> = ({ currentUsername }) => {
  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: (data) => {
      setSuccessMessage("Username changed successfully!");
      setErrorMessage("");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "An error occurred.");
    },
  });

  const handleSaveUsername = () => {
    if (newUsername.length < 3 || newUsername.length > 20) {
      setErrorMessage("Username must be between 3 and 20 characters.");
      return;
    }

    mutation.mutate(newUsername);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2" /> Change Username
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentUsername">Current Username</Label>
            <Input id="currentUsername" value={currentUsername} readOnly />
          </div>
          <div>
            <Label htmlFor="newUsername">New Username</Label>
            <Input
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
          </div>
          <Button onClick={handleSaveUsername}>Save Username</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;