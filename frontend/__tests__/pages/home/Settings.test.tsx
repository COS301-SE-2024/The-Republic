import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import Home from "@/app/(home)/settings/page";

jest.mock("@/components/Settings/Settings", () =>
  jest.fn(() => <div>Mocked Settings</div>),
);

describe("Settings Page", () => {
  it("renders the Settings component", () => {
    render(<Home />);
    expect(screen.getByText("Mocked Settings")).not.toBeNull();
  });
});
