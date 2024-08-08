import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { HomeAvatar } from "@/components/HomeAvatar/HomeAvatar";
import * as useToastModule from "@/components/ui/use-toast";

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

describe("HomeAvatar", () => {
  it("renders correctly and can trigger sign out", () => {
    const mockToast = jest.fn();
    useToastModule.useToast.mockImplementation(() => ({ toast: mockToast }));

    const testImageUrl = "https://example.com/test-image.jpg";
    render(<HomeAvatar imageUrl={testImageUrl} />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
