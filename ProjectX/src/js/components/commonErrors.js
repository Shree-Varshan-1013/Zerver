      
        var options = {
            series: [44, 55, 41, 17, 15,20,30],
            labels: ['Apple', 'Mango', 'Orange', 'Watermelon','one','tow','there'],
            chart: {
            type: 'donut',
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 400
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
          };
  
          var chart = new ApexCharts(document.getElementById("common-error-path"), options);
          chart.render();