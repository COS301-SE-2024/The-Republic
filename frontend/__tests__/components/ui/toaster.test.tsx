import React from "react";
import { render } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import { Toaster } from "@/components/ui/toaster";

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

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(() => ({
    toasts: [
      {
        id: "1",
        title: "Test Toast 1",
        description: "This is test toast 1",
        action: <button onClick={() => {}}>Action</button>,
      },
      {
        id: "2",
        title: "Test Toast 2",
        description: "This is test toast 2",
        action: null,
      },
    ],
  })),
}));

describe("<Toaster />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  it("renders toast notifications with action", () => {
    const { getByText } = render(<Toaster />);
    
    expect(getByText("Test Toast 1")).not.toBe(null);
    expect(getByText("This is test toast 1")).not.toBe(null);
    expect(getByText("Action")).not.toBe(null);
  });

  it("renders toast notifications without action", () => {
    const { getByText, queryByText } = render(<Toaster />);
    
    expect(getByText("Test Toast 2")).not.toBe(null);
    expect(getByText("This is test toast 2")).not.toBe(null);
  });
});
