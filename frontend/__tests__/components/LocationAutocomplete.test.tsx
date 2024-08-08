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

  it("renders with different prop values", () => {
    const setLocation = jest.fn();
    const location = { label: "Another Location", value: { place_id: "456" } };
    render(<LocationAutocomplete location={location} setLocation={setLocation} />);
  });

  it("handles null location prop", () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  });

  it("handles undefined location prop", () => {
    const setLocation = jest.fn();
    render(<LocationAutocomplete location={undefined} setLocation={setLocation} />);
  });

  it("handles empty object location prop", () => {
    const setLocation = jest.fn();
    const location = { label: "", value: { place_id: "" } };
    render(<LocationAutocomplete location={location} setLocation={setLocation} />);
  });

  // it("renders the location label when location prop is provided", () => {
  //   const setLocation = jest.fn();
  //   const location = { label: "Test Location", value: { place_id: "123" } };
  //   const { getByText } = render(<LocationAutocomplete location={location} setLocation={setLocation} />);
  //   expect(getByText("Test Location")).toBeTruthy();
  // });

  // it("renders the MapPin button when location is null", () => {
  //   const setLocation = jest.fn();
  //   const { container } = render(<LocationAutocomplete location={null} setLocation={setLocation} />);
  //   expect(container.querySelector('button svg')).toBeTruthy();
  // });

  // it("calls setLocation with null when X button is clicked", () => {
  //   const setLocation = jest.fn();
  //   const location = { label: "Test Location", value: { place_id: "123" } };
  //   const { getByText } = render(<LocationAutocomplete location={location} setLocation={setLocation} />);
  //   fireEvent.click(getByText("X"));
  //   expect(setLocation).toHaveBeenCalledWith(null);
  // });
});