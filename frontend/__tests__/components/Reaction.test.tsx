import React from "react";
import { describe, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Reaction from "@/components/Reaction/Reaction";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest
        .fn()
        .mockResolvedValue({
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

describe("Reaction", () => {
  it("renders reaction buttons correctly", () => {
    render(<Reaction issueId={1} initialReactions={[]} userReaction={null} />);

    ["😠", "😃", "😢", "😟"].forEach((emoji) => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });
});
