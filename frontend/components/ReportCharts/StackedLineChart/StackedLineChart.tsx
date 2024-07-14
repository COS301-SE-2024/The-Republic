import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import mockData from "@/data/stacked";
import { formatMoreDate } from "@/lib/utils";

function StackedLineChart() {
  const chartRef = useRef(null);
  const [data, setData] = useState<{
    [key: string]: { [key: string]: number };
  }>(mockData);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCategoryAndCreatedAt`;
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
          setData(apiResponse.data);
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
    if (data && Object.keys(data).length !== 0) {
      if (chartRef.current) {
        const chart = echarts.init(chartRef.current);

        const dates = Array.from(
          new Set(Object.values(data).flatMap(Object.keys)),
        ).sort();
        const seriesData = Object.keys(data).map((category) => ({
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

        const option = {
          title: {
            text: "Fluctuations in Daily Reported Issues Across Multiple Sectors",
            left: "center",
            top: "0%",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: Object.keys(data),
            top: "5%",
          },
          grid: {
            left: "4%",
            right: "4%",
            bottom: "10%",
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
          series: seriesData,
        };

        chart.setOption(option);
      }
    }
  }, [data]);

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
    <div className="col-12 pb-5">
      <div className="card">
        <div className="card-body">
          <div ref={chartRef} style={{ width: "100%", height: "600px" }}></div>{" "}
          {/* Increased height */}
        </div>
      </div>
    </div>
  );
}

export default StackedLineChart;
