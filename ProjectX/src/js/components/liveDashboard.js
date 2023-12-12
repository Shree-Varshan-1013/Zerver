var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, 'dark', {
  renderer: 'canvas',
  useDirtyRect: false
});

var option;

let now = new Date();
let oneSecond = 1000;
let numberOfDataPoints = 60;
let randomValues = Array.from({ length: numberOfDataPoints }, () =>
  Math.round(Math.abs((Math.random(1,1000) + 0.5) * 20))
);

let data = randomValues.map((value, index) => [now - (numberOfDataPoints - index - 1) * oneSecond, value]);

option = {
  backgroundColor: 'transparent',
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
      name: 'Log Data',
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

// Socket.io connection
const socket = io('http://localhost:3001');


socket.on('dataFromServer', (data) => {

  let newTimestamp = +new Date();
  randomValues.push(data.value);
  randomValues.shift();
  myChart.setOption({
    series: [
      {
        data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
      }
    ]
  });
});
window.addEventListener('resize', myChart.resize);




