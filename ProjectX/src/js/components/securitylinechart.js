import ApexCharts from 'apexcharts';
const securityLine = () => {
var options = {
    series: [{
      name: "Desktops",
      data: [100, 410, 350, 510, 490, 620]
  }],
    chart: {
    height: 350,
    type: 'line',
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
    text: 'Product Trends by Month',
    align: 'left'
  },
  grid: {
    row: {
    //   colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
  }
  };

  var chart = new ApexCharts(document.querySelector("#securityLine"), options);
  chart.render();
}
export default securityLine;