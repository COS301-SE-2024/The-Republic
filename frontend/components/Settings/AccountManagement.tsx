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
import { UserAlt } from '@/lib/types';
import { signOutWithToast } from "@/lib/utils";

interface AccountManagementProps {
  user: UserAlt | null;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ user }) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmationStep, setDeleteConfirmationStep] = useState(1);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [username, setUsername] = useState("");
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
        if (deleteConfirmationText === "delete my account") {
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
        if (deleteConfirmationText === user?.email_address) {
          setDeleteConfirmationStep(3);
          setDeleteConfirmationText("");
        } else {
          toast({
            title: "Incorrect username",
            description: "Please enter your email address to confirm deletion.",
            variant: "destructive",
          });
        }
        break;
      case 3:
        if (username === user?.username) {
          handleDeleteAccount();
        } else {
          toast({
            title: "Incorrect Username",
            description: "Please enter your username to confirm deletion.",
            variant: "destructive",
          });
        }
        break;
      default:
        break;
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please log in to delete your account.",
      });

      return;
    } else {    
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/validate/delete/${user?.user_id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user_id": user?.user_id,
          "username": username,
          "email_address": deleteConfirmationText
        }),
      });
    
      if (response.status === 204) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
          variant: "warning",
        });

        setIsDeleting(false);
        setDeleteConfirmationStep(1);
        setDeleteConfirmationText("");
        setUsername("");

        signOutWithToast(toast);
      } else {
        toast({
          title: "Account Deletion Failed",
          description: "Please verify your details and try again later.",
          variant: "destructive",
        });
      }
    }
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
                  Please enter your email address to confirm the second step of the deletion process.
                </p>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email address"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </>
            )}
            {deleteConfirmationStep === 3 && (
              <>
                <p>
                  This is the final step. Please enter your username to permanently delete your account.
                </p>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsDeleting(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccountConfirm}>
                {deleteConfirmationStep === 3 ? "Confirm Deletion" : "Delete Accoount"}
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