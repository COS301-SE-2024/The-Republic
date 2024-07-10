import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, expect } from '@jest/globals';
import { Switch } from "@/components/ui/switch";

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

describe("<Switch />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  it("renders default switch correctly", () => {
    const { getByRole } = render(<Switch checked={false} onCheckedChange={() => {}} />);
    const switchElement = getByRole("switch");

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveClass("bg-slate-200"); // Ensure default variant
    expect(switchElement).not.toHaveClass("bg-slate-900"); // Ensure checked variant is not applied
  });

  it("renders checked switch correctly", () => {
    const { getByRole } = render(<Switch checked={true} onCheckedChange={() => {}} />);
    const switchElement = getByRole("switch");

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveClass("bg-slate-900"); // Ensure checked variant
    expect(switchElement).not.toHaveClass("bg-slate-200"); // Ensure default variant is not applied
  });

  it("calls onCheckedChange callback when clicked", () => {
    const mockOnCheckedChange = jest.fn();
    const { getByRole } = render(<Switch checked={false} onCheckedChange={mockOnCheckedChange} />);
    const switchElement = getByRole("switch");

    fireEvent.click(switchElement);

    expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
    expect(mockOnCheckedChange).toHaveBeenCalledWith(true); // Ensure callback was called with expected value
  });

  it("does not call onCheckedChange callback when disabled", () => {
    const mockOnCheckedChange = jest.fn();
    const { getByRole } = render(<Switch checked={false} onCheckedChange={mockOnCheckedChange} disabled />);
    const switchElement = getByRole("switch");

    fireEvent.click(switchElement);

    expect(mockOnCheckedChange).not.toHaveBeenCalled(); // Ensure callback was not called
  });
});
