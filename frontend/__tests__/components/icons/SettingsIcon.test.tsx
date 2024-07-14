import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import SettingsIcon from "@/components/icons/SettingsIcon";

describe("SettingsIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<SettingsIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});
