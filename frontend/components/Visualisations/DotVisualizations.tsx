'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import * as d3 from 'd3';
import 'd3-hierarchy';
import mockData from "@/data/dot";

import {
  SubData, SeriesDataItem, Params, Api, RenderItemResult
} from "@/lib/types";

const EChartsComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    function run() {
      const myObject = {
        $count: 1,
        data: mockData
      };
      const dataWrap = prepareData(myObject);
      initChart(dataWrap.seriesData, dataWrap.maxDepth);
    }

    function prepareData(rawData: SubData) {
      const seriesData: SeriesDataItem[] = [];
      let maxDepth = 0;

      function convert(source: SubData, basePath: string, depth: number) {
        if (source == null) {
          return;
        }
        if (maxDepth > 5) {
          return;
        }
        maxDepth = Math.max(depth, maxDepth);
        seriesData.push({
            id: basePath,
            value: source.$count,
            depth: depth,
            index: seriesData.length
        });
        
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key) && !key.match(/^\$/)) {
                const path = basePath + '.' + key;
                convert(source[key] as SubData<unknown>, path, depth + 1);
            }
        }
      }
      convert(rawData, 'option', 0);
      return {
        seriesData: seriesData,
        maxDepth: maxDepth
      };
    }

    function initChart(seriesData: SeriesDataItem[], maxDepth: number) {
      let displayRoot = stratify() as d3.HierarchyCircularNode<SeriesDataItem>;
    
      function stratify() {
        return d3
          .stratify<SeriesDataItem>()
          .parentId((d: SeriesDataItem): string => {
            return d.id.substring(0, d.id.lastIndexOf('.'));
          })(seriesData)
          .sum((d: SeriesDataItem): number => {
            return d.value || 0;
          })
          .sort((a: d3.HierarchyNode<SeriesDataItem>, b: d3.HierarchyNode<SeriesDataItem>): number => {
            return (b.value || 0) - (a.value || 0);
          });
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
        const nodePath = api.value('id');
        const node = context.nodes[nodePath];
        if (!node) {
          return;
        }
        const isLeaf = !node.children || !node.children.length;
        const focus = new Uint32Array(
          node.descendants().map(function (node) {
            return node.data.index;
          })
        );
        const nodeName = isLeaf
          ? nodePath
            .slice(nodePath.lastIndexOf('.') + 1)
            .split(/(?=[A-Z][^A-Z])/g)
            .join('\n')
          : '';
        const z2 = Number(api.value('depth')) * 2;
        return {
          type: 'circle',
          focus: focus,
          shape: {
            cx: node.x,
            cy: node.y,
            r: node.r
          },
          transition: ['shape'],
          z2: z2,
          textContent: {
            type: 'text',
            style: {
              text: nodeName,
              fontFamily: 'Arial',
              width: node.r * 1.3,
              overflow: 'truncate',
              fontSize: node.r / 3
            },
            emphasis: {
              style: {
                overflow: null,
                fontSize: Math.max(node.r / 3, 12)
              }
            }
          },
          textConfig: {
            position: 'inside'
          },
          style: {
            fill: api.visual('color')
          },
          emphasis: {
            style: {
              fontFamily: 'Arial',
              fontSize: 12,
              shadowBlur: 20,
              shadowOffsetX: 3,
              shadowOffsetY: 5,
              shadowColor: 'rgba(0,0,0,0.3)'
            }
          }
        };
      }

      const option = {
        dataset: {
          source: seriesData
        },
        tooltip: {},
        visualMap: [
          {
            show: false,
            min: 0,
            max: maxDepth,
            dimension: 'depth',
            inRange: {
              color: ['#006edd', '#e0ffff']
            }
          }
        ],
        hoverLayerThreshold: Infinity,
        series: {
          type: 'custom',
          renderItem: renderItem,
          progressive: 0,
          coordinateSystem: 'none',
          encode: {
            tooltip: 'value',
            itemName: 'id'
          }
        }
      };
      myChart.setOption(option);
      myChart.on('click', { seriesIndex: 0 }, function (params) {
        if (params.data && typeof params.data === 'object' && 'id' in params.data) {
          drillDown((params.data as { id: string }).id);
        }
      });

      function drillDown(targetNodeId: string | null = null): void {
        displayRoot = stratify() as d3.HierarchyCircularNode<SeriesDataItem>;
        if (targetNodeId != null) {
          displayRoot = displayRoot.descendants().find(function (node) {
            return node.data.id === targetNodeId;
          }) as d3.HierarchyCircularNode<SeriesDataItem>;
        }
        displayRoot.parent = null;
        myChart.setOption({
          dataset: {
            source: seriesData
          }
        });
      }

      myChart.getZr().on('click', function (event) {
        if (!event.target) {
          drillDown();
        }
      });
    }

    run();

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: '100vh' }} />;
};

export default EChartsComponent;