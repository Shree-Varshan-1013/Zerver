var dom = document.getElementById('live-movement-graph');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});

var app = {};

var option;

// Manually provided data array
let data_dynamic = [
  { name: '1997-10-03', value: ['1997/10/03', 150] },
  { name: '1997-10-04', value: ['1997/10/04', 200] },
  { name: '1997-10-05', value: ['1997/10/05', 120] },
  { name: '1997-10-06', value: ['1997/10/06', 300] },
  { name: '1997-10-07', value: ['1997/10/07', 180] },
  // Add more data points as needed
];

option = {
  title: {
    text: 'Dynamic Data & Time Axis'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0];
      var date = new Date(params.name);
      return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
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
      data: data_dynamic
    }
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
