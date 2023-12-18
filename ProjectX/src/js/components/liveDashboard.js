// document.addEventListener('DOMContentLoaded', function () {
//   var options = {
//     series: [{
//       name: 'XYZ MOTORS',
//       data: []
//     }],
//     chart: {
//       type: 'area',
//       stacked: false,
//       height: 350,
//       zoom: {
//         type: 'x',
//         enabled: true,
//         autoScaleYaxis: true
//       },
//       toolbar: {
//         autoSelected: 'zoom'
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     markers: {
//       size: 0,
//     },
//     title: {
//       text: 'Stock Price Movement',
//       align: 'left'
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shadeIntensity: 1,
//         inverseColors: false,
//         opacityFrom: 0.5,
//         opacityTo: 0,
//         stops: [0, 90, 100]
//       },
//     },
//     yaxis: {
//       labels: {
//         formatter: function (val) {
//           return val.toFixed(0);
//         },
//       },
//       title: {
//         text: 'Value'
//       },
//     },
//     xaxis: {
//       type: 'datetime',
//     },
//     tooltip: {
//       shared: false,
//       y: {
//         formatter: function (val) {
//           return val.toFixed(0);
//         }
//       }
//     }
//   };

//   var chart = new ApexCharts(document.getElementById("chart-container"), options);
//   chart.render();

//   var socket = io('http://localhost:3001');

//   socket.on('request', function (data) {
//     var newData = data.data;

//     var dates = newData.map(function (entry) {
//       return {
//         x: new Date(entry.timestamp),
//         y: parseInt(entry.status_code)
//       };
//     });

//     chart.updateSeries([{
//       name: 'XYZ MOTORS',
//       data: dates
//     }]);
//   });
// });


document.addEventListener("DOMContentLoaded", function () {
  // WebSocket connection
  const socket = io('http://localhost:3001');

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
          color: '#ffffff'
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
    var chart = new ApexCharts(document.getElementById("chart-container"), options);
    chart.render();

    return chart;
  }

  // Create the initial chart
  var chart = initializeChart();

 // Function to update the chart with new data
// Function to update the chart with new data
function updateChart(data) {
  // Extract timestamp and logs_count from the data object
  const timestamps = data.map(item => new Date(item.timestamp));
  const logsCount = data.map(item => item.logs_count);
  console.log(logsCount);

  // Update the chart series with processed data
  chart.updateSeries([{
    data: timestamps.map((timestamp, index) => ({
      x: timestamp,
      y: logsCount[index]
    }))
  }]);
}



  // WebSocket connection status
  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  // Listen for 'emitLogsCount' event from the server
  socket.on('request', (data) => {
    console.log('Logs chart data:', JSON.stringify(data));
    updateChart(data);
  });
});