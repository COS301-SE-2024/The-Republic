import { describe } from "@jest/globals";
import { render } from "@testing-library/react";
import React from "react";
import LocationAutocomplete from "@/components/LocationAutocomplete/LocationAutocomplete";

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

describe("LocationAutocomplete", () => {
  it("renders without crashing", () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  });

  it("handles location selection", () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  });

  it("renders with a location prop", () => {
    const setLocation = jest.fn();
    const location = { label: "Test Location", value: { place_id: "123" } };
    render(<LocationAutocomplete location={location} setLocation={setLocation} />);
  });

});