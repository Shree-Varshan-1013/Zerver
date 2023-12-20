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
            max: 100
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
            max: 100
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
            name: 'Performance',
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
            text: 'Performance'
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
            categories: ['Performance'],
        },
        yaxis: {
            max: 100
        },
    }

    var chartProgress3 = new ApexCharts(document.querySelector('#progress3'), optionsProgress3);
    chartProgress3.render();

    
document.addEventListener("DOMContentLoaded", function () {
  // Listen for WebSocket messages
  window.soc.addEventListener('all_metrices', (event) => {
    // const newData1 = event.data;
    console.log("Graph",event);
   
   
 // console.log("T1otal Stars Sum (out of 100):", roundedPercentage);
    
    // Update the chart with new data
   
    chartProgress1.updateSeries([{
        data: [event.cpu]
    }]);
    chartProgress1.updateOptions({
        subtitle:{
            text: `${event.cpu.toFixed(2)}%`
        }
    });
    chartProgress2.updateSeries([{
        data: [event.mem.used_percent]
    }]);
    chartProgress2.updateOptions({
        subtitle:{
            text: `${event.mem.used_percent.toFixed(2)}%`
        }
    });
    chartProgress3.updateSeries([{
        data: [(event.total_stars)/10]
    }]);
    chartProgress3.updateOptions({
        subtitle: {
            text: `${((event.total_stars)/10).toFixed(2)}%`
        }
    });
  });
});
}

export default performance;
