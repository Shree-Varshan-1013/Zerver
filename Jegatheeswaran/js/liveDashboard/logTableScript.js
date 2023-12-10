// // Sample data
// const logs = [
//     { log_id: 1, log_time: '2023-12-05 10:30:00', timestamp: '2023-12-05 10:30:15', ip_address: '192.168.1.1', http_method: 'GET', request_url: '/home', status_code: 200 },
//     { log_id: 2, log_time: '2023-12-05 11:15:00', timestamp: '2023-12-05 11:15:30', ip_address: '192.168.1.2', http_method: 'POST', request_url: '/api/data', status_code: 404 },
// ];

// // Function to populate the table
// function populateTable() {
//     const tableBody = document.getElementById('logTableBody');

//     // Clear existing rows
//     tableBody.innerHTML = '';

//     // Add rows based on data
//     logs.forEach(log => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td class="text-left">${log.log_id}</td>
//             <td class="text-left">${log.log_time}</td>
//             <td class="text-left">${log.timestamp}</td>
//             <td class="text-left">${log.ip_address}</td>
//             <td class="text-left">${log.http_method}</td>
//             <td class="text-left">${log.request_url}</td>
//             <td class="text-left">${log.status_code}</td>
//         `;
//         tableBody.appendChild(row);
//     });
// }

// // Initial population
// populateTable();


// Assuming your log data is an array of objects
const logs = [
    { log_id: 10, log_time: '2023-12-06 12:39:45', timestamp: '2023-12-06 12:39:45', ip_address: '192.168.1.10', http_method: 'POST', request_url: '/api/endpoint10', status_code: 404 },
    { log_id: 1, log_time: '2023-12-06 12:30:45', timestamp: '2023-12-06 12:30:45', ip_address: '192.168.1.1', http_method: 'GET', request_url: '/api/endpoint1', status_code: 200 },
    { log_id: 2, log_time: '2023-12-06 12:31:15', timestamp: '2023-12-06 12:31:15', ip_address: '192.168.1.2', http_method: 'POST', request_url: '/api/endpoint2', status_code: 404 },
    { log_id: 3, log_time: '2023-12-06 12:32:30', timestamp: '2023-12-06 12:32:30', ip_address: '192.168.1.3', http_method: 'GET', request_url: '/api/endpoint3', status_code: 200 },
    { log_id: 4, log_time: '2023-12-06 12:33:45', timestamp: '2023-12-06 12:33:45', ip_address: '192.168.1.4', http_method: 'POST', request_url: '/api/endpoint4', status_code: 500 },
    { log_id: 5, log_time: '2023-12-06 12:34:15', timestamp: '2023-12-06 12:34:15', ip_address: '192.168.1.5', http_method: 'GET', request_url: '/api/endpoint5', status_code: 200 },
    { log_id: 6, log_time: '2023-12-06 12:35:30', timestamp: '2023-12-06 12:35:30', ip_address: '192.168.1.6', http_method: 'POST', request_url: '/api/endpoint6', status_code: 404 },
    { log_id: 7, log_time: '2023-12-06 12:36:45', timestamp: '2023-12-06 12:36:45', ip_address: '192.168.1.7', http_method: 'GET', request_url: '/api/endpoint7', status_code: 200 },
    { log_id: 8, log_time: '2023-12-06 12:37:15', timestamp: '2023-12-06 12:37:15', ip_address: '192.168.1.8', http_method: 'POST', request_url: '/api/endpoint8', status_code: 500 },
    { log_id: 9, log_time: '2023-12-06 12:38:30', timestamp: '2023-12-06 12:38:30', ip_address: '192.168.1.9', http_method: 'GET', request_url: '/api/endpoint9', status_code: 200 },
    { log_id: 11, log_time: '2023-12-06 12:40:15', timestamp: '2023-12-06 12:40:15', ip_address: '192.168.1.11', http_method: 'GET', request_url: '/api/endpoint11', status_code: 200 },
    { log_id: 12, log_time: '2023-12-06 12:41:30', timestamp: '2023-12-06 12:41:30', ip_address: '192.168.1.12', http_method: 'POST', request_url: '/api/endpoint12', status_code: 500 },
    { log_id: 13, log_time: '2023-12-06 12:42:45', timestamp: '2023-12-06 12:42:45', ip_address: '192.168.1.13', http_method: 'GET', request_url: '/api/endpoint13', status_code: 200 },
    { log_id: 14, log_time: '2023-12-06 12:43:15', timestamp: '2023-12-06 12:43:15', ip_address: '192.168.1.14', http_method: 'POST', request_url: '/api/endpoint14', status_code: 404 },
    { log_id: 15, log_time: '2023-12-06 12:44:30', timestamp: '2023-12-06 12:44:30', ip_address: '192.168.1.15', http_method: 'GET', request_url: '/api/endpoint15', status_code: 200 },
    { log_id: 16, log_time: '2023-12-06 12:45:45', timestamp: '2023-12-06 12:45:45', ip_address: '192.168.1.16', http_method: 'POST', request_url: '/api/endpoint16', status_code: 500 },
    { log_id: 17, log_time: '2023-12-06 12:46:15', timestamp: '2023-12-06 12:46:15', ip_address: '192.168.1.17', http_method: 'GET', request_url: '/api/endpoint17', status_code: 200 },
    { log_id: 18, log_time: '2023-12-06 12:47:30', timestamp: '2023-12-06 12:47:30', ip_address: '192.168.1.18', http_method: 'POST', request_url: '/api/endpoint18', status_code: 404 },
    { log_id: 19, log_time: '2023-12-06 12:48:45', timestamp: '2023-12-06 12:48:45', ip_address: '192.168.1.19', http_method: 'GET', request_url: '/api/endpoint19', status_code: 200 },
    { log_id: 20, log_time: '2023-12-06 12:49:15', timestamp: '2023-12-06 12:49:15', ip_address: '192.168.1.20', http_method: 'POST', request_url: '/api/endpoint20', status_code: 500 },
    { log_id: 21, log_time: '2023-12-06 12:50:30', timestamp: '2023-12-06 12:50:30', ip_address: '192.168.1.21', http_method: 'GET', request_url: '/api/endpoint21', status_code: 200 },
    { log_id: 22, log_time: '2023-12-06 12:51:45', timestamp: '2023-12-06 12:51:45', ip_address: '192.168.1.22', http_method: 'POST', request_url: '/api/endpoint22', status_code: 404 },
    { log_id: 23, log_time: '2023-12-06 12:52:15', timestamp: '2023-12-06 12:52:15', ip_address: '192.168.1.23', http_method: 'GET', request_url: '/api/endpoint23', status_code: 200 },
    { log_id: 24, log_time: '2023-12-06 12:53:30', timestamp: '2023-12-06 12:53:30', ip_address: '192.168.1.24', http_method: 'POST', request_url: '/api/endpoint24', status_code: 500 },
    { log_id: 25, log_time: '2023-12-06 12:54:45', timestamp: '2023-12-06 12:54:45', ip_address: '192.168.1.25', http_method: 'GET', request_url: '/api/endpoint25', status_code: 200 },
    { log_id: 26, log_time: '2023-12-06 12:55:15', timestamp: '2023-12-06 12:55:15', ip_address: '192.168.1.26', http_method: 'POST', request_url: '/api/endpoint26', status_code: 404 },
    { log_id: 27, log_time: '2023-12-06 12:56:30', timestamp: '2023-12-06 12:56:30', ip_address: '192.168.1.27', http_method: 'GET', request_url: '/api/endpoint27', status_code: 200 },
    { log_id: 28, log_time: '2023-12-06 12:57:45', timestamp: '2023-12-06 12:57:45', ip_address: '192.168.1.28', http_method: 'POST', request_url: '/api/endpoint28', status_code: 500 },
    { log_id: 29, log_time: '2023-12-06 12:58:15', timestamp: '2023-12-06 12:58:15', ip_address: '192.168.1.29', http_method: 'GET', request_url: '/api/endpoint29', status_code: 200 },
    { log_id: 30, log_time: '2023-12-06 12:59:30', timestamp: '2023-12-06 12:59:30', ip_address: '192.168.1.30', http_method: 'POST', request_url: '/api/endpoint30', status_code: 404 }
  ];
  
  console.log(logs);
  


//reset functionality added

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

// Event listener for the SVG element
const resetSearchSVG = document.querySelector('.reset-search-svg');

if (resetSearchSVG) {
    resetSearchSVG.addEventListener('click', resetSearch);
}

// Function to render the table based on search query and column
function renderTable(searchQuery, searchColumn) {
    const tableBody = document.getElementById('logTableBody');

    // Clear existing rows
    tableBody.innerHTML = '';

    // If search query is empty, display all logs
    if (!searchQuery || searchColumn === 'search') {
        logs.forEach(log => {
            const row = tableBody.insertRow();
            Object.values(log).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });
    } else {
        // Filter logs based on the search query in the selected column
        const filteredLogs = logs.filter(log => {
            if (searchColumn === 'all') {
                // Check if the search query exists in any column
                return Object.values(log).some(value =>
                    value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                );
            } else {
                // Check if the search query exists in the specified column
                const columnValue = log[searchColumn].toString().toLowerCase();
                return columnValue.includes(searchQuery.toLowerCase());
            }
        });
        // Populate the table with filtered logs
        filteredLogs.forEach(log => {
            const row = tableBody.insertRow();
            Object.values(log).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });
    }
}

// Event listener for the search input and column dropdown
document.getElementById('search').addEventListener('input', function () {
    const searchQuery = this.value.trim();
    const searchColumn = document.getElementById('searchColumn').value;
    renderTable(searchQuery, searchColumn);
});

// Initial rendering of the table (without any search query)
renderTable('', 'all');

// Event listener for the datetime inputs and dropdown
document.addEventListener('DOMContentLoaded', function () {
    const startDatetimeInput = document.querySelector('input[name="start"]');
    const endDatetimeInput = document.querySelector('input[name="end"]');
    const searchColumnDropdown = document.getElementById('searchColumn');
    const timestampSortIcon = document.getElementById('timestampSortIcon');

    searchColumnDropdown.addEventListener('change', function () {
        const isTimestampOption = this.value === 'timestamp';

        startDatetimeInput.disabled = !isTimestampOption;
        endDatetimeInput.disabled = !isTimestampOption;

        if (!isTimestampOption) {
            startDatetimeInput.value = '';
            endDatetimeInput.value = '';
        }
    });

    if (timestampSortIcon) {
        timestampSortIcon.addEventListener('click', function () {
            sortTable('timestamp');
        });
    }
});
