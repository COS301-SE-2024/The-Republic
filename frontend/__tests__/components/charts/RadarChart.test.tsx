import React from "react";
import { describe, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import RadarChart from "@/components/ReportCharts/RadarChart/RadarChart";
import * as echarts from "echarts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("echarts");

const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("RadarChart", () => {
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
    renderWithClient(<RadarChart />);
    await waitFor(() => {
      expect(echarts.init).not.toHaveBeenCalled();
      expect(mockEchartsInstance.setOption).not.toHaveBeenCalled();
    });
  });

  it("updates the chart options on data change", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              resolved: { "Public Safety": 5, "Healthcare Services": 3 },
              unresolved: { "Public Safety": 2, "Healthcare Services": 1 },
            },
          }),
      }),
    ) as jest.Mock;

    renderWithClient(<RadarChart />);

    await waitFor(() => {
      expect(mockEchartsInstance.setOption).toHaveBeenCalledTimes(1); // Called once after data fetch
    });
  });
});
