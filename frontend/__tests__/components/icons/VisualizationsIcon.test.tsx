import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import VisualizationsIcon from "@/components/icons/VisualizationsIcon";

describe("VisualizationsIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<VisualizationsIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});
