import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback
} from "../ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { signOutWithToast } from "@/lib/utils";

export function HomeAvatar() {
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={"https://homecoming.messiah.edu/wp-content/uploads/2015/04/speaker-3-v2.jpg"}
          />
          <AvatarFallback>{"JD"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-2">
        <DropdownMenuItem onClick={() => signOutWithToast(toast)}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
