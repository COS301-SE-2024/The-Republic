import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from 'next-themes';
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { reportCharts } from "@/lib/api/reportCharts";
import darkTheme from "@/lib/charts-dark-theme";
import lightTheme from "@/lib/charts-light-theme";

function DonutChart() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
  const isMobile = useMediaQuery('(max-width: 768px)');
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
    const transformData = (data: {
      resolved: { [key: string]: number };
      unresolved: { [key: string]: number };
    }) => {
      const merged = { ...data.resolved };

      Object.entries(data.unresolved).forEach(([key, value]) => {
        if (merged[key]) {
          merged[key] += value;
        } else {
          merged[key] = value;
        }
      });

      return Object.entries(merged).map(([name, value]) => ({ name, value }));
    };

    if (data && "resolved" in data && "unresolved" in data) {
      const transformedData = transformData(data);
      setDataArray(transformedData);
    }
  }, [data]);

  useEffect(() => {
    if (dataArray.length > 0) {
      const element = document.querySelector("#donutChart") as HTMLElement;
      if (element) {
        const currentTheme = theme === 'dark' ? 'darkTheme' : 'lightTheme';
        echarts.registerTheme('lightTheme', lightTheme);
        echarts.registerTheme('darkTheme', darkTheme);

        if (chartInstance.current) {
          chartInstance.current.dispose();
        }

        chartInstance.current = echarts.init(element, currentTheme);
        chartInstance.current.setOption({
          tooltip: {
            trigger: "item",
          },
          title: {
            text: "Distribution of Reported Issues by Category",
            left: "center",
            top: "0%",
            textStyle: {
              fontSize: isMobile ? 14 : 18,
            },
          },
          legend: {
            type: "scroll",
            top: "8%",
            left: "center",
            textStyle: {
              fontSize: isMobile ? 10 : 12,
            },
          },
          series: [
            {
              name: "Issue Category",
              type: "pie",
              radius: isMobile ? ["30%", "60%"] : ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: isMobile ? 14 : 18,
                  fontWeight: "bold",
                },
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              labelLine: {
                show: false,
              },
              data: dataArray,
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
      } else {
        console.error("Element #donutChart not found");
      }
    }
  }, [dataArray, isMobile, theme]);

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
                <div className="card-body pb-0">
                  <div
                    id="donutChart"
                    style={{ height: isMobile ? "300px" : "550px" }}
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

export default DonutChart;
