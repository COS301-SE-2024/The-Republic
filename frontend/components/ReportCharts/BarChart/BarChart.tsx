"use client";

import React, { useEffect } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

import { reportCharts } from "@/lib/api/reportCharts";

function BarChart() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
  const {
    data,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
  } = useQuery({
    queryKey: [`chart_data`],
    queryFn: () => reportCharts(url),
    enabled: true,
  });

  useEffect(() => {
    if (!isLoadingCharts && !isErrorCharts) {
      let labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      let unresolvedData = [120, 200, 150, 80, 70, 110, 130];
      let resolverData = [60, 140, 180, 100, 60, 80, 70];

      if (data && "resolved" in data && "unresolved" in data) {
        const resolvedEntries: { [key: string]: number } = data.resolved;
        const unresolvedEntries: { [key: string]: number } = data.unresolved;

        const combinedCategories = new Set([
          ...Object.keys(resolvedEntries),
          ...Object.keys(unresolvedEntries),
        ]);

        labels = Array.from(combinedCategories);
        unresolvedData = labels.map(
          (label) => Number(unresolvedEntries[label]) || 0,
        );
        resolverData = labels.map(
          (label) => Number(resolvedEntries[label]) || 0,
        );
      }

      const barChart = echarts.init(
        document.querySelector("#barChart") as HTMLElement,
      );
      barChart.setOption({
        title: {
          text: "Count of Resolved vs Unresolved Issues by Category",
          left: "center",
          top: "0%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["Unresolved", "Resolved"],
          top: "8%",
        },
        xAxis: {
          type: "category",
          data: labels,
          name: "Issue Categories (Status)",
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        yAxis: {
          type: "value",
          name: "Reported Issues Count",
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        series: [
          {
            name: "Unresolved",
            data: unresolvedData,
            type: "bar",
            color: "#ee6666",
          },
          {
            name: "Resolved",
            data: resolverData,
            type: "bar",
            color: "#91cc75",
          },
        ],
      });
    }
  }, [data]);

  return (
    <>
      {!isErrorCharts ? (
        <>
          {isLoadingCharts ? (
            <div
              className="flex justify-center items-center"
              style={{ height: "200px" }}
            >
              <FaSpinner className="animate-spin text-4xl text-green-500" />
            </div>
          ) : (
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div
                    id="barChart"
                    style={{ minHeight: "400px" }}
                    className="echart"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default BarChart;
