import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { formatMoreDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from 'next-themes';
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { reportCharts } from "@/lib/api/reportCharts";
import darkTheme from "@/lib/charts-dark-theme";
import lightTheme from "@/lib/charts-light-theme";

function StackedLineChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCategoryAndCreatedAt`;
  const { theme } = useTheme();
  const {
    data,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
  } = useQuery({
    queryKey: [`stacked_chart`],
    queryFn: () => reportCharts(url),
    enabled: true,
  });

  useEffect(() => {
    if (
      data &&
      Object.keys(data).length !== 0 &&
      !isLoadingCharts &&
      !isErrorCharts &&
      chartRef.current
    ) {
      const currentTheme = theme === 'dark' ? 'darkTheme' : 'lightTheme';
      echarts.registerTheme('lightTheme', lightTheme);
      echarts.registerTheme('darkTheme', darkTheme);

      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current, currentTheme);

      const dates = Array.from(
        new Set(
          Object.values(
            data as {
              [key: string]: { [key: string]: number };
            },
          ).flatMap(Object.keys),
        ),
      ).sort();

      const seriesData: echarts.LineSeriesOption[] = Object.keys(data).map((category) => ({
        name: category,
        type: "line",
        smooth: true,
        stack: "total",
        data: dates.map((date) => data[category][date] || 0),
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: getColorForCategory(category),
            },
            {
              offset: 0.2,
              color: getColorForCategory(category, 0.3),
            },
          ]),
        },
      }));

      const option: echarts.EChartsOption = {
        title: {
          text: "Fluctuations in Daily Reported Issues Across Multiple Sectors",
          left: "center",
          top: "0%",
          textStyle: {
            fontSize: isMobile ? 10 : 18,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: Object.keys(data),
          top: "6%",
          textStyle: {
            fontSize: isMobile ? 10 : 12,
          },
          type: isMobile ? 'scroll' : 'plain',
        },
        grid: {
          left: isMobile ? '5%' : '4%',
          right: isMobile ? '5%' : '4%',
          bottom: isMobile ? '15%' : '10%',
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: formatMoreDate(dates),
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
        series: seriesData,
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
  }, [data, isLoadingCharts, isErrorCharts, isMobile, theme]);

  const getColorForCategory = (category: string, opacity = 1) => {
    const colors = {
      "Public Safety": `rgba(255, 0, 0, ${opacity})`,
      Water: `rgba(0, 0, 255, ${opacity})`,
      "Healthcare Services": `rgba(0, 255, 0, ${opacity})`,
      Electricity: `rgba(255, 255, 0, ${opacity})`,
      "Administrative Services": `rgba(128, 128, 128, ${opacity})`,
    } as { [key: string]: string };

    return colors[category] || `rgba(0, 0, 0, ${opacity})`;
  };

  return (
    <>
      {!isErrorCharts ? (
        <>
          {isLoadingCharts ? (
            <div className="flex justify-center items-center h-[200px]">
              <FaSpinner className="animate-spin text-4xl text-green-500" />
            </div>
          ) : (
            <div className="w-full pb-5">
              <div className="card">
                <div className="card-body">
                  <div
                    ref={chartRef}
                    style={{
                      width: "100%",
                      height: isMobile ? "400px" : "600px"
                    }}
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

export default StackedLineChart;
