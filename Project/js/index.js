var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, 'dark', {
    renderer: 'canvas',
    useDirtyRect: false
});

//data has been changed to data_index while combining   
function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    };
}
let data_index = [];
let now = new Date(1997, 9, 3);
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
for (var i = 0; i < 1000; i++) {
    data_index.push(randomData());
}
option = {
    title: {
        text: 'FlashDB Keys',
        top: 10,
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
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        },
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
            data: data_index,
            lineStyle: { 
                color: 'red' 
            }
        }
    ]
};

myChart.setOption(option);

setInterval(function () {
    for (var i = 0; i < 5; i++) {
        data_index.shift();
        data_index.push(randomData());
    }
    myChart.setOption({
        series: [
            {
                data: data_index
            }
        ]
    });
}, 1000);