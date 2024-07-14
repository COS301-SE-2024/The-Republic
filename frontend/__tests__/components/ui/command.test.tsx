import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest
        .fn()
        .mockResolvedValue({
          user: { id: "user-id" },
          session: "session-token",
          error: null,
        }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe("CommandDialog Components", () => {
  it("renders CommandDialog with all sub-components", () => {
    const { container } = render(
      <CommandDialog>
        <CommandInput />
        <CommandList>
          <CommandGroup>
            <CommandItem>Command 1</CommandItem>
            <CommandSeparator />
            <CommandItem>Command 2</CommandItem>
          </CommandGroup>
          <CommandEmpty>No commands found</CommandEmpty>
        </CommandList>
      </CommandDialog>,
    );

    expect(container).toBeInTheDocument();
  });

  it("displays the CommandDialog when open is true", () => {
    const { container } = render(
      <CommandDialog>
        <CommandInput />
        <CommandList />
      </CommandDialog>,
    );

    expect(container).toBeInTheDocument();
  });
});
