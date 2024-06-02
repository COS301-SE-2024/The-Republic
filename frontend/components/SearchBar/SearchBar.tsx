import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="flex w-full items-center space-x-2">
      <Input type="text" placeholder="Search" className="flex-grow" />
      <Button type="submit">Search</Button>
    </div>
  );
}

export default SearchBar;
