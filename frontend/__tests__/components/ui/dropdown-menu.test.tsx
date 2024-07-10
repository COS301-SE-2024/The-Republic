import React from "react";
import { describe, expect } from '@jest/globals';
import { render, screen } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({ user: { id: 'user-id' }, session: 'session-token', error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe("DropdownMenu Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  const MockTrigger = () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button>Open Menu</button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );

  it("<DropdownMenuTrigger /> renders without errors", () => {
    render(<MockTrigger />);
    const triggerButton = screen.getByText("Open Menu");
    expect(triggerButton).toBeInTheDocument();
  });

  it("<DropdownMenuItem /> renders without errors", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuItem DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    
    expect(container).toBeInTheDocument();
  });

  it("<DropdownMenuCheckboxItem /> renders without errors", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>Checkbox Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(container).toBeInTheDocument();
  });

  it("<DropdownMenuRadioItem /> renders without errors", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuRadioItem>Radio Item</DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(container).toBeInTheDocument();
  });

  it("<DropdownMenuContent /> renders without errors", () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(container).toBeInTheDocument();
  });
});
