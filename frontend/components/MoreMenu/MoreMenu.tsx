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
}

const MoreMenu: React.FC<MoreMenuProps> = ({
  menuItems,
  isOwner,
  onAction,
  onSubscribe,
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
            className="flex items-center rounded-full p-1 "
            title="More Options"
          >
            <MoreHorizontal />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item === "Delete" && isOwner ? (
                <DialogTrigger asChild>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DialogTrigger>
              ) : item === "Resolve Issue" ? (
                <DropdownMenuItem onClick={() => handleAction("Resolve Issue")}>
                  Resolve Issue
                </DropdownMenuItem>
              ) : item === "Subscribe" ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Subscribe</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Issue")}
                    >
                      Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Category")}
                    >
                      Category
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSubscribeOptionClick("Location")}
                    >
                      Location
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem key={index} onClick={() => handleAction(item)}>
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
            Are you sure you want to delete this issue? This action cannot be
            undone.
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
