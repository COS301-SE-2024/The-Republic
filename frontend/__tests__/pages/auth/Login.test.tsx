import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import Login from "@/app/(auth)/login/page";

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockImplementation(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signUp: jest
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

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (!message.includes("specific error message to ignore")) {
        // No action taken for the specific message
      }
    });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders Login form", () => {
    render(<Login />);
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByText("Show"));
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("allows user to type into the form fields", () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });
});
