import ApexCharts from 'apexcharts';

const allGraphs = () => {

    const liveDashBoard = () => {

    }

    const logDashBoard = () => {

    }

    const virtualMemoryGraph = () => {

    }

    const serverHealth = () => {

    }

    const logPerformance = () => {

    }

    const threeProgress = () => {

    }

    const risks = () => {
        var chartDom = document.getElementById('piechart');
        var myChartZ = echarts.init(chartDom);
        var darkMode = JSON.parse(localStorage.getItem('darkMode'));
        var option;

        // Initialize with dummy data
        var initialData = [
            { value: 0, name: 'Low' },
            { value: 0, name: 'Important' },
            { value: 0, name: 'Moderate' },
            { value: 0, name: 'Critical' },
        ];

        option = {
            title: {
                text: 'Security Risk Levels', // Add your desired title here
                left: '0',
                textStyle: {
                    color: darkMode ? '#af5aff' : 'black',
                },
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                top: '5%',
                left: 'center',
                textStyle: {
                    color: 'grey',
                },
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        pixelRatio: 2,
                    },
                },
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: initialData, // Use the initial data

                },
            ],
        };

        // Listen for WebSocket messages

        window.soc.addEventListener('vCount', (event) => {
            const newData = event.data;
            const newLow = newData.Low;
            const newCritical = newData.Critical;
            const newImportant = newData.Important;
            const newModerate = newData.Moderate;
            // console.log("Low ",newLow);
            // Map the WebSocket data to the format expected by ECharts
            const mappedData = [
                { value: newData.Low, name: 'Low' },
                { value: newData.Important, name: 'Important' },
                { value: newData.Moderate, name: 'Moderate' },
                { value: newData.Critical, name: 'Critical' },

            ];

            // Update the chart with new data
            myChartZ.setOption({
                series: [
                    {
                        data: mappedData,
                    },
                ],
            });
        });
        option && myChartZ.setOption(option);
    }

    const errorCounts = () => {
        var options = {
            series: [{
                name: "Errors",
                data: [100, 410, 350, 510, 490, 620, 690]
            }],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Error Counts',
                align: 'left',
                style: {
                    color: '#af5aff', // Text color
                    fontSize: '24px', // Font size

                }
            },
            grid: {
                row: {
                    //   colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
            }
        };

        var chartE = new ApexCharts(document.querySelector("#securityLine"), options);
        chartE.render();

        // Listen for WebSocket messages
        window.soc.addEventListener('vLimit', (event) => {
            const newData = event.data;
            console.log("Limit", newData);
            const timestamp = newData.timestamp;
            const calculateSum = (array) => {
                const values = Object.keys(array).filter(key => key !== '_id').map(key => array[key]);
                let min = 1;
                let max = 10;
                let randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
                return values.reduce((sum, value) => sum + value, randomValue);
            };

            const sums = newData.map(calculateSum);

            console.log(sums);

            //   // Map each value of sums to the data array
            const updatedData = sums.map((sum, index) => ({
                _id: newData[index]._id,
                sum: sum
            }));

            //   // Update the chart with new data
            chartE.updateSeries([{
                data: updatedData.map(item => item.sum)
            }]);
            // Update the chart with new data

        });
    }

    const yearlyErrorLogs = () => {
        const generateData = (count, yRange) => {
            let i = 0;
            const series = [];

            while (i < count) {
                const x = 'w' + (i + 1);
                const y = Math.floor(Math.random() * (yRange.max - yRange.min + 1)) + yRange.min;
                series.push({
                    x: x,
                    y: y
                });
                i++;
            }

            return series;
        };
        var options = {
            series: [{
                name: 'Sunday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Monday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Tuesday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Wednesday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Thursday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Friday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },
            {
                name: 'Saturday',
                data: generateData(52, {
                    min: 0,
                    max: 90
                })
            },

            ],
            chart: {
                height: 350,
                type: 'heatmap',
            },
            dataLabels: {
                enabled: false
            },
            colors: ["#008FFB"],
            title: {
                text: "Yearly Error Logs",
                style: {
                    color: '#af5aff', // Text color
                    fontSize: '24px', // Font size

                }
            },
        };

        var chartY = new ApexCharts(document.querySelector("#heatmap"), options);
        chartY.render();
    }

    const overAllServer = () => {

    }

    const worldMap = () => {

    }

    risks();
    errorCounts();
    yearlyErrorLogs();
    
}

export default allGraphs;