import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserX, Eye, EyeOff } from "lucide-react";

const AccountManagement: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmationStep, setDeleteConfirmationStep] = useState(1);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const { toast } = useToast();

  const handleAnonymousToggle = () => {
    setIsAnonymous(!isAnonymous);
    toast({
      title: "Default anonymity updated",
      description: `Your default anonymity is now set to ${!isAnonymous ? "anonymous" : "public"}.`,
    });
  };

  const handleDeleteAccountInit = () => {
    setIsDeleting(true);
    setDeleteConfirmationStep(1);
  };

  const handleDeleteAccountConfirm = () => {
    switch (deleteConfirmationStep) {
      case 1:
        if (deleteConfirmationText.toLowerCase() === "delete my account") {
          setDeleteConfirmationStep(2);
          setDeleteConfirmationText("");
        } else {
          toast({
            title: "Incorrect confirmation",
            description: "Please type 'delete my account' to confirm deletion.",
            variant: "destructive",
          });
        }
        break;
      case 2:
        if (deleteConfirmationText === "username@example.com") {
          // Call API to delete the account
          handleDeleteAccount();
        } else {
          toast({
            title: "Incorrect username",
            description: "Please enter your username to confirm deletion.",
            variant: "destructive",
          });
        }
        break;
      default:
        break;
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
    setIsDeleting(false);
    setDeleteConfirmationStep(1);
    setDeleteConfirmationText("");
    // Update relevant state management (e.g., user context) after successful deletion
    // Implement redirect logic after account deletion (e.g., to home page or login page)
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

        {isDeleting ? (
          <div className="space-y-4">
            {deleteConfirmationStep === 1 && (
              <>
                <p>
                  Please type "delete my account" to confirm the first step of the deletion process.
                </p>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Type 'delete my account'"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </>
            )}
            {deleteConfirmationStep === 2 && (
              <>
                <p>
                  Please enter your username to confirm the final step of the deletion process.
                </p>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your username"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsDeleting(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccountConfirm}>
                {deleteConfirmationStep === 1 ? "Confirm Deletion" : "Proceed to Deletion"}
              </Button>
            </div>
          </div>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" onClick={handleDeleteAccountInit}>
                Delete Account
              </Button>
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
                <AlertDialogAction onClick={handleDeleteAccountInit}>
                  Proceed to Deletion
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountManagement;