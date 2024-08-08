import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import ReportsIcon from "@/components/icons/ReportsIcon";

describe("ReportsIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<ReportsIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});
