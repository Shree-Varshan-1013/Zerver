var dom = document.getElementById('live-movement-graph');
var myChart = echarts.init(dom, 'light', {
  renderer: 'canvas',
  useDirtyRect: true
});

var option;

let oneSecond = 1000;
let numberOfDataPoints = 86400;
let storedValues = JSON.parse(localStorage.getItem('storedValues')) || [];
let now = new Date();
let randomValues = storedValues.length === numberOfDataPoints ? storedValues : generateRandomValues();

function generateRandomValues() {
  return Array.from({ length: numberOfDataPoints }, () =>
    Math.round(Math.abs((Math.random(1, 1000) + 0.5) * 20))
  );
}

function updateLocalStorage(newData) {
  storedValues.push(newData);
  if (storedValues.length > numberOfDataPoints) {
    storedValues.shift(); // Keep the array length within the limit
  }
  localStorage.setItem('storedValues', JSON.stringify(storedValues));
}

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
      lineStyle: {
        width: 1
      },
      data: randomValues.map((value, index) => [now - (numberOfDataPoints - index - 1) * oneSecond, value])
    }
  ]
};

myChart.setOption(option);

// Socket.io connection
const socket = io('http://localhost:3001');

socket.on('request', (data) => {
  let newTimestamp = +new Date();
  const newValue = Math.max(1, data.value); // Ensure the value is at least 1
  randomValues.push(newValue);
  randomValues.shift();
  myChart.setOption({
    series: [
      {
        data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
      }
    ]
  });

  // Update stored values in local storage
  updateLocalStorage(data.value);
});

window.addEventListener('resize', myChart.resize);
