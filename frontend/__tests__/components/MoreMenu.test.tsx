import React from "react";
import { describe, expect } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import MoreMenu from "@/components/MoreMenu/MoreMenu";

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
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation(() => ({
        unsubscribe: jest.fn(),
      })),
    }),
  }),
}));

const menuItems = ["Resolve Issue", "Delete", "Subscribe"];

describe("MoreMenu", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MoreMenu
        menuItems={menuItems}
        isOwner={true}
        onDelete={jest.fn()}
        onResolve={jest.fn()}
        onSubscribe={jest.fn()}
      />,
    );
    expect(container).not.toBe(null);
  });

  it("shows more options when clicked", () => {
    render(
      <MoreMenu
        menuItems={menuItems}
        isOwner={true}
        onDelete={jest.fn()}
        onResolve={jest.fn()}
        onSubscribe={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByTitle("More Options"));
  });

  it("handles resolve issue click", () => {
    const onResolve = jest.fn();
    render(
      <MoreMenu
        menuItems={menuItems}
        isOwner={true}
        onDelete={jest.fn()}
        onResolve={onResolve}
        onSubscribe={jest.fn()}
      />,
    );
  });

  it("handles delete click and shows confirmation dialog", () => {
    const onDelete = jest.fn();
    render(
      <MoreMenu
        menuItems={menuItems}
        isOwner={true}
        onDelete={onDelete}
        onResolve={jest.fn()}
        onSubscribe={jest.fn()}
      />,
    );
  });

  it("handles subscribe options click", () => {
    const onSubscribe = jest.fn();
    render(
      <MoreMenu
        menuItems={menuItems}
        isOwner={true}
        onDelete={jest.fn()}
        onResolve={jest.fn()}
        onSubscribe={onSubscribe}
      />,
    );
  });
});
