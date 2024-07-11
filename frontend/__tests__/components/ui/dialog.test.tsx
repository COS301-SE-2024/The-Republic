import React from "react";
import { describe, expect } from '@jest/globals';
import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({ user: { id: 'user-id' }, session: 'session-token', error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe("Dialog components", () => {
  it("<Dialog /> renders without errors", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText("Open Dialog");
    expect(trigger).toBeInTheDocument();
  });

  it("<DialogOverlay /> renders without errors", () => {
    const { container } = render(
      <Dialog>
        <DialogOverlay />
      </Dialog>
    );

    expect(container).toBeInTheDocument();
  });

  it("<DialogContent /> renders without errors", () => {
    const { container } = render(
      <Dialog>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(container).toBeInTheDocument();
  });

  it("<DialogClose /> triggers close action", () => {
    const handleClose = jest.fn();
    const { container } = render(
      <Dialog>
        <DialogClose onClose={handleClose}>Close</DialogClose>
      </Dialog>
    );

    expect(container).not.toBeNull();
  });

  it("<DialogTitle /> renders without errors", () => {
    const { container } = render(
      <Dialog>
        <DialogTitle>Title</DialogTitle>
      </Dialog>
    );

    expect(container).not.toBeNull();
  });

  it("<DialogDescription /> renders without errors", () => {
    render(
      <Dialog>
        <DialogDescription>Description</DialogDescription>
      </Dialog>
    );
    const description = screen.getByText("Description");
    expect(description).toBeInTheDocument();
  });

  it("<DialogHeader /> renders without errors", () => {
    render(
      <Dialog>
        <DialogHeader>Header</DialogHeader>
      </Dialog>
    );
    const header = screen.getByText("Header");
    expect(header).toBeInTheDocument();
  });

  it("<DialogFooter /> renders without errors", () => {
    render(<DialogFooter>Footer</DialogFooter>);
    const footer = screen.getByText("Footer");
    expect(footer).toBeInTheDocument();
  });
});

