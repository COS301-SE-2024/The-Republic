import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { reportCharts } from "@/lib/api/reportCharts";
import { useMediaQuery } from "@/lib/useMediaQuery";

function PoliticalChart() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
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
              name: "Political Party",
              type: "pie",
              radius: isMobile ? ["30%", "60%"] : ["40%", "70%"],
              label: {
                show: false,
                position: "center"
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: isMobile ? "14" : "18",
                  fontWeight: "bold",
                },
              },
              data: dataArray,
            },
          ],
        });

        const handleResize = () => {
          donutChart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          donutChart.dispose();
        };
      } else {
        console.error("Element #politicalChart not found");
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
                    style={{
                      minHeight: "400px",
                      height: isMobile ? "300px" : "400px",
                    }}
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
