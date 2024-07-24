"use client";

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { IssuesGroupedByDate } from "@/lib/reports";
import { formatDate } from "@/lib/utils";

function LineChart() {
  const [dates, setDates] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [data, setData] = useState<number[]>([
    150, 230, 224, 218, 135, 147, 260,
  ]);
  const [returndedData, setReturndedData] = useState<IssuesGroupedByDate>({});

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCreatedAt`;
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            from: 0,
            amount: 99,
          }),
          headers: {
            "content-type": "application/json",
          },
        });
        const apiResponse = await response.json();

        if (apiResponse.success && apiResponse.data) {
          setReturndedData(apiResponse.data);
        } else {
          console.error("Error fetching issues:", apiResponse.error);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

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
    // ECharts Line Chart
    if (dates.length > 0 && data.length > 0) {
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
  );
}

export default LineChart;
