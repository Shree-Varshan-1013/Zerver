// import Typewriter from 'typewriter-effect';

document.addEventListener("DOMContentLoaded", () => {
window.soc.on('logData', (data) => {
    console.log(data);
  });

  
  window.soc.on('logTableDashboardReverse', (data) => {
    console.log("Received LogTableValue:", JSON.stringify(data));
  
    const tableBody = document.getElementById('logTableBody');
    // Clear existing rows in the table
    tableBody.innerHTML = '';
  
    // Check if data.data is an array before using map
    if (Array.isArray(data.data)) {
      // Take the first 25 logs
      const logsToDisplay = data.data.slice(0, 20);
    
      // Map over all logs and create HTML rows
      const rows = logsToDisplay.map(log => {
        let methodClass = '';

  // Determine the appropriate class based on the HTTP method
  if (log.http_method === 'GET') {
    methodClass = 'text-center rounded-full bg-success bg-opacity-10 text-sm font-medium text-success';
  } else if (log.http_method === 'PUT') {
    methodClass = 'w-1 text-center rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning';
  } else if (log.http_method === 'POST') {
    methodClass = 'text-center rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary';
  } else if (log.http_method === 'DELETE') {
    methodClass = 'text-center rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger';
  } else {
    methodClass = 'bg-black';
  }
        return `
          <tr>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.timestamp}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">${log.ip_address}</td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark ${methodClass}">${log.http_method}</td>
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
});
document.addEventListener("DOMContentLoaded", () => {
window.soc.on('summaryData', (data) => {
  console.log("Received summaryData:", JSON.stringify(data.data));
  // Assuming you have a <p> element with the id "logEntry"
  const logEntryElement = document.getElementById('logEntry');
  //  console.log(data.data.split(","));
  // Update the content of the <p> tag with the summary property from the received data
  if (logEntryElement) {
    let summaryText = data.data.summary;
    summaryText=summaryText.replaceAll(",","<br>");
    console.log("summary",summaryText);
    logEntryElement.innerText = summaryText;  
    
    // Create a new typewriter instance
    const typewriter = new Typewriter(logEntryElement, {
      loop: false,  // Set to true if you want the effect to loop
      delay: 50,   // Set the delay between characters
    });

    // Add the summary text to the typewriter instance
    typewriter
      .typeString(summaryText)
      .pauseFor(100)  // Pause for 1 second (optional)
      .start();        // Start the typewriter effect
  }
});
});
document.addEventListener("DOMContentLoaded", () => {
window.soc.on('total_logs_count', (data) => {
  // console.log("test",data)
  const total_logs = document.getElementById('dataValue');
  if(total_logs) {
    total_logs.textContent = data;
  }
});
});
window.soc.on("request", (data) => {
  console.log("Receied counts", JSON.stringify(data));
  
})


// const socket = io('http://localhost:3001');

// Retrieve the count from local storage on page load
// documentsAddedCount = parseInt(localStorage.getItem('documentsAddedCount')) || 0;

// // Update the UI with the initial count
// updateUI(documentsAddedCount);

// window.soc.on('request', (data) => {
//   console.log('Received counts', JSON.stringify(data));

//   // Update documentsAddedCount based on the received data
//   documentsAddedCount += data.addedDocumentsCount;

//   // Reset the count to zero at 12:00 AM
//   const now = new Date();
//   const isMidnight = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0;
//   if (isMidnight) {
//     documentsAddedCount = 0;
//   }

//   // Save the updated count to local storage
//   localStorage.setItem('documentsAddedCount', documentsAddedCount);

//   // Handle the updated count as needed, e.g., update the UI
//   updateUI(documentsAddedCount);
// });

// // Function to update the UI with the current count
// function updateUI(count) {
//   // Implement your UI update logic here;
//   // console.log('Current count:', count);
//   const requestElement = document.getElementById("dataValue");

//   // Update the content of the <p> tag with the summary property from the received data
//   if (requestElement) {
//     requestElement.textContent = count;
//   }
// }

// function getCurrentDay() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

  
  
  

  
  
  
  
  
  
  
  // <<======== on/off  =========>
  
  // Get the status indicator and status text elements
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  
  // Function to update the status
  // function updateStatus(isOn) {
  //     if (isOn) {
  //         statusIndicator.classList.remove('bg-red-status');
  //         statusIndicator.classList.add('bg-green-status');
  //         statusText.textContent = 'ON';
  //     } else {
  //         statusIndicator.classList.remove('bg-green-status');
  //         statusIndicator.classList.add('bg-red-status');
  //         statusText.textContent = 'OFF';
  //     }
  // }
  
  
  // setTimeout(() => {
  //     updateStatus(true);
  //     // change();
  // }, 2000);
  