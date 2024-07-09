import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { DataItem } from "@/lib/reports";

const TransitionOfParliament: React.FC = () => {
    const [data, setData] = useState<{ resolved: { [key: string]: number }; unresolved: { [key: string]: number } }>({ resolved: {}, unresolved: {} });
    const [dataArray, setDataArray] = useState<DataItem[]>([]);

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
                console.log('API Response:', apiResponse);

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

        if (data && ('resolved' in data && 'unresolved' in data)) {
            const transformedData = transformData(data);
            setDataArray(transformedData);
        }
    }, [data]);

    useEffect(() => {
        if (dataArray.length > 0) {
            const defaultPalette = [
                '#5470c6',
                '#91cc75',
                '#fac858',
                '#ee6666',
                '#73c0de',
                '#3ba272',
                '#fc8452',
                '#9a60b4',
                '#ea7ccc'
            ];

            const radius = ['30%', '80%'];

            const pieOption: echarts.EChartsOption = {
                title: {
                    text: 'Hierarchical Distribution of Issues by Service Category',
                    left: 'center',
                    top: '0%'
                },
                series: [
                    {
                        type: 'pie',
                        id: 'distribution',
                        radius: radius,
                        label: {
                            show: true
                        },
                        universalTransition: true,
                        animationDurationUpdate: 1000,
                        data: dataArray
                    }
                ]
            };

            const parliamentOption = (() => {
                const sum = dataArray.reduce((sum, cur) => sum + cur.value, 0);

                const angles: number[] = [];
                const startAngle = -Math.PI / 2;
                let curAngle = startAngle;
                dataArray.forEach((item) => {
                    angles.push(curAngle);
                    curAngle += (item.value / sum) * Math.PI * 2;
                });
                angles.push(startAngle + Math.PI * 2);

                function parliamentLayout(
                    startAngle: number,
                    endAngle: number,
                    totalAngle: number,
                    r0: number,
                    r1: number,
                    size: number
                ) {
                    const rowsCount = Math.ceil((r1 - r0) / size);
                    const points: number[][] = [];

                    let r = r0;
                    for (let i = 0; i < rowsCount; i++) {
                        const totalRingSeatsNumber = Math.round((totalAngle * r) / size);
                        const newSize = (totalAngle * r) / totalRingSeatsNumber;
                        for (
                            let k = Math.floor((startAngle * r) / newSize) * newSize;
                            k < Math.floor((endAngle * r) / newSize) * newSize - 1e-6;
                            k += newSize
                        ) {
                            const angle = k / r;
                            const x = Math.cos(angle) * r;
                            const y = Math.sin(angle) * r;
                            points.push([x, y]);
                        }

                        r += size;
                    }

                    return points;
                }

                return {
                    series: {
                        type: 'custom',
                        id: 'distribution',
                        data: dataArray,
                        coordinateSystem: undefined,
                        universalTransition: true,
                        animationDurationUpdate: 1000,
                        renderItem: function (params, api) {
                            const idx = params.dataIndex;
                            const viewSize = Math.min(api.getWidth(), api.getHeight());
                            const r0 = ((parseFloat(radius[0]) / 100) * viewSize) / 2;
                            const r1 = ((parseFloat(radius[1]) / 100) * viewSize) / 2;
                            const cx = api.getWidth() * 0.5;
                            const cy = api.getHeight() * 0.5;
                            const size = viewSize / 50;

                            const points = parliamentLayout(
                                angles[idx],
                                angles[idx + 1],
                                Math.PI * 2,
                                r0,
                                r1,
                                size + 3
                            );

                            return {
                                type: 'group',
                                children: points.map((pt) => {
                                    return {
                                        type: 'circle',
                                        autoBatch: true,
                                        shape: {
                                            cx: cx + pt[0],
                                            cy: cy + pt[1],
                                            r: size / 2
                                        },
                                        style: {
                                            fill: defaultPalette[idx % defaultPalette.length]
                                        }
                                    };
                                })
                            };
                        }
                    }
                } as echarts.EChartsOption;
            })();

            let currentOption: echarts.EChartsOption = pieOption;
            const chartElement = document.getElementById("transitionOfParliament");

            if (chartElement) {
                const myChart = echarts.init(
                  chartElement,
                  null,
                  { width: 500 }
                );
                myChart.setOption(currentOption);

                chartElement.onmouseenter = () => {
                    myChart.setOption(parliamentOption);
                };

                chartElement.onmouseleave = () => {
                    myChart.setOption(pieOption);
                };


                return () => {
                    myChart.dispose();
                };
            }
        }
    }, [dataArray]);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <div id="transitionOfParliament" style={{ width: 'max-content', height: '400px' }} className="echart mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default TransitionOfParliament;
