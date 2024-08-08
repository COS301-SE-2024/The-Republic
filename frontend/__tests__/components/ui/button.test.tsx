import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { Button, buttonVariants } from "@/components/ui/button";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({
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

describe("Button Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("renders Button with default variant and size correctly", () => {
    const { container } = render(<Button>Default Button</Button>);
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Button with secondary variant and large size correctly", () => {
    const { container } = render(
      <Button variant="secondary" size="lg">
        Large Secondary Button
      </Button>,
    );
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Button with outline variant and small size correctly", () => {
    const { container } = render(
      <Button variant="outline" size="sm">
        Small Outline Button
      </Button>,
    );
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Button with ghost variant correctly", () => {
    const { container } = render(<Button variant="ghost">Ghost Button</Button>);
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Button with link variant correctly", () => {
    const { container } = render(<Button variant="link">Link Button</Button>);
    expect(container.firstChild).not.toBe(null);
  });
});

describe("buttonVariants Function", () => {
  test("returns default variant and size styles correctly", () => {
    const defaultStyles = buttonVariants({
      variant: "default",
      size: "default",
    });
    expect(defaultStyles).toContain("bg-primary");
    expect(defaultStyles).toContain("text-primary-foreground");
    expect(defaultStyles).toContain("h-10");
    expect(defaultStyles).toContain("px-4");
    expect(defaultStyles).toContain("py-2");
  });

  test("returns secondary variant and large size styles correctly", () => {
    const secondaryLargeStyles = buttonVariants({
      variant: "secondary",
      size: "lg",
    });
    expect(secondaryLargeStyles).toContain("bg-secondary");
    expect(secondaryLargeStyles).toContain("text-secondary-foreground");
    expect(secondaryLargeStyles).toContain("h-11");
    expect(secondaryLargeStyles).toContain("px-8");
  });

  test("returns outline variant and small size styles correctly", () => {
    const outlineSmallStyles = buttonVariants({
      variant: "outline",
      size: "sm",
    });
    expect(outlineSmallStyles).toContain("border-input");
    expect(outlineSmallStyles).toContain("bg-background");
    expect(outlineSmallStyles).toContain("hover:bg-accent");
    expect(outlineSmallStyles).toContain("hover:text-accent-foreground");
    expect(outlineSmallStyles).toContain("h-9");
    expect(outlineSmallStyles).toContain("px-3");
  });
});
