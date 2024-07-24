"use client";

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { DataItem2 } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

import { reportCharts } from "@/lib/api/reportCharts";

function RadarChart() {
  const [indicators, setIndicators] = useState<DataItem2[]>([]);
  const [unresolvedData, setUnResolvedData] = useState<number[]>([]);
  const [resolvedData, setResolvedData] = useState<number[]>([]);
  
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
  const { data, isLoading: isLoadingCharts, isError: isErrorCharts } = useQuery({
    queryKey: [`chart_data`],
    queryFn: () => reportCharts(url),
    enabled: true,
  });
  
  useEffect(() => {
    if (data && "resolved" in data && "unresolved" in data) {
      const resolvedEntries = data.resolved;
      const unresolvedEntries = data.unresolved;

      const combined = Array.from(
        new Set([
          ...Object.keys(resolvedEntries),
          ...Object.keys(unresolvedEntries),
        ]),
      );
      const resolved = combined.map(
        (label) => Number(resolvedEntries[label]) || 0,
      );
      const unResolved = combined.map(
        (label) => Number(unresolvedEntries[label]) || 0,
      );

      setResolvedData(resolved);
      setUnResolvedData(unResolved);

      // Calculate max values for radar chart indicators
      const maxValues = combined.map((_, index) => {
        return Math.max(resolvedData[index], unresolvedData[index]) + 2;
      });

      setIndicators(
        combined.map((label, index) => ({
          name: label,
          max: maxValues[index],
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    if (
      indicators.length > 0 &&
      unresolvedData.length > 0 &&
      resolvedData.length > 0 &&
      (!isLoadingCharts &&!isErrorCharts)
    ) {
      const radarChartElement = document.querySelector("#radarChart") as HTMLElement;
      if (radarChartElement) {
        const radarChart = echarts.init(radarChartElement);
        radarChart.setOption({
          title: {
            text: "Comparison of Resolved and Unresolved Issues by Category",
            left: "center",
            top: "0%",
          },
          legend: {
            data: ["Resolved Issues", "UnResolved Issues"],
            top: "8%",
          },
          radar: {
            indicator: indicators,
            center: ["50%", "60%"],
          },
          series: [
            {
              name: "Resolved vs Unresolved Issues",
              type: "radar",
              data: [
                {
                  value: resolvedData,
                  name: "Resolved Issues",
                  itemStyle: { color: "green" },
                },
                {
                  value: unresolvedData,
                  name: "UnResolved Issues",
                  itemStyle: { color: "red" },
                },
              ],
            },
          ],
        });
      } else {
        console.error(
          "Failed to initialize radar chart: #radarChart element not found.",
        );
      }
    }
  }, [indicators]);

  return (
    <>
      {(!isErrorCharts)? (
        <>
          {isLoadingCharts? (
            <div className="flex justify-center items-center" style={{ height: '200px' }}>
              <FaSpinner className="animate-spin text-4xl text-green-500" />
            </div>
          ) : (
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body pb-0">
                  <div
                    id="radarChart"
                    style={{ minHeight: "400px" }}
                    className="echart"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
        </div>
      )}
    </>
  );
}

export default RadarChart;
