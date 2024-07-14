import React from "react";
import { render } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import LogoutIcon from "@/components/icons/LogoutIcon";

describe("LogoutIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<LogoutIcon />);
    expect(container.firstChild).not.toBeNull();
  });
});
