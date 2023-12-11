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
    name: 'Metric1',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric2',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric3',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric4',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric5',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric6',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric7',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric8',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  },
  {
    name: 'Metric9',
    data: generateData(18, {
      min: 0,
      max: 90
    })
  }
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
    text: 'HeatMap Chart (Single color)'
  },
  };

  var chart = new ApexCharts(document.querySelector("#heatmap"), options);
  chart.render();

}

export default heatMap;