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

  const getMenuItemClassName = () => {
    return theme === "dark"
      ? "text-white hover:bg-[#262626]"
      : "text-black hover:bg-gray-100";
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center rounded-full p-1 ${
              theme === "dark" ? "hover:bg-[#262626]" : "hover:bg-gray-100"
            }`}
            title="More Options"
          >
            <MoreHorizontal className={theme === "dark" ? "text-white" : "text-black"} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className={theme === "dark" ? "bg-[#0C0A09] text-white" : "bg-white text-black"}
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item === "Delete" && isOwner ? (
                <DialogTrigger asChild>
                  <DropdownMenuItem className={getMenuItemClassName()}>
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              ) : item === "Resolve Issue" ? (
                <DropdownMenuItem 
                  onClick={() => handleAction("Resolve Issue")}
                  className={getMenuItemClassName()}
                >
                  Resolve Issue
                </DropdownMenuItem>
              ) : item === "Subscribe" ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={getMenuItemClassName()}>
                    Subscribe
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className={theme === "dark" ? "bg-[#0C0A09] text-white" : "bg-white text-black"}>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Issue")}
                      className={getMenuItemClassName()}
                    >
                      Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Category")}
                      className={getMenuItemClassName()}
                    >
                      Category
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Location")}
                      className={getMenuItemClassName()}
                    >
                      Location
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => handleAction(item)}
                  className={getMenuItemClassName()}
                >
                  {item}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className={theme === "dark" ? "bg-[#0C0A09] text-white" : "bg-white text-black"}>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
            Are you sure you want to delete this issue? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className={theme === "dark" ? "text-white" : "text-black"}>Cancel</Button>
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