import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Lock } from "lucide-react";

const ProfileSettings: React.FC = () => {
  const [role, setRole] = useState("");

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  const handleSaveProfile = () => {
    // Logic to save profile changes
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2" /> Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Your Role</Label>
            <Input
              id="role"
              value={role}
              onChange={handleRoleChange}
              placeholder="e.g., City Planner"
            />
          </div>
          <div>
            <Label htmlFor="password">Change Password</Label>
            <div className="flex items-center space-x-2">
              <Input id="password" type="password" placeholder="New Password" />
              <Button variant="outline">
                <Lock className="mr-2 h-4 w-4" /> Change
              </Button>
            </div>
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
