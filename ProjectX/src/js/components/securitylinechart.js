import ApexCharts from 'apexcharts';
const securityLine = () => {
var options = {
    series: [{
      name: "Errors",
      data: [100, 410, 350, 510, 490, 620,690]
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
    categories: ['Sun', 'Mon', 'Tue', 'Wed','Thr', 'Fri', 'Sat'],
  }
  };

  var chart = new ApexCharts(document.querySelector("#securityLine"), options);
  chart.render();
  const socket = io("http://localhost:3001");

  // Listen for WebSocket messages
  socket.addEventListener('vLimit', (event) => {
    const newData = event.data;
    console.log("Limit",newData);
   
    const calculateSum = (array) => {
      // Exclude the "_id" property and sum the remaining values
      const values = Object.keys(array).filter(key => key !== '_id').map(key => array[key]);
      return values.reduce((sum, value) => sum + value, 0);
    };
    
    // Use map to calculate the sum for each array
    const sums = newData.map(calculateSum);
    
    console.log(sums);
    
      // Map each value of sums to the data array
      const updatedData = sums.map((sum, index) => ({
        _id: newData[index]._id,
        sum: sum
      }));
  
      // Update the chart with new data
      chart.updateSeries([{
        data: updatedData.map(item => item.sum)
      }]);
    // Update the chart with new data
    
  });
}

export default securityLine;