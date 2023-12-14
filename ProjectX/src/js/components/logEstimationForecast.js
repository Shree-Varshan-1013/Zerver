// Replace with your server URL
const socket = io('http://localhost:3001');

// Function to fetch user and logs estimation data
function fetchUserAndLogsEstimationData() {
  // Emit an event to request data from the backend as soon as the socket connection is established
  socket.on('connect', () => {
    socket.emit('requestUserAndLogsForecast');
  });

  socket.on('userAndLogsForecast', (data) => {
    console.log(data);
    // Update the chart with the received user and logs data
    updateChart(data.userForecast, data.logsForecast);
  });
}

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
      height: 350,
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
      categories: userForecast.map(entry => entry.yhat), // Replace with the actual property
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  // Get the existing chart element
  var existingChart = document.getElementById("log-estimation-forecast");

  // Check if the chart already exists
  if (existingChart) {
    // If the chart exists, destroy it before rendering a new one
    existingChart.innerHTML = "";
    existingChart.remove();
  }

  // Create a new chart element
  var newChart = document.createElement("div");
  newChart.id = "log-estimation-forecast";

  // Append the new chart element to the document body
  document.body.appendChild(newChart);

  // Render the chart in the new chart element
  var chart = new ApexCharts(newChart, options);
  chart.render();
}

// Call the function to fetch and update the chart with user and logs estimation data
fetchUserAndLogsEstimationData();
