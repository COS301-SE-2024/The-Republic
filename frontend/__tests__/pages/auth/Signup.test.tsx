import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Signup from "@/app/(auth)/signup/page";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

jest.mock("@/lib/globals", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

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

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("Signup", () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (!message.includes("specific error message to ignore")) {
        // No action taken for the specific message
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Signup form", () => {
    render(<Signup />);
    expect(screen.getByLabelText(/fullname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it("allows user to type into the form fields", () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/fullname/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText(/fullname/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/username/i)).toHaveValue("johndoe");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });

  it('shows password when "Show" is clicked and hides it when "Hide" is clicked', () => {
    render(<Signup />);

    const passwordInput = screen.getByLabelText(/password/i);
    const showHideButton = screen.getByText(/show/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(showHideButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(showHideButton).toHaveTextContent("Hide");

    fireEvent.click(showHideButton);

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(showHideButton).toHaveTextContent("Show");
  });
});
