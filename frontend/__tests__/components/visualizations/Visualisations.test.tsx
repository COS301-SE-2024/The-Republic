import React from "react";
import { describe, expect, jest, it, beforeEach, afterEach } from "@jest/globals";
import { render, waitFor, act } from "@testing-library/react";
import EChartsComponent from "@/components/Visualisations/DotVisualizations";
import * as echarts from "echarts";
import mockData from "@/data/dot";

// Mock echarts
jest.mock('echarts', () => ({
  init: jest.fn(),
}));

// Improved d3 mock
const mockStratify = jest.fn().mockReturnValue({
  parentId: jest.fn().mockReturnThis(),
  sum: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  descendants: jest.fn().mockReturnValue([]),
});

const mockPack = jest.fn().mockReturnValue(jest.fn().mockReturnValue({
  descendants: jest.fn().mockReturnValue([]),
}));

jest.mock('d3', () => ({
  stratify: () => mockStratify,
  pack: () => mockPack,
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
      signIn: jest.fn().mockResolvedValue({ user: null, session: null, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe("EChartsComponent", () => {
  const mockEchartsInstance = {
    setOption: jest.fn(),
    dispose: jest.fn(),
    getZr: jest.fn().mockReturnValue({
      on: jest.fn(),
    }),
    on: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (echarts.init as jest.Mock).mockReturnValue(mockEchartsInstance);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockData }),
      })
    ) as jest.Mock;
  });

  it("renders loading spinner initially", async () => {
    const { getByTestId } = render(<EChartsComponent />);
    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // it("renders chart after data fetching and sets options", async () => {
  //   const { getByTestId } = render(<EChartsComponent />);

  //   await waitFor(() => {
  //     expect(getByTestId("echarts-container")).toBeInTheDocument();
  //   }, { timeout: 10000 });

  //   expect(echarts.init).toHaveBeenCalled();
  //   expect(mockEchartsInstance.setOption).toHaveBeenCalled();
  // }, 15000);

  // it("sets up click event listeners", async () => {
  //   render(<EChartsComponent />);

  //   await waitFor(() => {
  //     expect(mockEchartsInstance.on).toHaveBeenCalledWith(
  //       "click",
  //       { seriesIndex: 0 },
  //       expect.any(Function)
  //     );
  //     expect(mockEchartsInstance.getZr().on).toHaveBeenCalledWith(
  //       "click",
  //       expect.any(Function)
  //     );
  //   }, { timeout: 10000 });
  // }, 15000);

  // it("cleans up chart on unmount", async () => {
  //   // const { getByTestId, unmount } = render(<EChartsComponent />);

  //   // await waitFor(() => {
  //   //   expect(getByTestId("echarts-container")).toBeInTheDocument();
  //   // }, { timeout: 10000 });

  //   act(() => {
  //     unmount();
  //   });

  //   expect(mockEchartsInstance.dispose).toHaveBeenCalled();
  // }, 15000);

  it("handles API error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as jest.Mock;

    console.error = jest.fn();

    render(<EChartsComponent />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(500);
    }, { timeout: 10000 });
  }, 15000);
});
