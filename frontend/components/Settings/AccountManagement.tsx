import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserX, Eye, EyeOff } from "lucide-react";

const AccountManagement: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const handleAnonymousToggle = () => {
    setIsAnonymous(!isAnonymous);
    toast({
      title: "Default anonymity updated",
      description: `Your default anonymity is now set to ${!isAnonymous ? "anonymous" : "public"}.`,
    });
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserX className="mr-2" /> Account Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous-mode"
            checked={isAnonymous}
            onCheckedChange={handleAnonymousToggle}
          />
          <Label htmlFor="anonymous-mode" className="flex items-center">
            {isAnonymous ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> Default to Anonymous
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Default to Public
              </>
            )}
          </Label>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All of your data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AccountManagement;