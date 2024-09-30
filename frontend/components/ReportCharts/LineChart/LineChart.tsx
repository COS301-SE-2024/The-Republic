"use client";

import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from 'next-themes';
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { reportCharts } from "@/lib/api/reportCharts";
import darkTheme from "@/lib/charts-dark-theme";
import lightTheme from "@/lib/charts-light-theme";

function LineChart() {
  const [dates, setDates] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { theme } = useTheme();

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCreatedAt`;
  const {
    data: returnedData,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
  } = useQuery({
    queryKey: [`line_chart`],
    queryFn: () => reportCharts(url),
    enabled: true,
  });

  useEffect(() => {
    if (returnedData) {
      const dateCounts: { [key: string]: number } = {};

      Object.keys(returnedData).forEach((date) => {
        const formattedDate = formatDate(date);
        if (!dateCounts[formattedDate]) {
          dateCounts[formattedDate] = 0;
        }

        dateCounts[formattedDate] += returnedData[date].length;
      });

      const datesData = Object.keys(dateCounts).reverse();
      const updateData = datesData.map((date) => dateCounts[date]);

      setDates(datesData);
      setData(updateData);
    }
  }, [returnedData]);

  useEffect(() => {
    if (
      dates.length > 0 &&
      data.length > 0 &&
      !isLoadingCharts &&
      !isErrorCharts &&
      chartRef.current
    ) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      const currentTheme = theme === 'dark' ? 'darkTheme' : 'lightTheme';
      echarts.registerTheme('lightTheme', lightTheme);
      echarts.registerTheme('darkTheme', darkTheme);
      
      chartInstance.current = echarts.init(chartRef.current, currentTheme);

      const option: echarts.EChartsOption = {
        title: {
          text: "Trend of Reported Issues Over Time",
          left: "center",
          top: "0%",
          textStyle: {
            fontSize: isMobile ? 14 : 18,
          },
        },
        grid: {
          left: isMobile ? '10%' : '3%',
          right: isMobile ? '5%' : '4%',
          bottom: isMobile ? '15%' : '10%',
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: dates,
          name: "Days (date)",
          nameLocation: "middle",
          nameGap: 30,
          nameTextStyle: {
            fontSize: isMobile ? 12 : 16,
            fontWeight: "bold",
          },
          axisLabel: {
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
            data: data,
            type: "line",
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
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
  }, [data, dates, isLoadingCharts, isErrorCharts, isMobile, theme]);

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
                <div className="card-body">
                  <div
                    ref={chartRef}
                    style={{ 
                      width: '100%',
                      height: isMobile ? "300px" : "400px"
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

export default LineChart;