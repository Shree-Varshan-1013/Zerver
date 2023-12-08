var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, 'dark', {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

let base = +new Date(1988, 9, 3);
let oneDay = 24 * 3600 * 1000;
let data = [[base, Math.random() * 300]];
for (let i = 1; i < 20000; i++) {
  let now = new Date((base += oneDay));
  data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}
option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',
    text: 'Large Ara Chart'
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
      start: 0,
      end: 20
    },
    {
      start: 0,
      end: 20
    }
  ],
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {},
      data: data
    }
  ]
};

// if (option && typeof option === 'object') {
//   myChart.setOption(option);
// }

window.addEventListener('resize', myChart.resize);

option && myChart.setOption(option);




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
