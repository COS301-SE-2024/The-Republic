import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const TransitionOfParliament: React.FC = () => {
    useEffect(() => {
        const data = [
            { value: 800, name: 'A' },
            { value: 635, name: 'B' },
            { value: 580, name: 'C' },
            { value: 484, name: 'D' },
            { value: 300, name: 'E' },
            { value: 200, name: 'F' }
        ];

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
                    data: data
                }
            ]
        };

        const parliamentOption = (() => {
            const sum = data.reduce((sum, cur) => sum + cur.value, 0);

            const angles: number[] = [];
            const startAngle = -Math.PI / 2;
            let curAngle = startAngle;
            data.forEach((item) => {
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
                    data: data,
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
            const myChart = echarts.init(chartElement);
            myChart.setOption(currentOption);

            const intervalId = setInterval(() => {
                currentOption = currentOption === pieOption ? parliamentOption : pieOption;
                myChart.setOption(currentOption);
            }, 2000);

            return () => {
                clearInterval(intervalId);
                myChart.dispose();
            };
        }
    }, []);

    return (
        <div className="col-lg-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Transition of Parliament Representation</h5>
                    <div id="transitionOfParliament" style={{ width: '100%', height: '400px' }} className="echart"></div>
                </div>
            </div>
        </div>
    );
};

export default TransitionOfParliament;
