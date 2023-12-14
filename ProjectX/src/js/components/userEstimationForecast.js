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
      type: 'area',
      height: 350,
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
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [0, today <= new Date(data.labels[0]) ? 100 : 0],
      }
    },
    colors: [today <= new Date(data.labels[0]) ? '#008000' : '#FF0000'], // Green for past, Red for future
  };

  var chart = new ApexCharts(document.getElementById('user-estimation-forecast'), options);
  chart.render();
}



// Call the function to fetch and update the chart
fetchUserEstimationData();
