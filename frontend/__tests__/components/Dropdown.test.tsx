import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import Dropdown from "@/components/Dropdown/Dropdown";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const options = {
  group: "Fruits",
  items: [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ],
};

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signUp: jest
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

describe("Dropdown", () => {
  it("renders correctly with placeholder", () => {
    const { getByText } = render(
      <Dropdown options={options} value="" onChange={() => {}} />,
    );
    expect(getByText("Select option...")).toBeInTheDocument();
  });

  it("shows options on click", () => {
    const { getByText, getByRole } = render(
      <Dropdown options={options} value="" onChange={() => {}} />,
    );
    fireEvent.click(getByRole("combobox"));
    expect(getByText("Apple")).toBeInTheDocument();
  });

  it("selects an option correctly", () => {
    const onChange = jest.fn();
    const { getByText, getByRole } = render(
      <Dropdown options={options} value="" onChange={onChange} />,
    );
    fireEvent.click(getByRole("combobox"));
    fireEvent.click(getByText("Apple"));
    expect(onChange).toHaveBeenCalledWith("apple");
  });
});
