var options = {
    series: [{
      name: 'success',
      data: []    
    }, {
      name: 'failed',
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      type: 'datetime',
      categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };
  
  var chart = new ApexCharts(document.getElementById("ip-analysis-chart"), options);
  chart.render();
  
  function fetchChartData() {
    var ipAddress = document.getElementById("ipInput").value;
  
    // Make a socket connection to the backend to fetch data for the given IP address
    window.soc.emit("fetchChartData", { ipAddress });
  
    // Listen for the response from the backend
    window.soc.on("chartData", (data) => {
        console.log('chardata', data);
      // Update the chart with the received data
      updateChart(data);
    });
  }

  function updateChart(data) {
    // Modify this part based on your data structure
    // The data should be in a format suitable for ApexCharts series
    options.series = data.series;
  
    // Update other options if needed
  
    // Update the chart
    chart.updateOptions(options);
  }