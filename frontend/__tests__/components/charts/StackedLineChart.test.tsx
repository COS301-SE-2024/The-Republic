import React from "react";
import { describe, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import StackedLineChart from "@/components/ReportCharts/StackedLineChart/StackedLineChart";
import * as echarts from "echarts";

jest.mock("echarts");

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

describe("StackedLineChart", () => {
  const mockEchartsInstance = {
    setOption: jest.fn(),
    dispose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (echarts.init as jest.Mock).mockReturnValue(mockEchartsInstance);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the chart and sets options correctly", async () => {
    render(<StackedLineChart />);
    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalled();
      expect(mockEchartsInstance.setOption).toHaveBeenCalled();
    });
  });

  it("updates the chart options on data change", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              "Public Safety": { "2023-07-01": 5, "2023-07-02": 10 },
              Water: { "2023-07-01": 2, "2023-07-02": 3 },
            },
          }),
      }),
    ) as jest.Mock;

    render(<StackedLineChart />);

    await waitFor(() => {
      expect(mockEchartsInstance.setOption).toHaveBeenCalledTimes(1); // Called once after data fetch
    });
  });
});
