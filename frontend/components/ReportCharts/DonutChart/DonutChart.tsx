'use client';

import React, { useEffect } from "react";
import * as echarts from 'echarts';

function DonutChart() {
  useEffect(() => {
    // ECharts Donut Chart
    const donutChart = echarts.init(document.querySelector("#donutChart"));
    donutChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
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
        data: [
          { value: 1048, name: 'Water' },
          { value: 735, name: 'Electricity' },
          { value: 580, name: 'Health' },
          { value: 484, name: 'Services' },
          { value: 300, name: 'Roads' }
        ]
      }]
    });
  }, []);

  return (
    <div className="col-lg-6">
      <div className="card">
        <div className="card-body pb-0">
          <h5 className="card-title">Donut Chart Representation</h5>
          <div id="donutChart" style={{ minHeight: "400px" }} className="echart"></div>
        </div>
      </div>
    </div>
  );
}

export default DonutChart;
