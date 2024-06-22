'use client';

import React, { useEffect, useState } from "react";
import * as echarts from 'echarts';
import { DataItem } from "@/lib/reports";

function DonutChart() {
  const [data, setData] = useState<{ resolved: { [key: string]: number }; unresolved: { [key: string]: number } }>({ resolved: {}, unresolved: {} });
  const [dataArray, setDataArray] = useState<DataItem[]>([
    { value: 800, name: 'A' },
    { value: 635, name: 'B' },
    { value: 580, name: 'C' },
    { value: 484, name: 'D' },
    { value: 300, name: 'E' },
    { value: 200, name: 'F' }
  ]);

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
    // ECharts Donut Chart
    if (data && ('resolved' in data && 'unresolved' in data)) {
      const transformData = (data: { resolved: { [key: string]: number }, unresolved: { [key: string]: number } }) => {
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
      
      setDataArray(transformData(data));
    }
    const donutChart = echarts.init(document.querySelector("#donutChart") as HTMLElement);
    donutChart.setOption({
      tooltip: {
        trigger: 'item' 
      },
      title: {
        text: 'Donut Chart Representation',
        left: 'center',
        top: '0%'
      },
      legend: {
        top: '8%',
        left: 'center'
      },
      series: [{
        name: 'Issue Category',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: dataArray
      }]
    });
  }, [data]);

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-body pb-0">
          <div id="donutChart" style={{ minHeight: "400px" }} className="echart"></div>
        </div>
      </div>
    </div>
  );
}

export default DonutChart;
