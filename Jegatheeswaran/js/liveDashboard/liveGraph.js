var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, 'dark', {
  renderer: 'canvas',
  useDirtyRect: false
});

var option;

let now = +new Date();

// Assuming one data point per second for the past 60 seconds
let oneSecond = 1000;
let numberOfDataPoints = 3600;
let randomValues = Array.from({ length: numberOfDataPoints }, () =>
  Math.round(Math.abs((Math.random() + 0.5) * 20))
);

let data = randomValues.map((value, index) => [now - (numberOfDataPoints - index - 1) * oneSecond, value]);

option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',
    text: 'Large Area Chart'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'time',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [
    {
      type: 'inside',
      start: 80,
      end: 100
    },
    {
      start: 80,
      end: 100
    }
  ],
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      lineStyle: {  // Set the line style here
        width: 1  // Adjust the width as needed
      },
      data: data
    }
  ]
};

myChart.setOption(option);

// Update chart dynamically every second with smooth animation
setInterval(function () {
  let newTimestamp = +new Date();
  let randomValue = Math.round((Math.random(1,1000)) * 20);

  // Add the new random value to the array
  randomValues.push(randomValue);

  // Remove the oldest random value
  randomValues.shift();

  // Update the chart data with the updated array and enable smooth animation
  myChart.setOption({
    series: [
      {
        data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
      }
    ],
    animation: true,
    animationDuration: 1000
  });
}, 1000);

window.addEventListener('resize', myChart.resize);
