import ApexCharts from 'apexcharts';
const animatedBar = () => {
  var options = {
    series: [
      {
        name: 'CPU',
        data: []
      },
      {
        name: 'MEMORY',
        data: []
      }
    ],
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          pan: true,
          reset: true,
        },
        autoSelected: 'zoom'
      },
    },
    title: {
      text: 'Server Health',
      align: 'left',
      style: {
        fontSize: '28px',
        color: '#cbd5e1'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: []
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  var chart = new ApexCharts(document.querySelector("#animatedbar"), options);
  chart.render();
  // const socket = io("http://localhost:3001");
 
  // socket.addEventListener('cpuArray', (event) => {
   
  //   console.log("Cpu",event.data);
 
    
  // });

  // socket.addEventListener('memoryArray', (event1) => {
  
  //    console.log("Memory",event1.data);
   
  // });
  
  
 
}

export default animatedBar;
