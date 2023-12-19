import ApexCharts from 'apexcharts';
const healthPie=()=>{
var options = {
    series: [44, 55],
    chart: {
    type: 'donut',
  },
  labels: ['Used Memory', 'Free Memory'],
  title: {
    text: 'Virtual Memory Usage', // Add your desired title here
    align: 'left',
    margin: 10,
    offsetY: 0,
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
  },
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

  var chart = new ApexCharts(document.querySelector("#charthealth"), options);
  chart.render();

  window.soc.addEventListener('all_metrices', (event) => {
    const free=event.virtual_memory.free;
    const used=event.virtual_memory.used;
    // console.log("VM",event.virtual_memory);
    // console.log("VM",used);
    chart.updateSeries([free, used]);
    
  });
}
export default healthPie;