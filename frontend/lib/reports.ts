interface TransitionOfParliamentItem {
  value: number;
  name: string;
}

type TransitionOfParliamentModel = TransitionOfParliamentItem[];

interface StackedLineChartItem {
  name: string;
  data: number[];
}

type StackedLineChartModel = StackedLineChartItem[];

interface RadarChartIndicator {
  name: string;
  max: number;
}

interface RadarChartSeriesData {
  value: number[];
  name: string;
}

interface RadarChartSeries {
  name: string;
  type: string;
  data: RadarChartSeriesData[];
}

interface RadarChartModel {
  radar: {
    indicator: RadarChartIndicator[];
  };
  series: RadarChartSeries[];
}

interface BarAndLineChartModel {
  day: string[];
  data: number[];
}

interface DonutChartDataItem {
  value: number;
  name: string;
}

type DonutChartDataModel = DonutChartDataItem[];

// Pydantic

interface Counts {
  [key: string]: number;
}

interface CatCounts {
  [resolutionStatus: string]: {
    [category: string]: number;
  };
}

interface CatIssue {
  resolved_at: string | null;
  category: string;
}

interface CategoryCounts {
  [categoryName: string]: Counts;
}

interface Issue {
  id: number;
  category: {
    name: string;
  };
  location: {
    suburb: string;
    city: string;
    province: string;
  };
}

interface GroupedIssuesResponse {
  resolved: Issue[];
  unresolved: Issue[];
}

interface ResolutionStatusCounts {
  resolved: number;
  unresolved: number;
}

interface DataItem {
  value: number;
  name: string;
}

interface DataItem2 {
  max: number;
  name: string;
}

interface GroupedCategoryCount {
  [categoryName: string]: number;
}

interface IssuesGroupedByDate {
  [date: string]: Issue[];
}

interface IssuesGroupedByCategory {
  [categoryName: string]: Issue[];
}

interface CategoryAndDateCount {
  [categoryName: string]: {
    [date: string]: number;
  };
}

export type {
  TransitionOfParliamentModel,
  BarAndLineChartModel,
  StackedLineChartModel,
  RadarChartModel,
  DonutChartDataModel,
  Counts,
  CatCounts,
  CatIssue,
  CategoryCounts,
  DataItem,
  DataItem2,
  Issue,
  GroupedIssuesResponse,
  ResolutionStatusCounts,
  GroupedCategoryCount,
  IssuesGroupedByDate,
  IssuesGroupedByCategory,
  CategoryAndDateCount,
};
