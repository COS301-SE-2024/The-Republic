'use client';

import React, { useEffect, useState } from "react";
import * as echarts from 'echarts';
import { DataItem2 } from "@/lib/reports";
// import { Combine } from "lucide-react";

function RadarChart() {
  const [data, setData] = useState<{ resolved: { [key: string]: number }, unresolved: { [key: string]: number } }>({ resolved: {}, unresolved: {} });
  const [indicators, setIndicators] = useState<DataItem2[]>([
    { "name": "Public Safety", "max": 5 },
    { "name": "Healthcare Services", "max": 3 },
    { "name": "Administrative Services", "max": 3 },
    { "name": "Electricity", "max": 4 },
    { "name": "Transportation", "max": 5 },
    { "name": "Water", "max": 8 }
  ]);

  const [unresolvedData, setUnResolvedData] = useState<number[]>([1, 2, 2, 4, 4, 4]);
  const [resolvedData, setResolvedData] = useState<number[]>([0, 1, 0, 3, 0, 6]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedResolutionAndCategory`;
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            from: 0,
            amount: 99,
          }),
          headers: {
            "content-type": "application/json"
          }
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
    // ECharts Bar Chart
    if (data && ('resolved' in data && 'unresolved' in data)) {
      const resolvedEntries = data.resolved;
      const unresolvedEntries = data.unresolved;

      const combined = Array.from(new Set([...Object.keys(resolvedEntries), ...Object.keys(unresolvedEntries)]));
      const resolved = combined.map(label => Number(resolvedEntries[label]) || 0);
      const unResolved = combined.map(label => Number(unresolvedEntries[label]) || 0);

      setResolvedData(resolved);
      setUnResolvedData(unResolved);
      
      // Calculate max values for radar chart indicators
      const maxValues = combined.map((_, index) => {
        return Math.max(resolvedData[index], unresolvedData[index]) + 2;
      });
      
      setIndicators(combined.map((label, index) => ({ name: label, max: maxValues[index] })));
    }
  }, [data]);
  
  // ECharts Radar Chart
  useEffect(() => {
    if (indicators.length > 0 && unresolvedData.length > 0 && resolvedData.length > 0) {
      const radarChartElement = document.querySelector("#radarChart") as HTMLElement | null;
      // console.log("Indicators: ", indicators)
      if (radarChartElement) {
        const radarChart = echarts.init(radarChartElement);
        radarChart.setOption({
          legend: {
            data: ['Resolved Issues', 'UnResolved Issues']
          },
          radar: {
            indicator: indicators
          },
          series: [{
            name: 'Resolved vs Unresolved Issues',
            type: 'radar',
            data: [
              {
                value: resolvedData,
                name: 'Resolved Issues',
                itemStyle: {color: 'green'}
              },
              {
                value: unresolvedData,
                name: 'UnResolved Issues',
                itemStyle: {color: 'red'}
              }
            ]
          }]
        });
      } else {
        console.error("Failed to initialize radar chart: #radarChart element not found.");
      }
    }
  }, [indicators]);

  return (
    <div className="col-lg-6">
        <div className="card">
            <div className="card-body pb-0">
                <h5 className="text-xl font-bold text-gray-700 dark:text-white mt-5">Radar Chart Representation</h5>
                <div id="radarChart" style={{ minHeight: "400px" }} className="echart"></div>
            </div>
        </div>
    </div>
  );
}

export default RadarChart;
