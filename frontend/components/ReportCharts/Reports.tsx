"use client";

import React, { useState, FC } from "react";
import {
  BarChart,
  DonutChart,
  LineChart,
  RadarChart,
  StackedLineChart,
  TransitionOfParliament,
} from "@/components/ReportCharts";
import { Eye, EyeOff, Filter } from 'lucide-react';

type ChartComponentType = FC<Record<string, never>> | (() => JSX.Element);

const chartComponents: Record<string, ChartComponentType> = {
  TransitionOfParliament,
  BarChart,
  RadarChart,
  LineChart,
  DonutChart,
  StackedLineChart,
};

interface ReportsProps {
  selectedCharts: string[];
  setSelectedCharts: React.Dispatch<React.SetStateAction<string[]>>;
}

function Reports({ selectedCharts, setSelectedCharts }: ReportsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleChart = (chartName: string) => {
    setSelectedCharts((prev: string[]) =>
      prev.includes(chartName)
        ? prev.filter((chart: string) => chart !== chartName)
        : [...prev, chartName]
    );
  };

  return (
    <section className="section align-center mb-5">
      <h3 className="mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-4xl dark:text-white text-center">
        Comprehensive{" "}
        <span className="text-green-600 dark:text-green-500">Report</span> on
        Issues.
      </h3>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
        This page provides an overview of various metrics and trends related to key issues facing South Africa. Use the filter to customize your view.
      </p>
      
      <div className="mb-6 flex justify-end relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filter Charts
        </button>
        
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md z-10">
            <div className="flex flex-col gap-2">
              {Object.keys(chartComponents).map((chartName) => (
                <button
                  key={chartName}
                  onClick={() => toggleChart(chartName)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 flex items-center justify-between ${
                    selectedCharts.includes(chartName)
                      ? "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <span>{chartName.replace(/([A-Z])/g, " $1").trim()}</span>
                  {selectedCharts.includes(chartName) ? (
                    <Eye className="h-4 w-4 ml-2" />
                  ) : (
                    <EyeOff className="h-4 w-4 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {Object.keys(chartComponents).map((chartName) => {
          const ChartComponent = chartComponents[chartName];
          const isVisible = selectedCharts.includes(chartName);
          
          if (!isVisible) return null;

          return (
            <div key={chartName} className="relative">
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => toggleChart(chartName)}
                  className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <ChartComponent />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Reports;