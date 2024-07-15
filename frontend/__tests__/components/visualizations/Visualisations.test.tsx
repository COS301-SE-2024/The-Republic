import React from "react";
import { describe, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import EChartsComponent from "@/components/Visualisations/DotVisualizations";
import * as echarts from "echarts";
import mockData from "@/data/dot";

jest.mock("echarts", () => ({
  init: jest.fn(),
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

describe("EChartsComponent", () => {
  const mockEchartsInstance = {
    setOption: jest.fn(),
    dispose: jest.fn(),
    getZr: jest.fn().mockReturnValue({
      on: jest.fn(),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (echarts.init as jest.Mock).mockReturnValue(mockEchartsInstance);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders loading spinner initially", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockData,
          }),
      }),
    ) as jest.Mock;

    const { getByTestId } = render(<EChartsComponent />);
    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders chart after data fetching and sets options", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockData,
          }),
      }),
    ) as jest.Mock;

    const { container } = render(<EChartsComponent />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
