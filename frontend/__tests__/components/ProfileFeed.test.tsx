import React from "react";
import { describe } from "@jest/globals";
import { render } from "@testing-library/react";
import ProfileFeed from "@/components/ProfileFeed/ProfileFeed";
import { useUser } from "@/lib/contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import mockUser from "@/data/mockUser";

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
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

jest.mock("@/lib/globals", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "1" }, access_token: "token" } },
      }),
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

describe("ProfileFeed", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders loading indicator correctly", () => {
    renderWithClient(<ProfileFeed userId="1" selectedTab="issues" />);
  });
});
