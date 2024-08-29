import React from "react";
import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
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

jest.mock("framer-motion", () => ({
  motion: {
    h1: jest.fn().mockImplementation(({ children, ...props }) => (
      <h1 {...props}>{children}</h1>
    )),
    div: jest.fn().mockImplementation(({ children, ...props }) => (
      <div {...props}>{children}</div>
    )),
  },
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Signup form", () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Choose a username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Create a strong password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it("allows user to type into the form fields", () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Choose a username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Create a strong password/i), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText(/Enter your full name/i)).toHaveValue("John Doe");
    expect(screen.getByPlaceholderText(/Enter your email/i)).toHaveValue("john@example.com");
    expect(screen.getByPlaceholderText(/Choose a username/i)).toHaveValue("johndoe");
    expect(screen.getByPlaceholderText(/Create a strong password/i)).toHaveValue("password123");
  });

  it('toggles password visibility when the eye icon is clicked', () => {
    render(<Signup />);

    const passwordInput = screen.getByPlaceholderText(/Create a strong password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "password");
  });
});