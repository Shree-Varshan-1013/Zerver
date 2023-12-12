var dom = document.getElementById('live-movement-graph');
var myChart = echarts.init(dom, 'dark', {
  renderer: 'canvas',
  useDirtyRect: false
});

var option;

let now = new Date();
let oneSecond = 1000;
let maxLength = 86400; // Set the desired maximum length for the array
let data = [];

// WebSocket connection
const socket = io('http://localhost:3001');

// Listen for the initial data
socket.on('initialDataFromServer', (initialData) => {
  // Ensure the data array doesn't exceed the maximum length
  data = initialData.slice(-maxLength);

  // Update the chart with the fetched data
  myChart.setOption({
    series: [
      {
        data: data.map((value, index) => [now - (data.length - index - 1) * oneSecond, value])
      }
    ]
  });
});

// Listen for real-time updates
socket.on('dataFromServer', (newData) => {
  let newTimestamp = +new Date();
  data.push(newData.value);

  // Ensure the data array doesn't exceed the maximum length
  data = data.slice(-maxLength);

  // Update local storage
  localStorage.setItem('chartData', JSON.stringify(data));

  // Update the chart with the new data
  myChart.setOption({
    series: [
      {
        data: data.map((value, index) => [newTimestamp - (data.length - index - 1) * oneSecond, value])
      }
    ]
  });
});

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
      name: 'Log Data',
      type: 'line',
      showSymbol: false,
      lineStyle: {
        width: 1
      },
      data: data
    }
  ]
};

myChart.setOption(option);

// Load data from local storage on page load
const storedData = localStorage.getItem('chartData');

if (storedData) {
  // Ensure the stored data array doesn't exceed the maximum length
  data = JSON.parse(storedData).slice(-maxLength);
  myChart.setOption({
    series: [
      {
        data: data.map((value, index) => [now - (data.length - index - 1) * oneSecond, value])
      }
    ]
  });
}

window.addEventListener('resize', myChart.resize);
