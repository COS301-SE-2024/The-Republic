import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import Visualizations from "@/components/Visualisations/DotVisualizations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    const { container } = renderWithClient(<Visualizations />);
    expect(container).toBeInTheDocument();
  });
});
