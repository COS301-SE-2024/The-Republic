'use client';

import {
  BarChart,
  DonutChart,
  LineChart,
  RadarChart,
  StackedLineChart,
  TransitionOfParliament, 
} from "@/components/ReportCharts";

import React from "react";

function Page() {
  return (
    <section className="section">
      <div className="row">
        <StackedLineChart />
        <TransitionOfParliament />
        <BarChart />
        <RadarChart />
        <LineChart />
        <DonutChart />
      </div>
    </section>
  );
}

export default Page;
