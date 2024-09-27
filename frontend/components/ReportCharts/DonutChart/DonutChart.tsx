import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { reportCharts } from "@/lib/api/reportCharts";

function DonutChart() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
  const isMobile = useMediaQuery('(max-width: 768px)');

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
        const donutChart = echarts.init(element);
        donutChart.setOption({
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
                  fontSize: isMobile ? "14" : "18",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: dataArray,
            },
          ],
        });

        // Add resize event listener
        const handleResize = () => {
          donutChart.resize();
        };
        window.addEventListener('resize', handleResize);

        // Clean up function
        return () => {
          window.removeEventListener('resize', handleResize);
          donutChart.dispose();
        };
      } else {
        console.error("Element #donutChart not found");
      }
    }
  }, [dataArray, isMobile]);

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
