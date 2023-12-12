import ApexCharts from 'apexcharts';
import domtoimage from 'dom-to-image';

const performance = () => {
    var optionsProgress1 = {
        chart: {
            height: 70,
            type: 'bar',
            stacked: true,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '20%',
                colors: {
                    backgroundBarColors: ['#40475D']
                }
            },
        },
        stroke: {
            width: 0,
        },
        series: [{
            name: 'CPU',
            data: [44]
        }],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: 5,
            text: 'CPU'
        },
        subtitle: {
            floating: true,
            align: 'right',
            offsetY: 0,
            text: '44%',
            style: {
                fontSize: '20px'
            }
        },
        tooltip: {
            enabled: false
        },
        xaxis: {
            categories: ['CPU'],
        },
        yaxis: {
            max: 10
        },
        fill: {
            opacity: 1
        }
    }

    var chartProgress1 = new ApexCharts(document.querySelector('#progress1'), optionsProgress1);
    chartProgress1.render();

    var optionsProgress2 = {
        chart: {
            height: 70,
            type: 'bar',
            stacked: true,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '20%',
                colors: {
                    backgroundBarColors: ['#40475D']
                }
            },
        },
        colors: ['#17ead9'],
        stroke: {
            width: 0,
        },
        series: [{
            name: 'Memory',
            data: [8]
        }],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: 5,
            text: 'Memory'
        },
        subtitle: {
            floating: true,
            align: 'right',
            offsetY: 0,
            text: '8%',
            style: {
                fontSize: '20px'
            }
        },
        tooltip: {
            enabled: false
        },
        xaxis: {
            categories: ['Memory'],
        },
        yaxis: {
            max: 10
        },
        fill: {
            type: 'gradient',
            gradient: {
                inverseColors: false,
                gradientToColors: ['#6078ea']
            }
        },
    }


    var chartProgress2 = new ApexCharts(document.querySelector('#progress2'), optionsProgress2);
    chartProgress2.render();

    var optionsProgress3 = {
        chart: {
            height: 70,
            type: 'bar',
            stacked: true,
            sparkline: {
                enabled: true
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '20%',
                colors: {
                    backgroundBarColors: ['#40475D']
                }
            },
        },
        colors: ['#f02fc2'],
        stroke: {
            width: 0,
        },
        series: [{
            name: 'Star Rating',
            data: [74]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                gradientToColors: ['#6094ea']
            }
        },
        title: {
            floating: true,
            offsetX: -10,
            offsetY: 5,
            text: 'Star Rating'
        },
        subtitle: {
            floating: true,
            align: 'right',
            offsetY: 0,
            text: '74%',
            style: {
                fontSize: '20px'
            }
        },
        tooltip: {
            enabled: false
        },
        xaxis: {
            categories: ['Star Rating'],
        },
        yaxis: {
            max: 10
        },
    }

    var chartProgress3 = new ApexCharts(document.querySelector('#progress3'), optionsProgress3);
    chartProgress3.render();

    
    const combineButton = document.getElementById('combineButton');
    combineButton.addEventListener('click', () => {
        const chartsContainer = document.getElementById('chartsContainer');

        domtoimage.toBlob(chartsContainer)
            .then((blob) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'server-performance.png';

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Error combining charts:', error);
            });
    });
    const socket = io("http://localhost:3001");

  // Listen for WebSocket messages
  socket.addEventListener('totalStars', (event) => {
    const newData = event.data;
    // console.log("Star",newData);
   
    const totalStarsSum = newData.reduce((sum, data) => sum + data.total_stars, 0);
    const maxPossibleValue = 100;

// Calculate the percentage
const percentage = (totalStarsSum / 100);
const roundedPercentage = percentage.toFixed(0);
// console.log("Total Stars Sum (out of 100):", roundedPercentage);
    
    // Update the chart with new data
    chartProgress3.updateSeries([{
        data: [roundedPercentage]
    }]);
    chartProgress3.updateOptions({
        subtitle: {
            text: `${roundedPercentage}%`
        }
    });
  });
  socket.addEventListener('cpuUsage', (event) => {
    const newData = event.data;
    // console.log("Cpu",newData);
   
    const totalCpuSum = newData.reduce((sum, data) => sum + data.cpu_percent, 0);
    const maxPossibleValue = 100;

// Calculate the percentage
const cpupercentage = (totalCpuSum / 1000);
const cpuroundedPercentage = cpupercentage.toFixed(0);
// console.log("Total CPU SUM (out of 100):", cpuroundedPercentage);
    
    // Update the chart with new data
    chartProgress1.updateSeries([{
        data: [cpuroundedPercentage]
    }]);
    chartProgress1.updateOptions({
        subtitle:{
            text: `${cpuroundedPercentage}%`
        }
    });
  });
  socket.addEventListener('memoryUsage', (event) => {
    const newData = event.data;
    // console.log("memory",newData);
   
    const totalMemorySum = newData.reduce((sum, data) => sum + data.percent_used, 0);
    const maxPossibleValue = 100;

// Calculate the percentage
const memorypercentage = (totalMemorySum / 1000);
const memoryroundedPercentage = memorypercentage.toFixed(0);
// console.log("Total CPU SUM (out of 100):", memoryroundedPercentage);
    
    // Update the chart with new data
    chartProgress2.updateSeries([{
        data: [memoryroundedPercentage]
    }]);
    chartProgress2.updateOptions({
        subtitle:{
            text: `${memoryroundedPercentage}%`
        }
    });
  });

}

export default performance;
