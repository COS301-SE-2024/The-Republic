"use client";

import React from "react";
import { SquarePen } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { useUser } from "@/lib/contexts/UserContext";
import { useTheme } from "next-themes";

const CreatePost: React.FC = () => {
  const { user } = useUser();
  const { theme } = useTheme(); 

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex items-center cursor-pointer">
          <SquarePen className="w-4 h-4 mr-1" />
          <span className="text-sm text-gray-600">Create a post</span>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-[90vw] max-w-3xl ${
            theme === "dark" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">Create a Post</Dialog.Title>
          <Dialog.Description  style={{ display: 'none' }}>
            Fill in the details below to create a new post.
          </Dialog.Description>
          <IssueInputBox user={user} />
          <Dialog.Close asChild>
            <Button variant="outline" className="mt-4">Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePost;
