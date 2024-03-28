const socket = io('http://localhost:3001'); // Replace with your server URL

function fetchUserEstimationData() {
  // Make a socket connection to the backend to fetch user estimation data
  // socket.emit('fetchUserEstimationData');

  // Listen for the response from the backend
  socket.on('userForecast', (data) => {
    console.log(data);
    // Update the chart with the received data
    updateUserEstimationChart(data);
  });
}

function updateUserEstimationChart(data) {
  // Identify today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  var options = {
    series: [{
      name: 'Cost',
      data: data.seriesData
    }],
    chart: {
      height: 450,
      width: 800,
      type: 'area',
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
      text: 'Cost Estimation Forecasting',
      align: 'left'
    },
    subtitle: {
      text: 'Cost Estimations',
      align: 'left'
    },
    labels: data.labels,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    },
    colors: ['#FF0000'], 
  };

  var chart = new ApexCharts(document.getElementById('user-estimation-forecast'), options);
  chart.render();
}


document.addEventListener('DOMContentLoaded', function () {
  // Your chart initialization code here
  fetchUserEstimationData();
  // fetchUserAndLogsEstimationData();
});
