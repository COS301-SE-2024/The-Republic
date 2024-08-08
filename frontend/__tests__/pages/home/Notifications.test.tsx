import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import NotificationsPage from "@/app/(home)/notifications/page";

jest.mock("@/components/Notifications/Notifications", () =>
  jest.fn(() => <div>Mocked Notifications</div>),
);

describe("Notifications Page", () => {
  it("renders the Notifications component", () => {
    render(<NotificationsPage />);
    expect(screen.getByText("Mocked Notifications")).not.toBeNull();
  });
});
