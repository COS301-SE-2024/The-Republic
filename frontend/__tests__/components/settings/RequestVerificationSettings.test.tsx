import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import RequestVerifications from "@/components/Settings/RequestVerification";

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  cn: (...classes: string[]) => classes.join(" "),
  signOutWithToast: jest.fn(),
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

describe("RequestVerifications", () => {
  it("renders form fields correctly", () => {
    const { getByLabelText, getByText } = render(<RequestVerifications />);

    expect(getByLabelText(/First Name\(s\)/i)).toBeInTheDocument();
    expect(getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(getByLabelText(/Name of Municipality/i)).toBeInTheDocument();
    expect(getByLabelText(/Office Address/i)).toBeInTheDocument();
    expect(getByLabelText(/Role at Municipality/i)).toBeInTheDocument();
    expect(getByLabelText(/Upload Proof of Employment/i)).toBeInTheDocument();
    expect(
      getByLabelText(/Upload Identification Document/i),
    ).toBeInTheDocument();
    expect(getByText(/Submit Request/i)).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    const { getByLabelText } = render(<RequestVerifications />);

    const firstNameInput = getByLabelText(/First Name\(s\)/i);
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");

    const lastNameInput = getByLabelText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(lastNameInput.value).toBe("Doe");
  });

  it("handles file input changes", () => {
    const { getByLabelText } = render(<RequestVerifications />);

    const proofFileInput = getByLabelText(/Upload Proof of Employment/i);
    const file = new File(["dummy content"], "proof.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(proofFileInput, { target: { files: [file] } });
    expect(proofFileInput.files[0]).toBe(file);
  });

  it("submits the form", () => {
    const { getByText } = render(<RequestVerifications />);
    const submitButton = getByText(/Submit Request/i);
    fireEvent.click(submitButton);
  });
});
