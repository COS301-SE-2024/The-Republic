import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Signup from "@/app/(auth)/signup/page";

// Mock the necessary dependencies
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn().mockReturnValue({ toast: jest.fn() }),
}));

jest.mock("@/lib/globals", () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

describe("Signup component", () => {
  it("renders Signup form", () => {
    render(<Signup />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("allows user to type into the form fields", () => {
    render(<Signup />);
    const fullnameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(fullnameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(fullnameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(usernameInput).toHaveValue("johndoe");
    expect(passwordInput).toHaveValue("password123");
  });

  // it("toggles password visibility", () => {
  //   render(<Signup />);
  //   const passwordInput = screen.getByLabelText(/password/i);
  //   const toggleButton = screen.getByRole("button", { name: "" });

  //   expect(passwordInput).toHaveAttribute("type", "password");
  //   fireEvent.click(toggleButton);
  //   expect(passwordInput).toHaveAttribute("type", "text");
  //   fireEvent.click(toggleButton);
  //   expect(passwordInput).toHaveAttribute("type", "password");
  // });
});