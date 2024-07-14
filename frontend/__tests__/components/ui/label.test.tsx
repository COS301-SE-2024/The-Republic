import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import { Label } from "@/components/ui/label";

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

describe("<Label />", () => {
  it("renders with default props", () => {
    const { getByTestId } = render(
      <Label data-testid="label">Example Label</Label>,
    );
    const labelElement = getByTestId("label");

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent("Example Label");
    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass("font-medium");
  });

  it("renders with custom props", () => {
    const { getByTestId } = render(
      <Label data-testid="label" className="custom-class">
        Custom Label
      </Label>,
    );
    const labelElement = getByTestId("label");

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent("Custom Label");
    expect(labelElement).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInTheDocument();
  });
});
