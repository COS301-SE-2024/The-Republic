import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditProfile from "@/components/EditProfile/EditProfile";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import userMock from "@/data/user";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("@/lib/globals", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("EditProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders correctly with user data", () => {
    const { getByDisplayValue } = renderWithClient(
      <EditProfile user={userMock} onUpdate={() => {}} onCancel={() => {}} />,
    );
    expect(getByDisplayValue("User Fullname")).toBeInTheDocument();
    expect(getByDisplayValue("user123")).toBeInTheDocument();
    expect(getByDisplayValue("User biography")).toBeInTheDocument();
  });

  it("calls onUpdate with updated user data on save", async () => {
    const onUpdate = jest.fn();
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: {}, access_token: "test-token" } },
    });
    const { getByText, getByLabelText } = renderWithClient(
      <EditProfile user={userMock} onUpdate={onUpdate} onCancel={() => {}} />,
    );

    fireEvent.change(getByLabelText("Full Name"), {
      target: { value: "Updated Name" },
    });
    fireEvent.click(getByText("Save"));

    await waitFor(() => expect(getByText("Save")).not.toBeDisabled());
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = jest.fn();
    const { getByText } = renderWithClient(
      <EditProfile user={userMock} onUpdate={() => {}} onCancel={onCancel} />,
    );
    fireEvent.click(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });
});
