import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

import { reportCharts } from "@/lib/api/reportCharts";

function PoliticalChart() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedPoliticalAssociation`;

  const {
    data,
    isLoading: isLoadingCharts,
    isError: isErrorCharts,
  } = useQuery({
    queryKey: [`political_data`],
    queryFn: () => reportCharts(url),
  });

  useEffect(() => {
    if (data) {
      setDataArray(data);
    }
  }, [data]);

  useEffect(() => {
    if (dataArray.length > 0) {
      const element = document.querySelector("#politicalChart") as HTMLElement;
      if (element) {
        const donutChart = echarts.init(element);
        donutChart.setOption({
          tooltip: {
            trigger: "item",
          },
          title: {
            text: "Distribution of Resolved Issues by Political Party",
            left: "center",
            top: "0%",
          },
          legend: {
            top: "8%",
            left: "center",
          },
          series: [
            {
              name: "Political Party",
              type: "pie",
              radius: "70%",
              label: {
                show: true,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "18",
                  fontWeight: "bold",
                },
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
                    id="politicalChart"
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

export default PoliticalChart;
