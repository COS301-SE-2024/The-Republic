import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  onDelete: () => void;
  onResolve: () => void; 
}

const MoreMenu: React.FC<MoreMenuProps> = ({
  menuItems,
  isOwner,
  onDelete,
  onResolve,
}) => {
  const handleDelete = () => {
    onDelete();
  };

  const handleResolve = () => {
    onResolve();
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center rounded-full p-1 hover:bg-gray-200">
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
              ) : item === "Resolve Issue" && isOwner ? (
                <DropdownMenuItem onClick={handleResolve}>
                  Resolve Issue
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoreMenu;
