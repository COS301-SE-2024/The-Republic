import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoreMenuProps {
  menuItems: string[];
  isOwner: boolean;
  onAction: (action: string) => void;
  onSubscribe: (option: string) => void;
  theme: "light" | "dark"; 
}

const MoreMenu: React.FC<MoreMenuProps> = ({
  menuItems,
  isOwner,
  onAction,
  onSubscribe,
  theme,
}) => {
  const handleAction = (action: string) => {
    onAction(action);
  };

  const handleSubscribeOptionClick = (option: string) => {
    onSubscribe(option);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center rounded-full p-1 hover:bg-gray-200 ${
              theme === "dark" ? "hover:bg-[#0C0A09] hover:text-white" : ""
            }`}
            title="More Options"
          >
            <MoreHorizontal className={theme === "dark" ? "text-white" : "text-gray-900"} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={theme === "dark" ? "hover:bg-[#0C0A09] hover:text-white" : "bg-white"}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item === "Delete" && isOwner ? (
                <DialogTrigger asChild>
                  <DropdownMenuItem className={theme === "dark" ? "text-white" : "text-gray-900"}>
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              ) : item === "Resolve Issue" ? (
                <DropdownMenuItem 
                  onClick={() => handleAction("Resolve Issue")}
                  className={theme === "dark" ? "hover:bg-gray-600 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                >
                  Resolve Issue
                </DropdownMenuItem>
              ) : item === "Subscribe" ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={theme === "dark" ? "text-white" : "text-gray-900"}>
                    Subscribe
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Issue")}
                      className={theme === "dark" ? "hover:bg-gray-600 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                    >
                      Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Category")}
                      className={theme === "dark" ? "hover:bg-gray-600 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                    >
                      Category
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Location")}
                      className={theme === "dark" ? "hover:bg-gray-600 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                    >
                      Location
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => handleAction(item)}
                  className={theme === "dark" ? "hover:bg-gray-600 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}
                >
                  {item}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this issue? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => handleAction("Delete")}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreMenu;
