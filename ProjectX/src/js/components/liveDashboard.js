// var dom = document.getElementById('chart-container');
// var myChart = echarts.init(dom, 'dark', {
//   renderer: 'canvas',
//   useDirtyRect: false
// });

// var option;

// let now = new Date();
// let oneSecond = 1000;
// let numberOfDataPoints = 60;
// let randomValues = Array.from({ length: numberOfDataPoints }, () =>
//   Math.round(Math.abs((Math.random(1,1000) + 0.5) * 20))
// );

// let data = randomValues.map((value, index) => [now - (numberOfDataPoints - index - 1) * oneSecond, value]);

option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',
    text: 'Large Area Chart'
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
      start: 80,
      end: 100
    },
    {
      start: 80,
      end: 100
    }
  ],
  series: [
    {
      name: 'Log Data',
      type: 'line',
      showSymbol: false,
      lineStyle: {  // Set the line style here
        width: 1  // Adjust the width as needed
      },
      data: data
    }
  ]
};


myChart.setOption(option);

// Socket.io connection
const socket = io('http://localhost:3001');


socket.on('dataFromServer', (data) => {

  let newTimestamp = +new Date();
  randomValues.push(data.value);
  randomValues.shift();
  myChart.setOption({
    series: [
      {
        data: randomValues.map((value, index) => [newTimestamp - (numberOfDataPoints - index - 1) * oneSecond, value])
      }
    ]
  });
});
window.addEventListener('resize', myChart.resize);






// //  <========= log table in live dashboard  ===============>

// // const logs = [
// //   { log_id: 10, log_time: '2023-12-06 12:39:45', timestamp: '2023-12-06 12:39:45', ip_address: '192.168.1.10', http_method: 'POST', request_url: '/api/endpoint10', status_code: 404 },
// //   { log_id: 1, log_time: '2023-12-06 12:30:45', timestamp: '2023-12-06 12:30:45', ip_address: '192.168.1.1', http_method: 'GET', request_url: '/api/endpoint1', status_code: 200 },
// //   { log_id: 2, log_time: '2023-12-06 12:31:15', timestamp: '2023-12-06 12:31:15', ip_address: '192.168.1.2', http_method: 'POST', request_url: '/api/endpoint2', status_code: 404 },
// //   { log_id: 3, log_time: '2023-12-06 12:32:30', timestamp: '2023-12-06 12:32:30', ip_address: '192.168.1.3', http_method: 'GET', request_url: '/api/endpoint3', status_code: 200 },
// //   { log_id: 4, log_time: '2023-12-06 12:33:45', timestamp: '2023-12-06 12:33:45', ip_address: '192.168.1.4', http_method: 'POST', request_url: '/api/endpoint4', status_code: 500 },
// //   { log_id: 5, log_time: '2023-12-06 12:34:15', timestamp: '2023-12-06 12:34:15', ip_address: '192.168.1.5', http_method: 'GET', request_url: '/api/endpoint5', status_code: 200 },
// //   { log_id: 6, log_time: '2023-12-06 12:35:30', timestamp: '2023-12-06 12:35:30', ip_address: '192.168.1.6', http_method: 'POST', request_url: '/api/endpoint6', status_code: 404 },
// //   { log_id: 7, log_time: '2023-12-06 12:36:45', timestamp: '2023-12-06 12:36:45', ip_address: '192.168.1.7', http_method: 'GET', request_url: '/api/endpoint7', status_code: 200 },
// //   { log_id: 8, log_time: '2023-12-06 12:37:15', timestamp: '2023-12-06 12:37:15', ip_address: '192.168.1.8', http_method: 'POST', request_url: '/api/endpoint8', status_code: 500 },
// //   { log_id: 9, log_time: '2023-12-06 12:38:30', timestamp: '2023-12-06 12:38:30', ip_address: '192.168.1.9', http_method: 'GET', request_url: '/api/endpoint9', status_code: 200 },
// //   { log_id: 11, log_time: '2023-12-06 12:40:15', timestamp: '2023-12-06 12:40:15', ip_address: '192.168.1.11', http_method: 'GET', request_url: '/api/endpoint11', status_code: 200 },
// //   { log_id: 12, log_time: '2023-12-06 12:41:30', timestamp: '2023-12-06 12:41:30', ip_address: '192.168.1.12', http_method: 'POST', request_url: '/api/endpoint12', status_code: 500 },
// //   { log_id: 13, log_time: '2023-12-06 12:42:45', timestamp: '2023-12-06 12:42:45', ip_address: '192.168.1.13', http_method: 'GET', request_url: '/api/endpoint13', status_code: 200 },
// //   { log_id: 14, log_time: '2023-12-06 12:43:15', timestamp: '2023-12-06 12:43:15', ip_address: '192.168.1.14', http_method: 'POST', request_url: '/api/endpoint14', status_code: 404 },
// //   { log_id: 15, log_time: '2023-12-06 12:44:30', timestamp: '2023-12-06 12:44:30', ip_address: '192.168.1.15', http_method: 'GET', request_url: '/api/endpoint15', status_code: 200 },
// //   { log_id: 16, log_time: '2023-12-06 12:45:45', timestamp: '2023-12-06 12:45:45', ip_address: '192.168.1.16', http_method: 'POST', request_url: '/api/endpoint16', status_code: 500 },
// //   { log_id: 17, log_time: '2023-12-06 12:46:15', timestamp: '2023-12-06 12:46:15', ip_address: '192.168.1.17', http_method: 'GET', request_url: '/api/endpoint17', status_code: 200 },
// //   { log_id: 18, log_time: '2023-12-06 12:47:30', timestamp: '2023-12-06 12:47:30', ip_address: '192.168.1.18', http_method: 'POST', request_url: '/api/endpoint18', status_code: 404 },
// //   { log_id: 19, log_time: '2023-12-06 12:48:45', timestamp: '2023-12-06 12:48:45', ip_address: '192.168.1.19', http_method: 'GET', request_url: '/api/endpoint19', status_code: 200 },
// //   { log_id: 20, log_time: '2023-12-06 12:49:15', timestamp: '2023-12-06 12:49:15', ip_address: '192.168.1.20', http_method: 'POST', request_url: '/api/endpoint20', status_code: 500 },
// //   { log_id: 21, log_time: '2023-12-06 12:50:30', timestamp: '2023-12-06 12:50:30', ip_address: '192.168.1.21', http_method: 'GET', request_url: '/api/endpoint21', status_code: 200 },
// //   { log_id: 22, log_time: '2023-12-06 12:51:45', timestamp: '2023-12-06 12:51:45', ip_address: '192.168.1.22', http_method: 'POST', request_url: '/api/endpoint22', status_code: 404 },
// //   { log_id: 23, log_time: '2023-12-06 12:52:15', timestamp: '2023-12-06 12:52:15', ip_address: '192.168.1.23', http_method: 'GET', request_url: '/api/endpoint23', status_code: 200 },
// //   { log_id: 24, log_time: '2023-12-06 12:53:30', timestamp: '2023-12-06 12:53:30', ip_address: '192.168.1.24', http_method: 'POST', request_url: '/api/endpoint24', status_code: 500 },
// //   { log_id: 25, log_time: '2023-12-06 12:54:45', timestamp: '2023-12-06 12:54:45', ip_address: '192.168.1.25', http_method: 'GET', request_url: '/api/endpoint25', status_code: 200 },
// //   { log_id: 26, log_time: '2023-12-06 12:55:15', timestamp: '2023-12-06 12:55:15', ip_address: '192.168.1.26', http_method: 'POST', request_url: '/api/endpoint26', status_code: 404 },
// //   { log_id: 27, log_time: '2023-12-06 12:56:30', timestamp: '2023-12-06 12:56:30', ip_address: '192.168.1.27', http_method: 'GET', request_url: '/api/endpoint27', status_code: 200 },
// //   { log_id: 28, log_time: '2023-12-06 12:57:45', timestamp: '2023-12-06 12:57:45', ip_address: '192.168.1.28', http_method: 'POST', request_url: '/api/endpoint28', status_code: 500 },
// //   { log_id: 29, log_time: '2023-12-06 12:58:15', timestamp: '2023-12-06 12:58:15', ip_address: '192.168.1.29', http_method: 'GET', request_url: '/api/endpoint29', status_code: 200 },
// //   { log_id: 30, log_time: '2023-12-06 12:59:30', timestamp: '2023-12-06 12:59:30', ip_address: '192.168.1.30', http_method: 'POST', request_url: '/api/endpoint30', status_code: 404 }
// // ];


// // Function to populate the table with logs
// // function populateTable() {
// //   const tableBody = document.getElementById('logTableBody');

// //   logs.forEach(log => {
// //       const row = document.createElement('tr');
// //       row.innerHTML = `
// //           <td class="py-2 px-4 border-b text-left">${log.log_id}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.log_time}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.timestamp}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.ip_address}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.http_method}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.request_url}</td>
// //           <td class="py-2 px-4 border-b text-left">${log.status_code}</td>
// //       `;

// //       tableBody.appendChild(row);
// //   });
// // }
// // Call the function to populate the table when the page loads
// // populateTable();

// function updateTable(logs) {
//   const tableBody = document.getElementById('logTableBody');
//   // Clear existing rows in the table
//   tableBody.innerHTML = '';

//   logs.forEach(log => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td class="py-2 px-4 border-b text-left">${log.timestamp}</td>
//       <td class="py-2 px-4 border-b text-left">${log.ip_address}</td>
//       <td class="py-2 px-4 border-b text-left">${log.http_method}</td>
//       <td class="py-2 px-4 border-b text-left">${log.requested_path}</td>
//       <td class="py-2 px-4 border-b text-left">${log.status_code}</td>
//     `;
//     tableBody.appendChild(row);
//   });
// }


// console.log('hai from jegathees');