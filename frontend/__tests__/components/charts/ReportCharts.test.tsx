import { describe, expect } from "@jest/globals";
import * as AllExports from "@/components/ReportCharts/index";

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

describe("Component exports", () => {
  it("should export BarChart", () => {
    expect(AllExports.BarChart).toBeDefined();
  });

  it("should export DonutChart", () => {
    expect(AllExports.DonutChart).toBeDefined();
  });

  it("should export LineChart", () => {
    expect(AllExports.LineChart).toBeDefined();
  });

  it("should export RadarChart", () => {
    expect(AllExports.RadarChart).toBeDefined();
  });

  it("should export StackedLineChart", () => {
    expect(AllExports.StackedLineChart).toBeDefined();
  });

  it("should export TransitionOfParliament", () => {
    expect(AllExports.TransitionOfParliament).toBeDefined();
  });
});
