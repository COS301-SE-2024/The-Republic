import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function StackedLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Sales', 'Revenue', 'Customers']
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [ "0", "2018-09-19", "2018-09-19", "2018-09-19", "2018-09-19", "2018-09-19", "2018-09-19", "2018-09-19"]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Water Issues',
            type: 'line',
            smooth: true,
            stack: 'total',
            data: [22, 31, 40, 28, 51, 42, 82, 56],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(66, 84, 241)'
              }, {
                offset: 0.2,
                color: 'rgb(66, 84, 241, 0.3)'
              }])
            }
          },
          {
            name: 'Electricity issues',
            type: 'line',
            smooth: true,
            stack: 'total',
            data: [25, 11, 32, 45, 32, 34, 52, 41],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(46, 202, 106)'
              }, {
                offset: 0.2,
                color: 'rgb(46, 202, 106, 0.3)'
              }])
            }
          },
          {
            name: 'Health Issues',
            type: 'line',
            smooth: true,
            stack: 'total',
            data: [27, 15, 11, 32, 18, 9, 24, 11],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 119, 29)'
              }, {
                offset: 0.2,
                color: 'rgb(255, 119, 29, 0.3)'
              }])
            }
          }
        ]
      };

      chart.setOption(option);
    }
  }, []);

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Stacked Line Chart Representation</h5>
          <div ref={chartRef} style={{ width: '100%', height: 400 }}></div>
        </div>
      </div>
    </div>
  );
}

export default StackedLineChart;