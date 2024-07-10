import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import React from "react";
import { Input } from "@/components/ui/input";

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

describe("<Input />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  it("renders with default props", () => {
    const { getByTestId } = render(<Input data-testid="input" />);
    const inputElement = getByTestId("input");

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe("INPUT");
    expect(inputElement).toHaveClass("h-10");
    expect(inputElement).toHaveClass("rounded-md");
  });

  it("renders with custom props", () => {
    const { getByTestId } = render(
      <Input data-testid="input" className="custom-class" type="email" />
    );
    const inputElement = getByTestId("input");

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass("custom-class"); // Ensure custom className prop is applied
    expect(inputElement.getAttribute("type")).toBe("email"); // Ensure type prop is correctly applied
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInTheDocument();
  });
});
