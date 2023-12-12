const socket = io('http://localhost:3001');
socket.on('logData', (data) => {
    console.log(data);
  })

  
  socket.on('logTableDashboard', (data) => {
    console.log("Received LogTableValue:", JSON.stringify(data));
  
    const tableBody = document.getElementById('logTableBody');
    // Clear existing rows in the table
    tableBody.innerHTML = '';
  
    // Check if data.data is an array before using map
    if (Array.isArray(data.data)) {
      // Extract the last log value
      const latestLog = data.data[data.data.length - 1];
    
      // Exclude the latest log from the array
      const otherLogs = data.data.slice(0, -1);
    
      // Reverse the order of other logs
      const reversedLogs = otherLogs.reverse();
    
      // Combine the latest log and other logs
      const allLogs = [latestLog, ...reversedLogs];
    
      // Map over all logs and create HTML rows
      const rows = allLogs.map(log => {
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

socket.on("summaryData", (data) => {
  console.log("Received LogTableValue:", JSON.stringify(data));
  // Assuming you have a <p> element with the id "logEntry"
  const logEntryElement = document.getElementById("logEntry");

  // Update the content of the <p> tag with the summary property from the received data
  if (logEntryElement) {
    logEntryElement.textContent = data.data.summary;
  }
})

  
  
  

  
  
  
  
  
  
  
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
  