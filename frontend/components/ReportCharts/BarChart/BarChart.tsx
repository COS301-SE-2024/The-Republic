'use client';

import React, { useEffect } from "react";
import * as echarts from 'echarts';

function BarChart() {
  useEffect(() => {
    // ECharts Bar Chart
    const barChart = echarts.init(document.querySelector("#barChart"));
    barChart.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    });
  }, []);

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
