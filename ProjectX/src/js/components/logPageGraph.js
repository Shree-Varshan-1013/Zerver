// var dom = document.getElementById('live-movement-graph');
// var myChart = echarts.init(dom, 'light', {
//   renderer: 'canvas',
//   useDirtyRect: true
// });

// var option;

// let oneSecond = 1000;
// let numberOfDataPoints = 86400;
// let storedValues = JSON.parse(localStorage.getItem('storedValues')) || [];
// let now = new Date();
// let randomValues = storedValues.length === numberOfDataPoints ? storedValues : generateRandomValues();

// function generateRandomValues() {
//   return Array.from({ length: numberOfDataPoints }, () =>
//     Math.round(Math.abs((Math.random(1, 1000) + 0.5) * 20))
//   );
// }

// function updateLocalStorage(newData) {
//   storedValues.push(newData);
//   if (storedValues.length > numberOfDataPoints) {
//     storedValues.shift(); // Keep the array length within the limit
//   }
//   localStorage.setItem('storedValues', JSON.stringify(storedValues));
// }

// option = {
//   backgroundColor: 'transparent',
//   tooltip: {
//     trigger: 'axis',
//     position: function (pt) {
//       return [pt[0], '10%'];
//     }
//   },
//   title: {
//     left: 'center',
//     text: 'Large Area Chart'
//   },
//   toolbox: {
//     feature: {
//       dataZoom: {
//         yAxisIndex: 'none'
//       },
//       restore: {},
//       saveAsImage: {}
//     }
//   },
//   xAxis: {
//     type: 'time',
//     boundaryGap: false
//   },
//   yAxis: {
//     type: 'value',
//     boundaryGap: [0, '100%']
//   },
//   dataZoom: [
//     {
//       type: 'inside',
//       start: 80,
//       end: 100
//     },
//     {
//       start: 80,
//       end: 100
//     }
//   ],
//   series: [
//     {
//       name: 'Log Data',
//       type: 'line',
//       showSymbol: false,
//       lineStyle: {
//         width: 1
//       },
//       data: randomValues.map((value, index) => [now - (numberOfDataPoints - index - 1) * oneSecond, value])
//     }
//   ]
// };

// myChart.setOption(option);

// // window.soc.io connection
// const socket = io('http://localhost:3001');

// window.soc.on('request', (data) => {
//   let newTimestamp = +new Date();
//   const newValue = Math.max(1, data.value); // Ensure the value is at least 1
//   randomValues.push(newValue);
//   randomValues.shift();
//   myChart.setOption({
//     series: [
//       {
//         data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
//       }
//     ]
//   });

//   // Update stored values in local storage
//   updateLocalStorage(data.value);
// });

// window.addEventListener('resize', myChart.resize);



      
document.addEventListener("DOMContentLoaded", function () {
  // Function to initialize the chart with options
  function initializeChart() {
    var options = {
      series: [{
        data: []
      }],
      chart: {
        height: 350,
        type: 'area', // Use area type for a filled area chart
        zoom: {
          enabled: false
        },
        // foreColor: '#bfc7d5',
        // background: '#eff2f7',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1,
      },
      title: {
        text: 'Logs Count by Timestamp',
        align: 'left',
        style: {
          color: '#af5aff'
        }
      },
      grid: {
        row: {
          // colors: 'transparent',
          opacity: 0.5
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#bfc7d5'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#bfc7d5'
          }
        }
      },
      theme: {
        mode: 'light', 
        palette: 'palette1'
      },
      fill: {
        type: 'gradient', // Use gradient for area fill
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100],
        },
        colors: ['#00e396'], // Set the color for the gradient
      },
      markers: {
        size: 4,
        colors: '#00e396',
        strokeColors: '#fff',
        strokeWidth: 1,
      },
    };

    // Create the initial chart
    var chart = new ApexCharts(document.getElementById("live-movement-graph"), options);
    chart.render();

    return chart;
  }

  // Create the initial chart
  var chart = initializeChart();

 // Function to update the chart with new data
// Function to update the chart with new data
function updateChart(data) {
  // Extract timestamp and logs_count from the data object
  const timestamps = data.data.map(item => new Date(item.timestamp));
  const logsCount = data.data.map(item => item.logs_count);
  // console.log(logsCount);

  // Update the chart series with processed data
  chart.updateSeries([{
    data: timestamps.map((timestamp, index) => ({
      x: timestamp,
      y: logsCount[index]
    }))
  }]);
}



  // WebSocket connection status
  window.soc.on('connect', () => {
    console.log('WebSocket connected');
  });

  window.soc.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  // Listen for 'emitLogsCount' event from the server
  window.soc.on('emitLogsCount', (data) => {
    // console.log('Logs count data:', JSON.stringify(data));
    updateChart(data);
  });
});
