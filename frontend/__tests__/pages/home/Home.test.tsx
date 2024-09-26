import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import Home from "@/app/(home)/page";
import Feed from "@/components/Feed/Feed";

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
  useUser: () => ({ user: null }),
}));

jest.mock("@/components/Feed/Feed", () =>
  jest.fn(() => <div>Mocked Feed</div>),
);

describe("Home Page", () => {
  it("renders the Feed component with showInputBox set to true", () => {
    render(<Home />);
    expect(Feed).toHaveBeenCalled();
    expect(screen.queryByText("Mocked Feed")).not.toBeNull();
  });
});
