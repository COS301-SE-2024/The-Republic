'use client';

import React, { useEffect } from "react";
import * as echarts from 'echarts';

function LineChart() {
  useEffect(() => {
    // ECharts Line Chart
    const lineChart = echarts.init(document.querySelector("#lineChart"));
    lineChart.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true
      }]
    });
  }, []);

  return (
    <div className="col-lg-6">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Line Chart Representation</h5>
                <div id="lineChart" style={{ minHeight: "400px" }} className="echart"></div>
            </div>
        </div>
    </div>
  );
}

export default LineChart;
