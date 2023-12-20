import ApexCharts from 'apexcharts';
const animatedBar = () => {
  var options = {
    series: [
      {
        name: 'CPU',
        data: [23,45,67,89,90]
      },
      {
        name: 'MEMORY',
        data: [30,50,45,79,56]
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
        color: '#BA77F9'
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
      categories: [10,11,12,13,14]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  var chart = new ApexCharts(document.getElementById("animatedbar"), options);
  chart.render();

  // window.soc.addEventListener('twoArray', (event) => {
  //   console.log("Two", event.data);
  
  //   // Initialize empty arrays for CPU and MEMORY data
  //   let allCPUData = [];
  //   let allMemoryData = [];
  //   let allCategories = [];
  
  //   // Process each array in event.data
  //   event.data.forEach((arrayItem) => {
  //     // Ensure arrayItem is an array or convert it to a single-item array
  //     const dataArray = Array.isArray(arrayItem) ? arrayItem : [arrayItem];
  
  //     // Map the data for CPU and MEMORY
  //     const cpuData = dataArray.map((item) => ({
  //       x: new Date(item.timestamp).getTime(),
  //       y: item.cpu_percentage,
  //     }));
  
  //     const memoryData = dataArray.map((item) => ({
  //       x: new Date(item.timestamp).getTime(),
  //       y: item.memory_percentage,
  //     }));
  
  //     // Concatenate the data to the existing arrays
  //     allCPUData = allCPUData.concat(cpuData);
  //     allMemoryData = allMemoryData.concat(memoryData);
  
  //     // Extract unique timestamps (assuming timestamps are same for all arrays)
  //     const timestamps = dataArray.map((item) => new Date(item.timestamp).getTime());
  //     allCategories = allCategories.concat(timestamps);
  //   });
  
  //   // Update series data
  //   chart.updateSeries([
  //     { name: 'CPU', data: allCPUData },
  //     { name: 'MEMORY', data: allMemoryData },
  //   ]);
    
  //   // Update x-axis categories
  //   chart.updateOptions({
  //     xaxis: {
  //       categories: allCategories,
  //     },
  //   });
  // });
  

  
  
 
}

export default animatedBar;
