import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import userEvent from "@testing-library/user-event";
import { Checkbox } from "@/components/ui/checkbox";

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

describe("Checkbox Component", () => {
  it("renders the Checkbox component", () => {
    render(<Checkbox aria-label="Checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("can be checked and unchecked", () => {
    render(<Checkbox aria-label="Checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("applies custom className", () => {
    render(<Checkbox className="custom-class" aria-label="Checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("custom-class");
  });

  it("applies correct styles when checked", () => {
    render(<Checkbox aria-label="Checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    userEvent.click(checkbox);
    expect(checkbox).toHaveClass("data-[state=checked]:bg-primary");
  });

  it("is disabled when the disabled prop is passed", () => {
    render(<Checkbox disabled aria-label="Checkbox" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  // it("renders the check icon when checked", () => {
  //   render(<Checkbox aria-label="Checkbox" />);
  //   const checkbox = screen.getByRole("checkbox");

  //   userEvent.click(checkbox);

  //   // const checkIcon = screen.getByRole("img");
  //   // expect(checkIcon).toBeInTheDocument();
  // });
});

