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


export function HomeAvatar() {
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
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
