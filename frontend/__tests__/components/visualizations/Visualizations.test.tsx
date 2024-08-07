import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import Visualizations from "@/components/Visualisations/Visualizations"; // Make sure the path is correct
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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

jest.mock("next/dynamic", () =>
  jest.fn(() => {
    const Component = () => <div>Mocked EChartsComponent</div>;
    Component.displayName = "EChartsComponent";
    return Component;
  }),
);

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("Visualizations Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the EChartsComponent component", () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { issueId: "1" },
      pathname: "/",
      route: "/",
      asPath: "/",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      isFallback: false,
    });

    const { container } = renderWithClient(<Visualizations />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Mocked EChartsComponent")).toBeInTheDocument();
  });
});
