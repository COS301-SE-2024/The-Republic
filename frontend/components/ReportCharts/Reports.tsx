"use client";

import {
  BarChart,
  DonutChart,
  LineChart,
  RadarChart,
  StackedLineChart,
  TransitionOfParliament,
} from "@/components/ReportCharts";

import React from "react";

function Reports() {
  return (
    <section className="section align-center mb-5">
      <h3 className="mb-10 text-3xl font-extrabold leading-none tracking-tight text-gray-700 md:text-3xl lg:text-4xl dark:text-white text-center">
        Comprehensive{" "}
        <span className="text-green-600 dark:text-green-500">Report</span> on
        Issues.
      </h3>
      <div className="row">
        <TransitionOfParliament />
        <BarChart />
        <RadarChart />
        <LineChart />
        <DonutChart />
        <StackedLineChart />
      </div>
    </section>
  );
}

export default Reports;
