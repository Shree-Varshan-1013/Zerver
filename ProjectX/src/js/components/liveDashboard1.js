// const socket = io('http://localhost:3001');
socket.on('logData', (data) => {
    console.log(data);
  })
  
  
  socket.on('logTableDashboard', (data) => {
    console.log("Received LogTableValue:", JSON.stringify(data));
    // console.log(data);
  
    const tableBody = document.getElementById('logTableBody');
    // Clear existing rows in the table
    tableBody.innerHTML = '';
  
    // Check if data.data is an array before using map
    if (Array.isArray(data.data)) {
      const rows = data.data.map(log => {
        return `
          <tr>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.timestamp}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.ip_address}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.http_method}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.requested_path}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.status_code}</td>
          </tr>
        `;
      });
  
      // Join the rows and append to the table
      tableBody.innerHTML = rows.join('');
    } else {
      console.error("Received data is not in the expected format:", data);
    }
  });
  
  
  
  // const socket = io('http://localhost:3001'); // Replace with your server URL
  
  // socket.on('dataFromServer', (data) => {
  //   dataPoints.push({ x: dataPoints.length + 1, y: data.value });
  //   if (dataPoints.length > 10) {
  //     dataPoints.shift(); // Keep a certain number of data points
  //   }
  
  //   myChart.update(); // Update the chart with new data
  // });
  
  
  
  
  
  
  
  // <<======== on/off  =========>
  
  // Get the status indicator and status text elements
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  
  // Function to update the status
  function updateStatus(isOn) {
      if (isOn) {
          statusIndicator.classList.remove('bg-red-status');
          statusIndicator.classList.add('bg-green-status');
          statusText.textContent = 'ON';
      } else {
          statusIndicator.classList.remove('bg-green-status');
          statusIndicator.classList.add('bg-red-status');
          statusText.textContent = 'OFF';
      }
  }
  
  
  setTimeout(() => {
      updateStatus(true);
      // change();
  }, 2000);
  