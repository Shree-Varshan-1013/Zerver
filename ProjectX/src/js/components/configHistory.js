document.addEventListener("DOMContentLoaded", () => {
    window.soc.on('objectList', (data) => {
      console.log('files', data);
      
      // Assuming you have an <ul> with the id 'objectList' in your HTML
      const objectList = document.getElementById('objectList');
  
      // Clear existing list items
      objectList.innerHTML = '';
  
      // Create a new list item for each file and append it to the <ul>
      data.forEach((fileName) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <div class="file-item">
            <span class="file-icon">📄</span>
            <span class="file-name">${fileName}</span>
            <span class="inline-flex right-0  onclick="handleClick('${fileName}')">
                <svg  class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                    <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
                    </g>
                </svg>
            </span>
            </div>
        `;
        objectList.appendChild(listItem);
      });
    });
  });

  // Define the onclick function
function handleClick(fileName) {
    // Perform actions based on the clicked file
    console.log('File clicked:', fileName);
    openModal(); 
    // Add your custom logic here
}
function openModal() {
    // Find the button element by its ID and trigger a click event
    const openModalButton = document.getElementById('openModalButton');
    openModalButton.click();
  }
  


// objectLists.empty();
//     objectLists.forEach((obj) => {
//         objectLists.append(`<li>${obj}</li>`);
//     })

    // // Listen for objectList updates from the server
    // socket.on('objectList', (objects) => {
    //   // Update the list on the webpage
    //   const objectList = $('#objectList');
    //   objectList.empty();
    //   objects.forEach((obj) => {
    //     objectList.append(`<li>${obj}</li>`);
    //   });
    // });
