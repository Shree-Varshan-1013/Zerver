import ApexCharts from 'apexcharts';
const heatMap = () => {
  const generateData = (count, yRange) => {
    let i = 0;
    const series = [];
    
    while (i < count) {
      const x = 'w' + (i + 1);
      const y = Math.floor(Math.random() * (yRange.max - yRange.min + 1)) + yRange.min;
      series.push({
        x: x,
        y: y
      });
      i++;
    }
  
    return series;
  };  
  var options = {
    series: [{
    name: 'Sunday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Monday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Tuesday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Wednesday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Thursday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Friday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Saturday',
    data: generateData(52, {
      min: 0,
      max: 90
    })
  },
  
  ],
    chart: {
    height: 350,
    type: 'heatmap',
  },
  dataLabels: {
    enabled: false
  },
  colors: ["#008FFB"],
  title: {
    text: "Yearly Error Logs",
    style: {
      color: '#af5aff', // Text color
      fontSize: '24px', // Font size
   
    }
  },
  };

  var chart = new ApexCharts(document.querySelector("#heatmap"), options);
  chart.render();

}

export default heatMap;