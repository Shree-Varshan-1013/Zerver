var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, 'dark', {
  renderer: 'canvas',
  useDirtyRect: false
});

var option;

let now = +new Date();
let oneSecond = 1000;
let numberOfDataPoints = 60;
let randomValues = Array.from({ length: numberOfDataPoints }, () =>
  Math.round(Math.abs((Math.random(1,1000) + 0.5) * 20))
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

// Socket.io connection
const socket = io('http://localhost:3001');

// Update chart dynamically when receiving data from socket
socket.on('dataFromServer', (data) => {
  let newTimestamp = +new Date();
  // Add the new random value to the array
  randomValues.push(data.value);
  // Remove the oldest random value
  randomValues.shift();
  // Update the chart data with the updated array
  myChart.setOption({
    series: [
      {
        data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
      }
    ]
  });
});


// const socket = io('http://localhost:3001'); // Replace with your server URL

// socket.on('dataFromServer', (data) => {
//   dataPoints.push({ x: dataPoints.length + 1, y: data.value });
//   if (dataPoints.length > 10) {
//     dataPoints.shift(); // Keep a certain number of data points
//   }

//   myChart.update(); // Update the chart with new data
// });

window.addEventListener('resize', myChart.resize);





// <<======== on/off  =========>

// Get the status indicator and status text elements
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Function to update the status
function updateStatus(isOn) {
    if (isOn) {
        statusIndicator.classList.remove('bg-red-500');
        statusIndicator.classList.add('bg-green-500');
        statusText.textContent = 'ON';
    } else {
        statusIndicator.classList.remove('bg-green-500');
        statusIndicator.classList.add('bg-red-700');
        statusText.textContent = 'OFF';
    }
}

// function change() {
//     if(updateStatus(true)) {
//         return updateStatus(false);
//     }
//     else{
//         return updateStatus(true);
//     }
// }

// Example: Update the status to On after 2 seconds (simulating a change)
setTimeout(() => {
    updateStatus(true);
    // change();
}, 2000);
