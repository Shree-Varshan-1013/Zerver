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



// Event listener for the logTableDashboard event
socket.on('logTableDashboard', (data) => {
  // console.log("Received LogTableValue:", JSON.stringify(data));

  // Assuming data.data contains the log information
  

  // Call the renderTable function with the appropriate parameters
  // renderTable('', 'all', logsData);
});

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
          const st_time = new Date(document.getElementById('st-time').value);
          const en_time = new Date(document.getElementById('en-time').value);
          const logTimestamp = new Date(log['timestamp']);
          return logTimestamp >= st_time && logTimestamp <= en_time;
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



  