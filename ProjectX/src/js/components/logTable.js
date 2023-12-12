const socket = io('http://localhost:3001');

socket.on('logTableDashboard', (data) => {
  console.log("Received LogTableValue:", JSON.stringify(data));

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
    // Extract the last 30 values and reverse the order
    // const last30Logs = data.data.slice(-30).reverse();

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


  let sortingState = 'None';
  let sortingInProgress = false;
  

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
    const isAscending = table.classList.contains('asc');

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
    headerCell.classList.toggle('asc', !isAscending);

    // Update the table with the sorted rows
    rows.forEach(row => table.appendChild(row));

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

// Function to reset the search, time inputs, and disable time picker
function resetSearch() {
  document.getElementById('search').value = ''; // Reset the search input
  document.getElementById('searchColumn').value = 'all'; // Reset the column dropdown

  const startDatetimeInput = document.querySelector('input[name="start"]');
  const endDatetimeInput = document.querySelector('input[name="end"]');

  startDatetimeInput.value = ''; // Clear the start datetime input
  endDatetimeInput.value = ''; // Clear the end datetime input

  startDatetimeInput.disabled = true; // Disable the start datetime input
  endDatetimeInput.disabled = true; // Disable the end datetime input

  renderTable('', 'all'); // Render the table without any search query
}

// Function to handle search based on query
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

// Function to render the table based on search query and column
function renderTable(searchQuery, searchColumn) {
  const tableBody = document.getElementById('logTableBody1');

  // Clear existing rows
  tableBody.innerHTML = '';

  // Your existing rendering logic here...
}

// Event listener for the search input and column dropdown
document.getElementById('search').addEventListener('input', function () {
  const searchQuery = this.value.trim();
  const searchColumn = document.getElementById('searchColumn').value;
  renderTable(searchQuery, searchColumn);
});

// Event listener for the SVG element
const resetSearchSVG = document.querySelector('.reset-search-svg');

if (resetSearchSVG) {
  resetSearchSVG.addEventListener('click', resetSearch);
}

// Initial rendering of the table (without any search query)
renderTable('', 'all');

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



  