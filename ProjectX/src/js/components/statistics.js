import ApexCharts from 'apexcharts';
const statistics = () => {
    window.Apex = {
        chart: {
            foreColor: '#ccc',
            toolbar: {
                show: false
            },
        },
        stroke: {
            width: 3
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'dark'
        },
        grid: {
            borderColor: "#535A6C",
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };
    
    var optionsArea = {
        chart: {
            height: 380,
            type: 'area',
            stacked: false,
        },
        stroke: {
            curve: 'straight'
        },
        colors: ['#3366FF', '#33FF57', '#FF5733'],
        series: [{
            name: "Total",
            data: [11, 15, 26, 20, 33, 27]
        },
        {
            name: "Success",
            data: [32, 33, 21, 42, 19, 32]
        },
        {
            name: "Failure",
            data: [20, 39, 52, 11, 29, 43]
        }
        ],
        xaxis: {
            categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2'],
        },
        tooltip: {
            followCursor: true
        },
        fill: {
            opacity: 1,
        },
    
    }
    
    var chartArea = new ApexCharts(
        document.querySelector("#areachart"),
        optionsArea
    );
    
    chartArea.render();
}

export default statistics;