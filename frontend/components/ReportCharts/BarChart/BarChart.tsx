'use client';

import React, { useEffect, useState } from "react";
import * as echarts from 'echarts';

function BarChart() {
  const [data, setData] = useState<{ resolved: { [key: string]: number }, unresolved: { [key: string]: number } }>({ resolved: {}, unresolved: {} });
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
    let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let unresolvedData = [120, 200, 150, 80, 70, 110, 130];
    let resolverData = [60, 140, 180, 100, 60, 80, 70];

    if (data && ('resolved' in data && 'unresolved' in data)) {
      const resolvedEntries: { [key: string]: number } = data.resolved;
      const unresolvedEntries: { [key: string]: number } = data.unresolved;
    
      const combinedCategories = new Set([...Object.keys(resolvedEntries), ...Object.keys(unresolvedEntries)]);

      labels = Array.from(combinedCategories);
      unresolvedData = labels.map(label => Number(unresolvedEntries[label]) || 0);
      resolverData = labels.map(label => Number(resolvedEntries[label]) || 0);
    }

    const barChart = echarts.init(document.querySelector("#barChart") as HTMLElement);
    barChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Unresolved', 'Reolved']
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Unresolved',
          data: unresolvedData,
          type: 'bar',
          color: '#ee6666'
        },
        {
          name: 'Reolved',
          data: resolverData,
          type: 'bar',
          color: '#91cc75'
        }
      ]
    });
  }, [data]);

  return (
    <div className="col-lg-6">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Bar Chart Representation</h5>
                <div id="barChart" style={{ minHeight: "400px" }} className="echart"></div>
            </div>
        </div>
    </div>
  );
}

export default BarChart;
