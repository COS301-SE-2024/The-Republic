import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { DataItem } from "@/lib/reports";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useMediaQuery } from "@/lib/useMediaQuery";

import { reportCharts } from "@/lib/api/reportCharts";

const TransitionOfParliament: React.FC = () => {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
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
    if (dataArray.length > 0 && chartRef.current) {
      const defaultPalette = [
        "#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de",
        "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc",
      ];

      const radius = isMobile ? ["20%", "70%"] : ["30%", "80%"];

      const pieOption: echarts.EChartsOption = {
        title: {
          text: "Hierarchical Distribution of Issues by Service Category",
          left: "center",
          top: "0%",
          textStyle: {
            fontSize: isMobile ? 12 : 18,
          },
        },
        series: [
          {
            type: "pie",
            id: "distribution",
            radius: radius,
            label: {
              show: true,
              fontSize: isMobile ? 10 : 12,
            },
            universalTransition: true,
            animationDurationUpdate: 1000,
            data: dataArray,
          },
        ],
      };

      const parliamentOption = (() => {
        const sum = dataArray.reduce((sum, cur) => sum + cur.value, 0);

        const angles: number[] = [];
        const startAngle = -Math.PI / 2;
        let curAngle = startAngle;
        dataArray.forEach((item) => {
          angles.push(curAngle);
          curAngle += (item.value / sum) * Math.PI * 2;
        });
        angles.push(startAngle + Math.PI * 2);

        function parliamentLayout(
          startAngle: number,
          endAngle: number,
          totalAngle: number,
          r0: number,
          r1: number,
          size: number,
        ) {
          const rowsCount = Math.ceil((r1 - r0) / size);
          const points: number[][] = [];

          let r = r0;
          for (let i = 0; i < rowsCount; i++) {
            const totalRingSeatsNumber = Math.round((totalAngle * r) / size);
            const newSize = (totalAngle * r) / totalRingSeatsNumber;
            for (
              let k = Math.floor((startAngle * r) / newSize) * newSize;
              k < Math.floor((endAngle * r) / newSize) * newSize - 1e-6;
              k += newSize
            ) {
              const angle = k / r;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              points.push([x, y]);
            }

            r += size;
          }

          return points;
        }

        return {
          series: {
            type: "custom",
            id: "distribution",
            data: dataArray,
            coordinateSystem: undefined,
            universalTransition: true,
            animationDurationUpdate: 1000,
            renderItem: function (params, api) {
              const idx = params.dataIndex;
              const viewSize = Math.min(api.getWidth(), api.getHeight());
              const r0 = ((parseFloat(radius[0]) / 100) * viewSize) / 2;
              const r1 = ((parseFloat(radius[1]) / 100) * viewSize) / 2;
              const cx = api.getWidth() * 0.5;
              const cy = api.getHeight() * 0.5;
              const size = isMobile ? viewSize / 60 : viewSize / 50;

              const points = parliamentLayout(
                angles[idx],
                angles[idx + 1],
                Math.PI * 2,
                r0,
                r1,
                size + 3,
              );

              return {
                type: "group",
                children: points.map((pt) => {
                  return {
                    type: "circle",
                    autoBatch: true,
                    shape: {
                      cx: cx + pt[0],
                      cy: cy + pt[1],
                      r: size / 2,
                    },
                    style: {
                      fill: defaultPalette[idx % defaultPalette.length],
                    },
                  };
                }),
              };
            },
          },
        } as echarts.EChartsOption;
      })();

      const chartElement = document.getElementById("transitionOfParliament");

      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      chartInstance.current.setOption(pieOption);

      const handleMouseEnter = () => {
        chartInstance.current?.setOption(parliamentOption);
      };

      const handleMouseLeave = () => {
        chartInstance.current?.setOption(pieOption);
      };

      chartRef.current.addEventListener('mouseenter', handleMouseEnter);
      chartRef.current.addEventListener('mouseleave', handleMouseLeave);

      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        chartRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        chartInstance.current?.dispose();
      };
    }
  }, [dataArray]);

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
                    className="echart mx-auto"
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
};

export default TransitionOfParliament;
