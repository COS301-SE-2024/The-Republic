import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { signOutWithToast } from "@/lib/utils";

interface HomeAvatarProps {
  imageUrl: string;
}

export function HomeAvatar({ imageUrl }: HomeAvatarProps) {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{"JD"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-2">
        <DropdownMenuItem onClick={() => signOutWithToast(toast)}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
