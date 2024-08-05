import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import HelpMenu from "@/components/HelpMenu/Helpmenu";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("HelpMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders HelpMenu button", () => {
    const { getByTitle } = render(<HelpMenu />);
    expect(getByTitle("Toggle Help Menu")).toBeInTheDocument();
  });

  it("opens and closes HelpMenu on button click", () => {
    const { getByTitle, getByText, queryByText } = render(<HelpMenu />);
    const button = getByTitle("Toggle Help Menu");
    
    
    fireEvent.click(button);
    expect(getByText("Hello, How Can We Help You?")).toBeInTheDocument();
    
    
    fireEvent.click(button);
    expect(queryByText("Hello, How Can We Help You?")).not.toBeInTheDocument();
  });
});