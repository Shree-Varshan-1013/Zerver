var options = {
  series: [{
    // name: "CUSTOM STOCK",
    data: [10, 20, 15, 25, 30, 18, 22] // Replace this array with your custom data
  }],
  chart: {
    type: 'line', // You can change the chart type (e.g., 'line', 'bar', 'candlestick', etc.)
    height: 400,
    zoom: {
      enabled: true // Enable or disable zooming
    }
  },
  dataLabels: {
    enabled: true // Show or hide data labels on the chart
  },
  stroke: {
    curve: 'smooth' // Change the curve type ('smooth', 'straight', etc.)
  },
  title: {
    text: 'Log Request analysis',
    align: 'center'
  },
  subtitle: {
    // text: 'Custom Price Movements',
    align: 'center'
  },
  labels: ['10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'], // Replace with your custom labels
  xaxis: {
    type: 'category' // Change to 'datetime' if using date-based x-axis
  },
  yaxis: {
    opposite: false // Change to true if you want the y-axis on the right side
  },
  legend: {
    horizontalAlign: 'center' // Change legend alignment
  }
};

var chart = new ApexCharts(document.querySelector("#chart-container"), options);
chart.render();