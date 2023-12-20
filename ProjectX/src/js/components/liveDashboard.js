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

//   window.soc.on('request', function (data) {
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
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Log Graph',
        align: 'left',
        style: {
          color: '#af5aff' // Text color for the title
        }
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        labels: {
          style: {
            colors: '#bfc7d5'
          },
          title: {
            text: 'Logs'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        }
      }
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
  cc = data.data[data.data.length-1]
  data.data = data.data.filter((e,ind,arr)=> ind % 90 === 0)
  data.data.push(cc)

  const timestamps = data.data.map(item => new Date(item.timestamp));
  const logsCount = data.data.map(item => item.logs_count);
  // console.log("curr cs",cc);

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
  window.soc.on('request', (data) => {
    console.log('Logs chart data:', JSON.stringify(data));
    updateChart(data);
  });
});