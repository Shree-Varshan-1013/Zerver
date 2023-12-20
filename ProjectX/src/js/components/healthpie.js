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
      color: '#BA77F9',
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
    console.log("Memory",event);
    if(event){
    const free=event.mem.available_percent;
    const used=event.mem.used_percent;
    // console.log("VM",event.virtual_memory.free);
    // console.log("VM",used);
    chart.updateSeries([free, used]);
    }
    
    
  });
}
export default healthPie;