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

  var chart = new ApexCharts(document.getElementById("animatedbar"), options);
  chart.render();
  const socket = io("http://localhost:3001");
 
  socket.addEventListener('twoArray', (event) => {
   
    console.log("Two",event.data);
    const newData = event.data.map(item => ({
      x: new Date(item.timestamp).getTime(), 
      y: item.cpu_percentage,
    }));

    const newMemoryData = event.data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: item.memory_percentage,
    }));

    // Update series data
    chart.updateSeries([
      { name: 'CPU', data: newData },
      { name: 'MEMORY', data: newMemoryData },
    ]);

    // Update x-axis categories
    const newCategories = event.data.map(item => new Date(item.timestamp).getTime());
    chart.updateOptions({
      xaxis: {
        categories: newCategories,
      },
    });
    
  });

  
  
 
}

export default animatedBar;
