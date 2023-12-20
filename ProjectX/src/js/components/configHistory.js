document.addEventListener("DOMContentLoaded", () => {
  window.soc.on('objectList', (data) => {
    console.log('files', data);

    // Assuming you have a <table> with the id 'fileTable' in your HTML
    const fileTable = document.getElementById('objectList');

    // Clear existing table rows
    fileTable.innerHTML = '';

    // Create a new table row for each file and append it to the <table>
    data.forEach((fileName) => {
      const tableRow = document.createElement('tr');
      tableRow.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700');
      tableRow.innerHTML = '';
      tableRow.innerHTML = `
        <td class= "px-6 py-4" >${fileName}</td>
        <td class = "px-6 py-4">
            <span class="inline-flex right-0">
              <div class="flex">
                <svg onclick="handleClick('${fileName}')" class="px-1 mx-2 w-6 h-6 text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                  <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
                  </g>
                </svg>
                <svg onclick="downloadFile('${fileName}')" id="download" class="px-1 mx-2 w-[22px] h-[22px] text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                  <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                </svg>
              </div>
            </span>
        </td>
      `;
      fileTable.appendChild(tableRow);
    });
  });
});

// Rest of your code remains unchanged


function handleClick(fileName) {
  // Replace 'http://localhost:3001' with your actual server URL
  const serverUrl = 'http://localhost:3001';
  console.log('click function');

  // Make a GET request to the server endpoint
  fetch(`${serverUrl}/api/getFileData?fileName=${fileName}`)
    .then(response => {
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the JSON response
      return response.json();
    })
    .then(data => {
      // Access the file data lines from the response
      const fileDataLines = data.fileDataLines;
      const textDataElement = document.getElementById('text-data-from-s3');
      const heading = document.getElementById('file-name-modal');
      heading.textContent = fileName;
      textDataElement.innerHTML = '';
      fileDataLines.forEach(line => {
        const lineElement = document.createElement('p');
        lineElement.textContent = line;
        textDataElement.appendChild(lineElement);
      });

      // Open the modal
      openModal();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function downloadFile(fileName) {
  const serverUrl = 'http://localhost:3001';

  window.location.href = `${serverUrl}/api/downloadS3File?fileName=${fileName}`;
}

function openModal() {
    // Find the button element by its ID and trigger a click event
    const openModalButton = document.getElementById('openModalButton');
    // openModal.disabled = false;
    openModalButton.click();
  }
  


