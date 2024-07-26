import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import Page from "@/components/ReportCharts/Reports";

jest.mock("@/components/ReportCharts", () => ({
  BarChart: jest.fn(() => <div>Mocked BarChart</div>),
  DonutChart: jest.fn(() => <div>Mocked DonutChart</div>),
  LineChart: jest.fn(() => <div>Mocked LineChart</div>),
  RadarChart: jest.fn(() => <div>Mocked RadarChart</div>),
  StackedLineChart: jest.fn(() => <div>Mocked StackedLineChart</div>),
  TransitionOfParliament: jest.fn(() => (
    <div>Mocked TransitionOfParliament</div>
  )),
}));

describe("Report Page", () => {
  it("renders all chart components", () => {
    render(<Page />);
    expect(screen.getByText("Mocked BarChart")).not.toBeNull();
    expect(screen.getByText("Mocked DonutChart")).not.toBeNull();
    expect(screen.getByText("Mocked LineChart")).not.toBeNull();
    expect(screen.getByText("Mocked RadarChart")).not.toBeNull();
    expect(screen.getByText("Mocked StackedLineChart")).not.toBeNull();
    expect(screen.getByText("Mocked TransitionOfParliament")).not.toBeNull();
  });
});
