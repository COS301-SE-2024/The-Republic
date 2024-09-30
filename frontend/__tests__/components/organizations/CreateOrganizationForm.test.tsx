import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import CreateOrganizationForm from "@/components/CreateOrganizationForm/CreateOrganizationForm";

// Mock the Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock the components from shadcn/ui
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props} />,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }: any) => (
    <select onChange={(e) => onValueChange(e.target.value)}>{children}</select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
  SelectTrigger: () => null,
  SelectValue: () => null,
}));

const mockOnCreate = jest.fn();
const mockOnClose = jest.fn();

describe("CreateOrganizationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly when open", () => {
    render(<CreateOrganizationForm isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    expect(screen.getByText("Create New Organization")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Website URL")).toBeInTheDocument();
    expect(screen.getByText("Join Policy")).toBeInTheDocument();
    expect(screen.getByText("Organization Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Profile Photo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<CreateOrganizationForm isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("submits the form with correct data when all fields are filled", async () => {
    render(<CreateOrganizationForm isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Org" } });
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testorg" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Test description" } });
    fireEvent.change(screen.getByLabelText("Website URL"), { target: { value: "https://testorg.com" } });

    // For select elements, we'll use the mocked select directly
    const joinPolicySelect = screen.getByText("Join Policy").nextElementSibling as HTMLSelectElement;
    fireEvent.change(joinPolicySelect, { target: { value: "request" } });

    const orgTypeSelect = screen.getByText("Organization Type").nextElementSibling as HTMLSelectElement;
    fireEvent.change(orgTypeSelect, { target: { value: "npo" } });

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText("Profile Photo"), { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
      const formData = mockOnCreate.mock.calls[0][0];
      expect(formData.get("name")).toBe("Test Org");
      expect(formData.get("username")).toBe("testorg");
      expect(formData.get("bio")).toBe("Test description");
      expect(formData.get("website_url")).toBe("https://testorg.com");
      expect(formData.get("join_policy")).toBe("request");
      expect(formData.get("org_type")).toBe("npo");
      expect(formData.get("profilePhoto")).toEqual(file);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("displays an error message when form submission fails", async () => {
    mockOnCreate.mockRejectedValueOnce(new Error("Submission failed"));

    render(<CreateOrganizationForm isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Org" } });
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "testorg" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getByText("Failed to create organization. Please try again.")).toBeInTheDocument();
    });
  });
});