"use client";

import React, { useState } from "react";
import { SquarePen } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { useUser } from "@/lib/contexts/UserContext";

const ProfileStats: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("issues");
  const { user } = useUser();

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex space-x-4 px-4 py-1 border-b">
      <div
        className={`relative inline-block cursor-pointer ${
          selectedTab === "issues" ? "text-green-500" : ""
        }`}
        onClick={() => handleTabClick("issues")}
      >
        <span className="font-bold">42</span>{" "}
        <span className="text-gray-600">Issues</span>
        {selectedTab === "issues" && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
        )}
      </div>
      <div
        className={`relative inline-block cursor-pointer ${
          selectedTab === "resolved" ? "text-green-500" : ""
        }`}
        onClick={() => handleTabClick("resolved")}
      >
        <span className="font-bold">28</span>{" "}
        <span className="text-gray-600">Resolved</span>
        {selectedTab === "resolved" && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
        )}
      </div>
      <div className="flex items-center ml-auto">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <div className="flex items-center cursor-pointer">
              <SquarePen className="w-4 h-4 mr-1" />
              <span className="text-sm text-gray-600">Create a post</span>
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-[90vw] max-w-3xl">
              <Dialog.Title className="text-xl font-semibold mb-4">Create a Post</Dialog.Title>
              <IssueInputBox user={user} />
              <Dialog.Close asChild>
                <Button variant="outline" className="mt-4">Close</Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default ProfileStats;
