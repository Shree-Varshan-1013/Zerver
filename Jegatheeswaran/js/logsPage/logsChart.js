var dom = document.getElementById('live-movement-graph');
var myChart = echarts.init(dom, 'light', {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

function randomData() {
  now = new Date(+now + OneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value)
    ]
  };
}
let data1 = [];
let now = new Date(); // Initialize 'now' with the current date and time
let OneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
  data1.push(randomData());
}
option = {
  title: {
    text: 'log-data',
    textStyle: {
      color: '#FFFFFF', // Set the title color to white using hex value
      fontWeight: 'bold' // Set the font weight to bold
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0];
      var date = new Date(params.name);
      return (
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() +
        ' : ' +
        params.value[1]
      );
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: function (value) {
        var date = new Date(value);
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      },
      interval: 2 * 60 * 1000, // Set the interval to two minutes
      rotate: 45, // Rotate the labels for better readability
      position: 'top' // Display labels at the top
    },
    axisPointer: {
      snap: true, // Enable snapping to data points
      label: {
        show: true,
        formatter: function (params) {
          var date = new Date(params.value);
          return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        },
        backgroundColor: '#777', // Background color for the tooltip
        borderColor: '#666', // Border color for the tooltip
        borderWidth: 1, // Border width for the tooltip
        shadowBlur: 0, // Shadow blur for the tooltip
        shadowOffsetX: 0, // Shadow offset X for the tooltip
        shadowOffsetY: 0, // Shadow offset Y for the tooltip
        textStyle: {
          color: '#FFF' // Text color for the tooltip
        }
      }
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      data: data1,
      lineStyle: {
        color: '#00FF00' // Set the line color to green using hex value
      },
    }
  ],
  textStyle: {
    color: '#FFFFFF', // Set the text color for other legends to white using hex value
    fontWeight: 'normal' // Set the font weight to normal
  }
};
setInterval(function () {
  for (var i = 0; i < 5; i++) {
    data1.shift();
    data1.push(randomData());
  }
  myChart.setOption({
    series: [
      {
        data: data1
      }
    ]
  });
}, 1000);

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);



// const resultEventData = document.querySelector(".result-event-data");
// const inputDataTimeClass = document.querySelector(".input-data-time");
// const inputDataTimeId = document.querySelector("#datatime");

// inputDataTimeId.addEventListener("change", () => {
// 	inputDataTimeClass.style = "display: none;";
// 	resultEventData.innerText = `O evento será realizado na data ${formatDate(
// 		inputDataTimeId.value
// 	)}.`;
// });

// const formatDate = (element) => {
// 	console.log(element, "ELEMENT");
// 	const splitDate = element.split("T");
// 	const date = splitDate[0].split("-").reverse().join("/");
// 	const hours = splitDate[1];

// 	return `${date} às ${hours}`;
// };

// inputDataTimeId.value = "2023-01-16T09:06:33";



// var dom = document.getElementById('live-movement-graph');
// var myChart = echarts.init(dom, 'light', {
//   renderer: 'canvas',
//   useDirtyRect: false
// });

// var option;
// var data1 = [];

// // WebSocket connection
// // var socket = new WebSocket('ws:127.0.0.1:5000/'); // Change the URL accordingly
// var socket = new WebSocket('ws://localhost:5000/test');
  

// socket.onopen = function (event) {
//   console.log('WebSocket connection opened:', event);
// };

// socket.onmessage = function (event) {
//   var newData = JSON.parse(event.data);
//   data1.shift();
//   data1.push(newData);
//   updateChart();
// };

// socket.onclose = function (event) {
//   console.log('WebSocket connection closed:', event);
// };

// function updateChart() {
//   myChart.setOption({
//     series: [{
//       data: data1
//     }]
//   });
// }

// // ... rest of your ECharts options and configurations ...

// if (option && typeof option === 'object') {
//   myChart.setOption(option);
// }

// window.addEventListener('resize', myChart.resize);




document.addEventListener('DOMContentLoaded', function () {
  // Get the start and end datetime inputs
  const startDatetimeInput = document.querySelector('input[name="start"]');
  const endDatetimeInput = document.querySelector('input[name="end"]');

  // Get the start and end time inputs
  const startTimeInput = document.querySelector('input[name="startTime"]');
  const endTimeInput = document.querySelector('input[name="endTime"]');

  // Add an event listener to the start datetime input
  startDatetimeInput.addEventListener('input', function () {
      // Set the min attribute of the end datetime input to the value of the start datetime input
      endDatetimeInput.min = startDatetimeInput.value;
      
      // If the start datetime input has a value, set the min attribute of the end time input to the value of the start time input
      if (startDatetimeInput.value) {
          endTimeInput.min = startTimeInput.value;
      }
  });

  // Add an event listener to the start time input
  startTimeInput.addEventListener('input', function () {
      // If the start time input has a value, set the min attribute of the end time input to the value of the start time input
      if (startTimeInput.value) {
          endTimeInput.min = startTimeInput.value;
      }
  });
}); 


