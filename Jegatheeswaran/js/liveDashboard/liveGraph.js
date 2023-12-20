  var dom = document.getElementById('chart-container');
  var myChart = echarts.init(dom, 'dark', {
    renderer: 'canvas',
    useDirtyRect: false
  });

  setInterval(function () {
    let newTimestamp = new Date().getTime();
    let randomValue = Math.round((Math.random(1, 1000)) * 20);
  
    // Add the new random value to the array
    randomValues.push(randomValue);
  
    // Remove the oldest random value
    randomValues.shift();
  
    // Create a new dataset with the updated array
    let newData = randomValues.map((value, index) => ({
      x: newTimestamp - (numberOfDataPoints - index - 1) * oneSecond,
      y: value
    }));
  
    // Update the chart data with the new dataset using setData method
    chart.setData([{ data: newData }], false); // Set the second parameter to false to disable animation
  }, 1000);

  var options = {
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        easing: 'easeInOutQuad', // Use 'easeInOutQuad' easing for a smoother effect
        speed: 500, // Animation duration in milliseconds
        animateGradually: {
          enabled: true,
          delay: 50 // Reduce the delay to 50 milliseconds between each data point's animation
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    series: [
      {
        name: 'Fake Data',
        data: randomValues
      }
    ],
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd/MM/yyyy HH:mm:ss'
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2); // Format y-axis labels as needed
        }
      }
    },
    title: {
      text: 'Large Area Chart',
      align: 'center'
    },
    tooltip: {
      x: {
        format: 'dd/MM/yyyy HH:mm:ss'
      }
    }
  };
  
  var chart = new ApexCharts(document.getElementById('chart-container'), options);
  chart.render();
  
  // Update chart dynamically every second with smooth animation
  setInterval(function () {
    let newTimestamp = new Date().getTime();
    let randomValue = Math.round((Math.random(1, 1000)) * 20);
  
    // Add the new random value to the array
    randomValues.push(randomValue);
  
    // Remove the oldest random value
    randomValues.shift();
  
    // Update the chart data with the updated array and enable smooth animation
    chart.updateSeries([
      {
        data: randomValues.map((value, index) => ({
          x: newTimestamp - (numberOfDataPoints - index - 1) * oneSecond,
          y: value
        }))
      }
    ]);
  }, 1000);
  
  // Resize the chart on window resize
  window.addEventListener('resize', function () {
    chart.updateOptions({
      chart: {
        animations: {
          enabled: true
        }
      }
    });
    chart.resize();
  });
