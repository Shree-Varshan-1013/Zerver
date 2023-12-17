const socket = io('http://localhost:3001');

let sortingState = 'None';
let sortingInProgress = false;
let logsData = [];

socket.on('logTableDashboardReverse', (data) => {
  console.log("Received LogTableValue:", JSON.stringify(data));
  logsData = data.data.map(log => {
    // Exclude the "_id" property
    const { _id, ...logWithoutId } = log;
    return logWithoutId;
  });

  // Check if sorting is in progress
  if (sortingInProgress) {
    console.log('Sorting in progress. Data not added to the table.');
    return;
  }

  const tableBody = document.getElementById('logTableBody1');
  // Clear existing rows in the table
  tableBody.innerHTML = '';

  // Check if data.data is an array before using map
  if (Array.isArray(data.data)) {

    

    const rows = data.data.map(log => {

      let methodClass = '';

  // Determine the appropriate class based on the HTTP method
  if (log.http_method === 'GET') {
    methodClass = 'text-center rounded-full bg-success bg-opacity-10 py-1 px-1 text-sm font-medium text-success';
  } else if (log.http_method === 'PUT') {
    methodClass = 'text-center rounded-full bg-warning bg-opacity-10 py-1 px-1 text-sm font-medium text-warning';
  } else if (log.http_method === 'POST') {
    methodClass = 'text-center rounded-full bg-primary bg-opacity-10 py-1 px-1 text-sm font-medium text-primary';
  } else if (log.http_method === 'DELETE') {
    methodClass = 'w-1 min-w-min text-center rounded-full bg-danger bg-opacity-10 py-1 px-1 text-sm font-medium text-danger';
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



function sortTable(columnIndex) {
  // Check if sorting is already in progress
  if (sortingInProgress) {
    return;
  }

  // Set the flag to indicate sorting is in progress
  sortingInProgress = true;

  // Determine the new sorting state based on the current state
  if (sortingState === 'None') {
    sortingState = 'A_Z';
  } else if (sortingState === 'A_Z') {
    sortingState = 'Z_A';
  } else {
    sortingState = 'None';
  }

  // Update the content of the <p> tag based on sorting state
  updateParagraphContent(columnIndex, sortingState);

  // Your existing sorting logic here
  const table = document.querySelector('table');
  const rows = Array.from(table.rows).slice(1); // Exclude the header row
  const isAscending = sortingState === 'A_Z';

  // If sorting state is 'None', reset to the original order
  if (sortingState === 'None') {
    // Reset the sorting order for all header cells
    document.querySelectorAll('th[onclick]').forEach(cell => {
      cell.classList.remove('asc', 'desc');
      cell.querySelector('p').textContent = '(None)';
    });

    // Update the table with the original order
    rows.forEach(row => table.appendChild(row));
  } else {
    // Sort the rows based on the selected column
    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      if (aValue < bValue) {
        return isAscending ? -1 : 1;
      } else if (aValue > bValue) {
        return isAscending ? 1 : -1;
      } else {
        return 0;
      }
    });

    // Toggle sorting order for the specific header cell
    const headerCell = document.querySelectorAll('th')[columnIndex];
    headerCell.classList.toggle('asc', isAscending);
    headerCell.classList.toggle('desc', !isAscending);

    // Update the table with the sorted rows
    rows.forEach(row => table.appendChild(row));
  }

  // Reset the flag after sorting is complete
  sortingInProgress = false;
}

function updateParagraphContent(columnIndex, sortingState) {
  // Get the <p> tag adjacent to the header
  const paragraphTag = document.querySelectorAll('th')[columnIndex].querySelector('p');

  if (sortingState === 'A_Z') {
    paragraphTag.textContent = '(A_Z)';
  } else if (sortingState === 'Z_A') {
    paragraphTag.textContent = '(Z_A)';
  } else {
    paragraphTag.textContent = '(None)';
  }
}

// Add event listeners for each table header
document.addEventListener('DOMContentLoaded', function () {
  const headerCells = document.querySelectorAll('th[onclick]');
  headerCells.forEach((cell, index) => {
    cell.addEventListener('click', function () {
      // Call the sortTable function with the column index
      sortTable(index);
    });
  });
});

// Function to update the log table based on data
function updateLogTable(data) {
  const tableBody = document.getElementById('logTableBody1');
  tableBody.innerHTML = ''; // Clear existing rows in the table

  if (Array.isArray(data.data)) {
    const rows = data.data.map((log) => {
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

    tableBody.innerHTML = rows.join('');
  } else {
    console.error("Received data is not in the expected format:", data);
  }
}

// function toggleSocketConnection(isConnected) {
//   if (isConnected) {
//     socket.connect();
//   } else {
//     socket.disconnect();
//   }
// }

function resetSearch() {
  document.getElementById('search').value = ''; 
  document.getElementById('searchColumn').value = 'all';

  const startDatetimeInput = document.querySelector('input[name="start"]');
  const endDatetimeInput = document.querySelector('input[name="end"]');

  startDatetimeInput.value = '';
  endDatetimeInput.value = '';

  startDatetimeInput.disabled = true;
  endDatetimeInput.disabled = true;
  // toggleSocketConnection(true);

  renderTable('', 'all');
}

function handleSearch() {
  const searchColumn = document.getElementById('searchColumn').value;
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const timestamp = document.getElementById('timestamp').value;

  // Perform search based on the selected column and query
  const filteredData = yourDataFilterFunction(searchColumn, searchQuery, timestamp);

  // Update the log table with the filtered data
  updateLogTable({ data: filteredData });
}

// Function to handle timestamp selection
function handleTimestampChange() {
  const timestampDropdown = document.getElementById('searchColumn');
  const datetimeInputs = document.querySelectorAll('.datetime-input');

  // Enable/disable date-time inputs based on timestamp selection
  datetimeInputs.forEach((input) => {
    input.disabled = timestampDropdown.value !== 'timestamp';
  });
}

// Function to filter logs based on timestamp and search query
function filterLogsByTimestamp(logs, startTimestamp, endTimestamp, searchQuery) {
  return logs.filter(log => {
    // Convert log timestamp to Date object
    const logTimestamp = new Date(log.timestamp);

    // Check if the log timestamp is within the specified range
    const isWithinRange = (!startTimestamp || logTimestamp >= startTimestamp) &&
                          (!endTimestamp || logTimestamp <= endTimestamp);

    // Check if the search query exists in any column
    const matchesSearchQuery = Object.values(log).some(value => {
      return value !== undefined && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Return true if the log satisfies both conditions
    return isWithinRange && matchesSearchQuery;
  });
}


// Function to render the table based on search query and column
function renderTable(searchQuery, searchColumn, logs) {
  const tableBody = document.getElementById('logTableBody1');

  // Clear existing rows
  tableBody.innerHTML = '';
  // toggleSocketConnection(false);

  // Check if logs is an array before using forEach
  if (Array.isArray(logs)) {
    if (!searchQuery || searchColumn === 'search') {
      logs.forEach(log => {
        const row = tableBody.insertRow();

        // Exclude log_id and log_time from the displayed columns
        const columnsToDisplay = Object.keys(log).filter(key => log[key] !== undefined && key !== 'log_id' && key !== 'log_time');

        columnsToDisplay.forEach(key => {
          const cell = row.insertCell();
          cell.textContent = log[key];
        });
      });
    } else {
      // Filter logs based on the search query in the selected column
      const filteredLogs = logs.filter(log => {
        if (searchColumn === 'all') {
          // Check if the search query exists in any column
          return Object.values(log).some(value => {
            // Check if the value is not undefined before calling toString
            return value !== undefined && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
          });
        } else if (searchColumn === 'timestamp') {
          // Get start and end timestamps from the date-time inputs
          const startTimestampInput = document.querySelector('input[name="start"]');
          const endTimestampInput = document.querySelector('input[name="end"]');
          const startTimestamp = startTimestampInput.value ? new Date(startTimestampInput.value) : null;
          const endTimestamp = endTimestampInput.value ? new Date(endTimestampInput.value) : null;
    
          // Use the filter function for timestamp-based search
          const filteredLogs = filterLogsByTimestamp(logs, startTimestamp, endTimestamp, searchQuery);
    
          // Populate the table with filtered logs, excluding log_id and log_time
          filteredLogs.forEach(log => {
            const row = tableBody.insertRow();
    
            // Exclude log_id and log_time from the displayed columns
            const columnsToDisplay = Object.keys(log).filter(key => key !== 'log_id' && key !== 'log_time');
    
            columnsToDisplay.forEach(key => {
              const cell = row.insertCell();
              cell.textContent = log[key];
            });
          });
        }else {
          // if (searchColumn === 'request_url') {
          //   // For 'requested_url' column, check if the search query is present in the URL
          //   const urlValue = log['request_url'];
          //   return urlValue !== undefined && urlValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
          // } else {
            // Check if the search query exists in the specified column
            const columnValue = log[searchColumn];
            // Check if the columnValue is not undefined before calling toString
            return columnValue !== undefined && columnValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
          // }
        }
      });

      // Populate the table with filtered logs, excluding log_id and log_time
      filteredLogs.forEach(log => {
        const row = tableBody.insertRow();

        // Exclude log_id and log_time from the displayed columns
        const columnsToDisplay = Object.keys(log).filter(key => key !== 'log_id' && key !== 'log_time');

        columnsToDisplay.forEach(key => {
          const cell = row.insertCell();
          cell.textContent = log[key];
        });
      });
    }
  }  else {
    console.error('Logs data is not in the expected format:', logs);
  }
}


// Call the renderTable function with the initial data (assuming empty search)
renderTable('', 'all', logsData);

// Event listener for the search input and column dropdown
document.getElementById('search').addEventListener('input', function () {
  const searchQuery = this.value.trim();
  const searchColumn = document.getElementById('searchColumn').value;
  // toggleSocketConnection(false);
  renderTable(searchQuery, searchColumn,logsData);
});

// Event listener for the SVG element
const resetSearchSVG = document.querySelector('.reset-search-svg');

if (resetSearchSVG) {
  resetSearchSVG.addEventListener('click', resetSearch);
}

// Initial rendering of the table (without any search query)
// renderTable('', 'all');

// Event listener for the datetime inputs
document.addEventListener('DOMContentLoaded', function () {
  const startDatetimeInput = document.querySelector('input[name="start"]');
  const endDatetimeInput = document.querySelector('input[name="end"]');
  const searchColumnDropdown = document.getElementById('searchColumn');

  // Add an event listener to the datetime inputs
  startDatetimeInput.addEventListener('input', function () {
    renderTable('', 'timestamp');
  });

  endDatetimeInput.addEventListener('input', function () {
    renderTable('', 'timestamp');
  });

  // Add an event listener to the dropdown
  searchColumnDropdown.addEventListener('change', function () {
    const isTimestampOption = this.value === 'timestamp';

    startDatetimeInput.disabled = !isTimestampOption;
    endDatetimeInput.disabled = !isTimestampOption;

    if (!isTimestampOption) {
      startDatetimeInput.value = '';
      endDatetimeInput.value = '';
    } else {
      // Trigger table rendering when switching to timestamp column
      renderTable('', 'timestamp');
    }
  });
});



  