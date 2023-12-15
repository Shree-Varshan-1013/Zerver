// import ApexCharts from 'apexcharts';

// Replace with your server URL
const socket = io('http://localhost:3001');

// Create a variable to hold the chart instance
let chart1;

// Function to update the chart with user and logs data
function updateChart(userForecast, logsForecast) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  var options = {
    series: [
      {
        name: 'User Forecast',
        data: userForecast.map(entry => ({
          x: new Date(entry.ds).getTime(),
          y: entry.yhat, // Replace with the actual property for the user value
        })),
      },
      {
        name: 'Logs Forecast',
        data: logsForecast.map(entry => ({
          x: new Date(entry.ds).getTime(),
          y: entry.yhat, // Replace with the actual property for the logs value
        })),
      }
    ],
    chart: {
      height: 450,
      width: 800,  
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: userForecast.map(entry => new Date(entry.ds).getTime()),
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  // Check if the chart instance already exists
  if (chart1) {
    // Update the existing chart with new options
    chart1.updateOptions(options);
    // Update the series data
    chart1.updateSeries([
      {
        data: userForecast.map(entry => ({
          x: new Date(entry.ds).getTime(),
          y: entry.yhat,
        })),
      },
      {
        data: logsForecast.map(entry => ({
          x: new Date(entry.ds).getTime(),
          y: entry.yhat,
        })),
      }
    ]);
  } else {
    // Create a new chart instance
    chart1 = new ApexCharts(document.getElementById("log-estimation-forecast"), options);
    // Render the chart
    chart1.render();
  }
}

// Function to fetch user and logs estimation data
function fetchUserAndLogsEstimationData() {
  // Emit an event to request data from the backend as soon as the socket connection is established
  socket.on('connect', () => {
    socket.emit('requestUserAndLogsForecast');
  });

  // Listen for 'userAndLogsForecast' event from the server
  socket.on('userAndLogsForecast', (data) => {
    console.log("user-log-forecast", data);
    // Update the chart with the received user and logs data
    updateChart(data.userForecast, data.logsForecast);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Call the function to fetch and update the chart with user and logs estimation data
  fetchUserAndLogsEstimationData();
});
