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
      name: 'STOCK ABC',
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
      text: 'Fundamental Analysis of Stocks',
      align: 'left'
    },
    subtitle: {
      text: 'Price Movements',
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
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'dark',
    //     shadeIntensity: 1,
    //     inverseColors: false,
    //     opacityFrom: 1,
    //     opacityTo: 0,
    //     stops: [0, today <= new Date(data.labels[0]) ? 100 : 0],
    //   }
    // },
    colors: ['#FF0000'], // Red color
  };

  var chart = new ApexCharts(document.getElementById('user-estimation-forecast'), options);
  chart.render();
}


document.addEventListener('DOMContentLoaded', function () {
  // Your chart initialization code here
  fetchUserEstimationData();
  // fetchUserAndLogsEstimationData();
});
