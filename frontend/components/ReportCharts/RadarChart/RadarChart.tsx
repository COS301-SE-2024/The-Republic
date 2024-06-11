'use client';

import React, { useEffect } from "react";
import * as echarts from 'echarts';

function RadarChart() {
  useEffect(() => {
    // ECharts Radar Chart
    const radarChart = echarts.init(document.querySelector("#radarChart") as HTMLElement);
    radarChart.setOption({
      legend: {
        data: ['Reported Issues', 'Resolved Issues']
      },
      radar: {
        indicator: [
          { name: 'Water', max: 6500 },
          { name: 'Electricity', max: 16000 },
          { name: 'Health', max: 30000 },
          { name: 'Services', max: 38000 },
          { name: 'Roads', max: 52000 },
          { name: 'Crime', max: 25000 }
        ]
      },
      series: [{
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }]
    });
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
