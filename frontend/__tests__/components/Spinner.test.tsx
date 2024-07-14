import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { LoadingSpinner } from "@/components/Spinner/Spinner";

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

describe("LoadingSpinner", () => {
  it("renders the spinner SVG correctly", () => {
    render(<LoadingSpinner />);
    const svgElement = screen.getByRole("img", { hidden: true });
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("animate-spin");
    expect(svgElement).toHaveAttribute("fill", "none");
    expect(svgElement).toHaveAttribute("height", "24");
    expect(svgElement).toHaveAttribute("stroke", "currentColor");
    expect(svgElement).toHaveAttribute("stroke-linecap", "round");
    expect(svgElement).toHaveAttribute("stroke-linejoin", "round");
    expect(svgElement).toHaveAttribute("stroke-width", "2");
    expect(svgElement).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svgElement).toHaveAttribute("width", "24");
    expect(svgElement).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    const pathElement = svgElement.querySelector("path");
    expect(pathElement).toHaveAttribute("d", "M21 12a9 9 0 1 1-6.219-8.56");
  });

  it("applies additional className prop if provided", () => {
    const additionalClass = "extra-class";
    render(<LoadingSpinner className={additionalClass} />);
    const svgElement = screen.getByRole("img", { hidden: true });
    expect(svgElement).toHaveClass("animate-spin", additionalClass);
  });
});
