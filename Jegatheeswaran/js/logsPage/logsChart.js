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





// <<====== sort function for table ====>

function sortTable(n, iconId) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("logTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";

  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;

      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;

          /* Get the two elements you want to compare,
          one from the current row and one from the next: */
          x = rows[i].getElementsByTagName("TD")[n];
          y = rows[i + 1].getElementsByTagName("TD")[n];

          /* Check if the two rows should switch place,
          based on the direction, asc or desc: */
          if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  // If so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
          }
      }

      if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          // Each time a switch is done, increase this count by 1:
          switchcount++;
      } else {
          /* If no switching has been done AND the direction is "asc",
          set the direction to "desc" and run the while loop again. */
          if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
          }
      }
  }

  // Rotate the sorting icon
  const sortIcon = document.getElementById(iconId);
  if (sortIcon) {
      sortIcon.classList.toggle('rotate-90', dir === 'asc');
  }
}
