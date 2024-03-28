import ApexCharts from 'apexcharts';
const healthPie2 =()=>{
var options = {
    series: [44, 55],
    chart: {
    type: 'donut',
  },
  labels: ['Used Memory', 'Free Memory'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    },
   
  }]
  };

  var chart = new ApexCharts(document.getElementById("healthchart"), options);
  chart.render();

  window.soc.addEventListener('virtualMemory', (event) => {
    const free=event.data.virtual_memory_info.free;
    const used=event.data.virtual_memory_info.used;
    console.log("VM",free);
    console.log("VM",used);
    chart.updateSeries([free, used]);
    
  });
}
export default healthPie2;