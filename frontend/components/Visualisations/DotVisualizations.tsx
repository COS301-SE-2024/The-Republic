"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import * as echarts from "echarts";
import * as d3 from "d3";
import "d3-hierarchy";
import { useMediaQuery } from "@/lib/useMediaQuery";

import {
  SubData,
  SeriesDataItem,
  Params,
  Api,
  RenderItemResult,
} from "@/lib/types";
import { colorFromCategory } from "@/lib/utils";
import { LoadingSpinner } from "../Spinner/Spinner";
import { dotVisualization } from "@/lib/api/dotVisualization";
import { useRouter } from "next/navigation";

let displayRoot: d3.HierarchyCircularNode<SeriesDataItem>;

const EChartsComponent = () => {
  const chartRef = useRef(null);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/visualization`;
  const { data, isLoading, isError } = useQuery({
    queryKey: [`dot_visualization`],
    queryFn: () => dotVisualization(url),
    enabled: true,
  });

  const provincesPopulation: { [key: string]: number } = {
    "Eastern Cape": 6676590,
    "Free State": 2745590,
    "Gauteng": 15810388,
    "KwaZulu-Natal": 11513575,
    "Limpopo": 5926724,
    "Mpumalanga": 4743584,
    "North West": 4108816,
    "Northern Cape": 1303047,
    "Western Cape": 7113776
  };

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    function run() {
      const dataWrap = prepareData(data);
      initChart(dataWrap.seriesData, dataWrap.maxDepth, dataWrap.maxIssueRate);
    }

    const categories = [
      "Healthcare Services",
      "Public Safety",
      "Water",
      "Transportation",
      "Electricity",
      "Sanitation",
      "Social Services",
      "Administrative Services",
    ];

    function prepareData(rawData: SubData) {
      const seriesData: SeriesDataItem[] = [];
      let maxDepth = 0;
      let maxIssueRate = 0;

      seriesData.push({
        id: "South Africa",
        value: rawData.$count || 0,
        population: 0,
        issueRate: 0,
        depth: 0,
        index: 0,
      });

      function convert(source: SubData, basePath: string, depth: number) {
        if (source == null || maxDepth > 5) {
          return;
        }
        maxDepth = Math.max(depth, maxDepth);

        const count = source.$count || 0;
        let population = 0;
        let issueRate = 0;

        if (depth === 1) {
          const provinceName = basePath.split(", ")[1];
          if (provincesPopulation[provinceName]) {
            population = provincesPopulation[provinceName];
            issueRate = Math.log(count + 1) / Math.log(population) * 10000;

            maxIssueRate = Math.max(maxIssueRate, issueRate);
            seriesData.push({
              id: basePath,
              value: count,
              population: population,
              issueRate: issueRate,
              depth: depth,
              index: seriesData.length,
            });
          }
        } else if (depth > 1) {
          seriesData.push({
            id: basePath,
            value: count,
            population: population,
            issueRate: issueRate,
            depth: depth,
            index: seriesData.length,
          });
        }

        if (depth >= 1) {
          const lastPart = basePath.split(", ").splice(-1)[0];

          if (!categories.includes(lastPart)) {
            seriesData.push({
              id: basePath + ", " + "$label",
              value: 0,
              population: 0,
              issueRate: 0,
              depth: depth + 1,
              index: seriesData.length,
            });
          }
        }

        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key) && !key.match(/^\$/)) {
            const path = basePath + ", " + key;
            convert(source[key] as SubData<unknown>, path, depth + 1);
          }
        }
      }

      convert(rawData, "South Africa", 0);

      return {
        seriesData: seriesData,
        maxDepth: maxDepth,
        maxIssueRate: maxIssueRate
      };
    }

    function initChart(seriesData: SeriesDataItem[], maxDepth: number, maxIssueRate: number) {
      displayRoot ??= stratify("South Africa") as d3.HierarchyCircularNode<SeriesDataItem>;

      function stratify(rootId: string) {
        return d3
          .stratify<SeriesDataItem>()
          .parentId((d: SeriesDataItem): string => {
            if (d.id === "South Africa") return "";
            return d.id.substring(0, d.id.lastIndexOf(", "));
          })(seriesData)
          .sum((d: SeriesDataItem): number => {
            const pathParts = d.id.split(", ");
            const isLabel = pathParts.slice(-1)[0] === "$label";
            if (isLabel) {
              if (
                pathParts.slice(0, -1).join(", ") === rootId ||
                pathParts.slice(0, -2).join(", ") === rootId
              ) {
                return 1;
              } else {
                return 0;
              }
            }

            if (d.depth === 0) {
              return 0;
            }

            if (d.depth === 1) {
              const minSize = 1000;
              const maxSize = 100000;
              const size = Math.sqrt(minSize + (d.issueRate / maxIssueRate) * (maxSize - minSize)) * 50;
              return size;
            }

            return d.value;
          })
          .sort(
            (
              a: d3.HierarchyNode<SeriesDataItem>,
              b: d3.HierarchyNode<SeriesDataItem>,
            ): number => {
              if (a.depth === 0) return -1;
              if (b.depth === 0) return 1;
              return (b.value || 0) - (a.value || 0);
            },
          );
      }

      function overallLayout(params: Params, api: Api): void {
        const context = params.context;
        d3
          .pack<SeriesDataItem>()
          .size([api.getWidth() - 2, api.getHeight() - 2])
          .padding(3)(displayRoot);
        context.nodes = {};
        displayRoot.descendants().forEach(function (node) {
          if (node.id != undefined) {
            context.nodes[node.id] = node;
          }
        });
      }

      function renderItem(params: Params, api: Api): RenderItemResult | void {
        const context = params.context;
        if (!context.layout) {
          context.layout = true;
          overallLayout(params, api);
        }
        const nodePath = api.value("id");
        const node = context.nodes[nodePath];
        if (!node) {
          return;
        }
        const focus = new Uint32Array(
          node.descendants().map(function (node) {
            return node.data.index;
          }),
        );
        const pathParts = nodePath.split(", ");
        const isLeaf = !node.children || !node.children.length;
        const isLabel = pathParts.slice(-1)[0] === "$label";
        const nodeName = isLeaf
          ? pathParts.slice(isLabel ? -2 : -1)[0]
          : "";
        const z2 = Number(api.value("depth")) * 2;
        return {
          type: "circle",
          focus: focus,
          shape: {
            cx: node.x,
            cy: node.y,
            r: isLabel ? 0 : node.r,
          },
          transition: ["shape"],
          z2: z2,
          textContent: {
            type: "text",
            style: {
              text: nodeName,
              fontFamily: "Arial",
              width: node.r * 2,
              overflow: isLabel ? "break" : "truncate",
              fontSize: isLabel ? node.r / 3.5 : node.r / 5,
            },
            emphasis: {
              style: {
                overflow: isLabel ? "break" : null,
                fontSize: Math.max(node.r / 4, 12),
              },
            },
          },
          textConfig: {
            position: "inside",
          },
          style: {
            fill: colorFromCategory(api, nodeName),
          },
          emphasis: {
            style: {
              fontFamily: "Arial",
              fontSize: 12,
              shadowBlur: 20,
              shadowOffsetX: 3,
              shadowOffsetY: 5,
              shadowColor: "rgba(0,0,0,0.3)",
            },
          },
          blur: {
            style: {
              opacity: 0.4,
            },
          },
        };
      }

      const option = {
        dataset: {
          source: seriesData,
        },
        tooltip: {},
        visualMap: [
          {
            show: false,
            min: 0,
            max: maxDepth,
            dimension: "depth",
            inRange: {
              color: ["#006edd", "#e0ffff"],
            },
          },
        ],
        hoverLayerThreshold: Infinity,
        series: {
          type: "custom",
          renderItem: renderItem,
          progressive: 0,
          coordinateSystem: "none",
          encode: {
            tooltip: "value",
            itemName: "id",
          },
        },
      };
      myChart.setOption(option);
      myChart.on("click", { seriesIndex: 0 }, function (params) {
        if (
          params.data &&
          typeof params.data === "object" &&
          "id" in params.data
        ) {
          const idParts = (params.data.id as string).split(", ");
          const lastPart = idParts.splice(-1)[0];

          if (lastPart === "$label") {
            return;
          }

          if (categories.includes(lastPart)) {
            const locationParam = `location=${encodeURIComponent(idParts.join(", "))}`;
            const categoryParam = `category=${encodeURIComponent(lastPart)}`;
            sessionStorage.removeItem("feedSroll");
            router.push(`/?${locationParam}&${categoryParam}`);
          } else {
            drillDown((params.data as { id: string }).id);
          }
        }
      });

      function drillDown(targetNodeId: string | null = null): void {
        if (displayRoot.id === targetNodeId) {
          targetNodeId = null;
        }
        displayRoot = stratify(targetNodeId ?? "South Africa") as d3.HierarchyCircularNode<SeriesDataItem>;
        if (targetNodeId !== null) {
          displayRoot = displayRoot.descendants().find(function (node) {
            return node.data.id === targetNodeId;
          }) as d3.HierarchyCircularNode<SeriesDataItem>;
        }
        displayRoot.parent = null;
        myChart.setOption({
          dataset: {
            source: seriesData,
          },
        });
      }

      myChart.getZr().on("click", function (event) {
        if (!event.target) {
          drillDown();
        }
      });
    }

    run();

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [data]);

  return (
    <>
      {!isError ? (
        <>
          {isLoading ? (
            <div
              className="pt-64 w-full flex flex-row justify-center"
              data-testid="loading-spinner"
            >
              <LoadingSpinner />
            </div>
          ) : (
            <div
              ref={chartRef}
              style={{ height: isMobile ? "80vh" : "100vh" }}
              data-testid="echarts-container"
            />
          )}
        </>
      ) : (
        <div>Error loading visualization</div>
      )}
    </>
  );
};

export default EChartsComponent;
