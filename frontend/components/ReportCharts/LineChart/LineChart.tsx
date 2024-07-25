"use client";

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

import { reportCharts } from "@/lib/api/reportCharts";

function LineChart() {
  const [dates, setDates] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCreatedAt`;
  const {
    data: returndedData,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
  } = useQuery({
    queryKey: [`line_chart`],
    queryFn: () => reportCharts(url),
    enabled: true,
  });

  useEffect(() => {
    if (returndedData) {
      const dateCounts: { [key: string]: number } = {};

      Object.keys(returndedData).forEach((date) => {
        const formattedDate = formatDate(date);
        if (!dateCounts[formattedDate]) {
          dateCounts[formattedDate] = 0;
        }

        dateCounts[formattedDate] += returndedData[date].length;
      });

      const datesData = Object.keys(dateCounts).reverse();
      const updateData = datesData.map((date) => dateCounts[date]);

      setDates(datesData);
      setData(updateData);
    }
  }, [returndedData]);

  useEffect(() => {
    if (
      dates.length > 0 &&
      data.length > 0 &&
      !isLoadingCharts &&
      !isErrorCharts
    ) {
      const lineChart = echarts.init(
        document.querySelector("#lineChart") as HTMLElement,
      );
      lineChart.setOption({
        title: {
          text: "Trend of Reported Issues Over Time",
          left: "center",
          top: "0%",
        },
        xAxis: {
          type: "category",
          data: dates,
          name: "Days (date)",
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
            data: data,
            type: "line",
            smooth: true,
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
                    id="lineChart"
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

export default LineChart;
