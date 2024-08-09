import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Notifications from "@/components/Notifications/Notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import mockUser from "@/data/mockUser";
import { useUser } from "@/lib/contexts/UserContext";

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

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
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

describe("Notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders without crashing", () => {
    const { container } = renderWithClient(<Notifications />);
    expect(container).toBeInTheDocument();
  });
});
