import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem, 
  CommandInput
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface DropdownProps {
  options: { group: string; items: Option[] };
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
  compact?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "Select option...",
  className,
  showSearch = true,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.items.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between pr-2", className)}
          disabled={disabled}
        >
          <div className="flex items-center justify-between w-full">
            {compact ? (
              <>
                <span className="mr-2 text-sm">Set Mood</span>
                <span className="flex items-center">
                  <span className="mr-2">{selectedOption?.emoji || placeholder}</span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </span>
              </>
            ) : (
              <>
                <span className="flex-grow text-left truncate">
                  {value ? selectedOption?.label : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", compact ? "w-[150px]" : "w-[200px]")}>
        <Command>
          <CommandList>
            {showSearch && <CommandInput placeholder="Search options..." />}
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {options.items.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.emoji && <span className="mr-2">{option.emoji}</span>}
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Dropdown;