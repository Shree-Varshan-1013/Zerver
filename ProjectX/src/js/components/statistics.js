import ApexCharts from 'apexcharts';

// const updateChart = (chart, newData) => {
//     chart.updateSeries(newData);
// };
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
            toolbar: {
                show: true, 
                tools: {
                    download: true, 
                    selection: true,
                    zoom: true,
                    pan: true,
                    reset: true,
                },
                autoSelected: 'zoom'
            },
        },
        title: {
            text: 'Log Performance',
            align: 'left',
            style: {
                fontSize: '18px',
                color: '#cbd5e1'
            }
        },
        stroke: {
            curve: 'straight'
        },
        colors: ['#3366FF', '#33FF57', '#FF5733'],
        series: [{
            name: "Total",
            data: [31, 15, 26, 20, 33, 27]
        },
        {
            name: "Success",
            data: [31,45,56,78,90,56]
        },
        {
            name: "Failure",
            data: [20, 39, 52, 11, 29, 43]
        }
        ],
        xaxis: {
            categories: ['1', '2', '3', '4', '5', '6'],
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
    // const newTotalData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    // const newSuccessData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    // const newFailureData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));

    // updateChart(chartArea, [
    //     { name: 'Total', data: newTotalData },
    //     { name: 'Success', data: newSuccessData },
    //     { name: 'Failure', data: newFailureData }
    // ]);

    // const fetchData = () => {
        // newTotalData.shift();
        // newTotalData.push(Math.floor(Math.random() * 100));
        // newSuccessData.shift();
        // newSuccessData.push(Math.floor(Math.random() * 100));
        // newFailureData.shift();
        // newFailureData.push(Math.floor(Math.random() * 100));
        // updateChart(chartArea, [
        //     { name: 'Total', data: newTotalData },
        //     { name: 'Success', data: newSuccessData },
        //     { name: 'Failure', data: newFailureData }
        // ]);
    // };

    // Simulate fetching data every 5 seconds (replace with your desired interval)
    // setInterval(fetchData, 10000);
    function updateChart(chart, newData) {
        // Logic to update the chart with the new data
        // This could involve updating the series data, redrawing the chart, etc.
      
        // For example, if you're using a library like Highcharts:
        chart.update({
          series: newData
        });
      }

    window.soc.addEventListener('status_code', (event) => {
        const dataArray = event.data;
      
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const newSuccessData = [];
          const newErrorData = [];
      
          for (const currentData of dataArray) {
            if (currentData.accepted_count !== undefined) {
              newSuccessData.push(currentData.accepted_count);
            }
            if (currentData.failed_count !== undefined) {
              newErrorData.push(currentData.failed_count);
            }
          }
      
          // Replace the entire "Success" series data with the new data
          optionsArea.series[1].data = newSuccessData;
      
          // Replace the entire "Failure" series data with the new data
          optionsArea.series[2].data = newErrorData;
          
          // Update the chart
          updateChart(chartArea, [
            { name: 'Total', data: optionsArea.series[0].data },
            { name: 'Success', data: optionsArea.series[1].data },
            { name: 'Failure', data: optionsArea.series[2].data }
          ]);
        }
      });
      
      
    
    
}

export default statistics;