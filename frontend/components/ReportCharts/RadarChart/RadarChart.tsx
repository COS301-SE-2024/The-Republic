"use client";

import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { DataItem2 } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";

import { reportCharts } from "@/lib/api/reportCharts";

function RadarChart() {
  const [indicators, setIndicators] = useState<DataItem2[]>([]);
  const [unresolvedData, setUnResolvedData] = useState<number[]>([]);
  const [resolvedData, setResolvedData] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
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
        return Math.max(resolved[index], unResolved[index]) + 2;
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
      !isLoadingCharts &&
      !isErrorCharts &&
      chartRef.current
    ) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const option: echarts.EChartsOption = {
        title: {
          text: "Comparison of Resolved and Unresolved Issues by Category",
          left: "center",
          top: "0%",
          textStyle: {
            fontSize: isMobile ? 12 : 18,
          },
        },
        legend: {
          data: ["Resolved Issues", "UnResolved Issues"],
          top: "8%",
          textStyle: {
            fontSize: isMobile ? 10 : 12,
          },
        },
        radar: {
          indicator: indicators,
          center: ["50%", "60%"],
          radius: isMobile ? "60%" : "60%",
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
        grid: {
          containLabel: true,
        }
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [indicators, unresolvedData, resolvedData, isLoadingCharts, isErrorCharts, isMobile]);

  return (
    <>
      {!isErrorCharts ? (
        <>
          {isLoadingCharts ? (
            <div className="flex justify-center items-center h-[200px]">
              <FaSpinner className="animate-spin text-4xl text-green-500" />
            </div>
          ) : (
            <div className="w-full">
              <div className="card">
                <div className="card-body pb-0">
                  <div
                    ref={chartRef}
                    style={{ 
                      width: '100%',
                      height: isMobile ? "300px" : "650px"
                    }}
                    className="echart"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Error loading chart data</div>
      )}
    </>
  );
}

export default RadarChart;