import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, beforeEach, it, jest } from "@jest/globals";
import ProfilePage from "@/app/(home)/profile/[userId]/page";
import { supabase } from "@/lib/globals";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/components/ProfileHeader/ProfileHeader", () =>
  jest.fn(() => <div>Mocked ProfileHeader</div>),
);
jest.mock("@/components/ProfileStats/ProfileStats", () =>
  jest.fn(() => <div>Mocked ProfileStats</div>),
);
jest.mock("@/components/ProfileFeed/ProfileFeed", () =>
  jest.fn(() => <div>Mocked ProfileFeed</div>),
);
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
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe("Profile Page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: { user: { id: "test-user" }, access_token: "test-token" },
      },
    } as never);
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                user_id: "1",
                is_owner: true,
                total_issues: 10,
                resolved_issues: 5,
              },
            }),
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: "OK",
          type: "basic",
          url: "",
        }) as Promise<Response>,
    );
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the ProfilePage with user data", async () => {
    (useParams as jest.Mock).mockReturnValue({ userId: "1" });

    const { container } = renderWithClient(<ProfilePage />);

    await waitFor(() =>
      expect(container).not.toBeNull(),
    );
  });

  it("renders the spinner when user data is not available", async () => {
    (useParams as jest.Mock).mockReturnValue({ userId: "1" });
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    } as never);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as never);

    renderWithClient(<ProfilePage />);

    await waitFor(() =>
      expect(screen.findByText(/Mocked ProfileHeader/)).not.toBeNull(),
    );
  });
});
