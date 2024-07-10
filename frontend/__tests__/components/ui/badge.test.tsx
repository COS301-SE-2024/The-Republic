import React from "react";
import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import { Badge, badgeVariants } from "@/components/ui/badge";

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

describe("Badge Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  test("renders Badge with default variant correctly", () => {
    const { container } = render(<Badge>Hello Badge</Badge>);
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Badge with secondary variant correctly", () => {
    const { container } = render(<Badge variant="secondary">Hello Badge</Badge>);
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Badge with destructive variant correctly", () => {
    const { container } = render(<Badge variant="destructive">Hello Badge</Badge>);
    expect(container.firstChild).not.toBe(null);
  });

  test("renders Badge with outline variant correctly", () => {
    const { container } = render(<Badge variant="outline">Hello Badge</Badge>);
    expect(container.firstChild).not.toBe(null);
  });
});

describe("badgeVariants Function", () => {
  test("returns default variant styles correctly", () => {
    const defaultVariantStyles = badgeVariants({ variant: "default" });
    expect(defaultVariantStyles).toContain("border-transparent");
    expect(defaultVariantStyles).toContain("bg-primary");
    expect(defaultVariantStyles).toContain("text-primary-foreground");
  });

  test("returns secondary variant styles correctly", () => {
    const secondaryVariantStyles = badgeVariants({ variant: "secondary" });
    expect(secondaryVariantStyles).toContain("border-transparent");
    expect(secondaryVariantStyles).toContain("bg-secondary");
    expect(secondaryVariantStyles).toContain("text-secondary-foreground");
  });

  test("returns destructive variant styles correctly", () => {
    const destructiveVariantStyles = badgeVariants({ variant: "destructive" });
    expect(destructiveVariantStyles).toContain("border-transparent");
    expect(destructiveVariantStyles).toContain("bg-destructive");
    expect(destructiveVariantStyles).toContain("text-destructive-foreground");
  });

  test("returns outline variant styles correctly", () => {
    const outlineVariantStyles = badgeVariants({ variant: "outline" });
    expect(outlineVariantStyles).toContain("text-foreground");
  });
});
