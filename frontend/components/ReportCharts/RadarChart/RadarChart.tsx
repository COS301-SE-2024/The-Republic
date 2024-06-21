'use client';

import React, { useEffect, useState } from "react";
import * as echarts from 'echarts';
import { DataItem2 } from "@/lib/reports";

function RadarChart() {
  const [data, setData] = useState<{ resolved: { [key: string]: number }, unresolved: { [key: string]: number } }>({ resolved: {}, unresolved: {} });
  const [indicators, setIndicators] = useState<DataItem2[]>([
    { name: 'Sales', max: 220 },
    { name: 'Administration', max: 220 },
    { name: 'Information Technology', max: 220 },
    { name: 'Customer Support', max: 220 },
    { name: 'Development', max: 220 },
    { name: 'Marketing', max: 220 }
  ]);
  const [labels, setLables] = useState<string[]>(['Water', 'Electricity', 'Potholes', 'Health', 'Services', 'Safety']);
  const [unresolvedData, setUnResolvedData] = useState<number[]>([120, 200, 150, 80, 110, 130]);
  const [resolvedData, setResolvedData] = useState<number[]>([60, 140, 180, 100, 80, 70]);

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
      const resolvedEntries: { [key: string]: number } = data.resolved;
      const unresolvedEntries: { [key: string]: number } = data.unresolved;
    
      const combinedCategories = new Set([...Object.keys(resolvedEntries), ...Object.keys(unresolvedEntries)]);

      setLables(Array.from(combinedCategories));
      setUnResolvedData(labels.map(label => Number(unresolvedEntries[label]) || 0));
      setResolvedData(labels.map(label => Number(resolvedEntries[label]) || 0));

      console.log(unresolvedEntries);
      console.log(unresolvedEntries);
      const maxValues = labels.map(label => {
        const unresolved = Number.isFinite(resolvedEntries[label]) ? resolvedEntries[label] : 0;
        const resolved = Number.isFinite(unresolvedEntries[label]) ? unresolvedEntries[label] : 0;
        return Math.max(unresolved, resolved) + 2;
      });
      
      const indicate = labels.map((label, index) => ({ name: label, max: maxValues[index] }));
      setIndicators(indicate);
    }
  }, [data]);

  // ECharts Radar Chart
  useEffect(() => {
    const radarChartElement = document.querySelector("#radarChart") as HTMLElement | null;
    if (radarChartElement) {
      const radarChart = echarts.init(radarChartElement);
      radarChart.setOption({
        legend: {
          data: ['Reported Issues', 'Resolved Issues']
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
              name: 'Resolved Issues'
            },
            {
              value: unresolvedData,
              name: 'UnResolved Issues'
            }
          ]
        }]
      });
    } else {
      console.error("Failed to initialize radar chart: #radarChart element not found.");
    }
  }, []);

  return (
    <div className="col-lg-6">
        <div className="card">
            <div className="card-body pb-0">
                <h5 className="card-title">Radar Chart Representation</h5>
                <div id="radarChart" style={{ minHeight: "400px" }} className="echart"></div>
            </div>
        </div>
    </div>
  );
}

export default RadarChart;
