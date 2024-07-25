import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

import { reportCharts } from "@/lib/api/reportCharts";

function DonutChart() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
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
          },
          legend: {
            top: "8%",
            left: "center",
          },
          series: [
            {
              name: "Issue Category",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "18",
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
      } else {
        console.error("Element #donutChart not found");
      }
    }
  }, [dataArray]);

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
                <div className="card-body pb-0">
                  <div
                    id="donutChart"
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

export default DonutChart;
