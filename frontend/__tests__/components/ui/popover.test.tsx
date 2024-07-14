import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { PopoverContent, Popover } from "@/components/ui/popover";

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

describe("<PopoverContent />", () => {
  it("renders with default props", () => {
    const { container } = render(
      <Popover>
        <PopoverContent data-testid="popover" />
      </Popover>,
    );

    expect(container).not.toBe(null);
  });

  it("renders with custom props", () => {
    const { container } = render(
      <Popover>
        <PopoverContent
          data-testid="popover"
          align="left"
          sideOffset={8}
          className="custom-class"
        />
      </Popover>,
    );

    expect(container).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Popover>
        <PopoverContent ref={ref} />
      </Popover>,
    );
    expect(container).toBeInTheDocument();
  });
});
