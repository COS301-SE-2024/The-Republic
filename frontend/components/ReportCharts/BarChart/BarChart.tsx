"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from 'next-themes';
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { reportCharts } from "@/lib/api/reportCharts";
import darkTheme from "@/lib/charts-dark-theme";
import lightTheme from "@/lib/charts-light-theme";

function BarChart() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { theme } = useTheme();

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

      const currentTheme = theme === 'dark' ? 'darkTheme' : 'lightTheme';
      echarts.registerTheme('lightTheme', lightTheme);
      echarts.registerTheme('darkTheme', darkTheme);

      chartInstance.current = echarts.init(
        document.querySelector("#barChart") as HTMLElement, currentTheme
      );

      chartInstance.current.setOption({
        title: {
          text: "Count of Resolved vs Unresolved Issues by Category",
          left: "center",
          top: "0%",
          textStyle: {
            fontSize: isMobile ? 12 : 18,
          },
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
          textStyle: {
            fontSize: isMobile ? 10 : 12,
          },
        },
        xAxis: {
          type: "category",
          data: labels,
          name: "Issue Categories (Status)",
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: {
            fontSize: isMobile ? 12 : 16,
            fontWeight: "bold",
          },
          axisLabel: {
            interval: 0,
            rotate: isMobile ? 45 : 0,
            fontSize: isMobile ? 8 : 12,
          },
        },
        yAxis: {
          type: "value",
          name: "Reported Issues Count",
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: {
            fontSize: isMobile ? 12 : 16,
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

      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [data, isMobile, theme]);

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
            <div className="col-lg-6 w-full">
              <div className="card">
                <div className="card-body">
                  <div
                    id="barChart"
                    style={{ height: isMobile ? "300px" : "400px" }}
                    className="echart w-full"
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