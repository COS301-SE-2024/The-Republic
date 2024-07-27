import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import Reports from "@/components/ReportCharts/Reports";

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

jest.mock('lucide-react', () => ({
  Eye: () => <div>Eye Icon</div>,
  EyeOff: () => <div>EyeOff Icon</div>,
  Filter: () => <div>Filter Icon</div>,
}));

describe("Reports Component", () => {
  const mockSetSelectedCharts = jest.fn();

  it("renders all chart components when all are selected", () => {
    const allCharts = ["TransitionOfParliament", "BarChart", "RadarChart", "LineChart", "DonutChart", "StackedLineChart"];
    render(<Reports selectedCharts={allCharts} setSelectedCharts={mockSetSelectedCharts} />);
    
    allCharts.forEach(chartName => {
      expect(screen.getByText(`Mocked ${chartName}`)).toBeInTheDocument();
    });
  });

  it("renders filter button and opens filter menu", () => {
    render(<Reports selectedCharts={[]} setSelectedCharts={mockSetSelectedCharts} />);
    
    const filterButton = screen.getByText("Filter Charts");
    expect(filterButton).toBeInTheDocument();
    
    fireEvent.click(filterButton);
    
    expect(screen.getByText("Transition Of Parliament")).toBeInTheDocument();
    expect(screen.getByText("Bar Chart")).toBeInTheDocument();
    expect(screen.getByText("Radar Chart")).toBeInTheDocument();
  });

  it("toggles charts when filter buttons are clicked", () => {
    const initialSelectedCharts = ["BarChart", "LineChart"];
    render(<Reports selectedCharts={initialSelectedCharts} setSelectedCharts={mockSetSelectedCharts} />);
    
    const filterButton = screen.getByText("Filter Charts");
    fireEvent.click(filterButton);
    
    const donutChartButton = screen.getByText("Donut Chart");
    fireEvent.click(donutChartButton);
    
    expect(mockSetSelectedCharts).toHaveBeenCalled();
    
    const newSelectedCharts = mockSetSelectedCharts.mock.calls[0][0];
    
    expect(newSelectedCharts(initialSelectedCharts)).toEqual(expect.arrayContaining([...initialSelectedCharts, "DonutChart"]));
  });
});