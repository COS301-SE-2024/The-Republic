import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import mockData from '@/data/stacked';
import { formatMoreDate } from "@/lib/utils";

function StackedLineChart() {
  const chartRef = useRef(null);
  const [data, setData] = useState<{ [key: string]: { [key: string]: number } }>(mockData);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/groupedCategoryAndCreatedAt`;
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
    if (data && Object.keys(data).length !== 0) {
      if (chartRef.current) {
        const chart = echarts.init(chartRef.current);

        const dates = Array.from(new Set(Object.values(data).flatMap(Object.keys))).sort();
        const seriesData = Object.keys(data).map(category => ({
          name: category,
          type: 'line',
          smooth: true,
          stack: 'total',
          data: dates.map(date => (data[category][date]) || 0),
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: getColorForCategory(category)
            }, {
              offset: 0.2,
              color: getColorForCategory(category, 0.3)
            }])
          }
        }));

        const option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: Object.keys(data)
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
            data: formatMoreDate(dates)
          },
          yAxis: {
            type: 'value'
          },
          series: seriesData
        };

        chart.setOption(option);
      }
    }
  }, [data]);

  const getColorForCategory = (category: string, opacity = 1) => {
    const colors = {
      'Public Safety': `rgba(255, 0, 0, ${opacity})`,
      'Water': `rgba(0, 0, 255, ${opacity})`,
      'Healthcare Services': `rgba(0, 255, 0, ${opacity})`,
      'Electricity': `rgba(255, 255, 0, ${opacity})`,
      'Administrative Services': `rgba(128, 128, 128, ${opacity})`
    } as {[key: string]:  string };

    return colors[category] || `rgba(0, 0, 0, ${opacity})`;
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-body">
          <h5 className="text-xl font-bold text-gray-700 dark:text-white mt-5">Stacked Line Chart Representation</h5>
          <div ref={chartRef} style={{ width: '100%', height: 400 }}></div>
        </div>
      </div>
    </div>
  );
}

export default StackedLineChart;