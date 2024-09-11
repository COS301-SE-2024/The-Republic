import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/api/updateProfile";

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setSuccessMessage("Password changed successfully! You will need to log in again.");
      setErrorMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      console.error("Password change error:", error);
      if (error.message === "Current password is incorrect") {
        setErrorMessage("Current password is incorrect");
      } else {
        setErrorMessage(error.message || "An error occurred while changing the password");
      }
    },
  });

  const handleChangePassword = () => {
    setErrorMessage(""); 
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2" /> Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;