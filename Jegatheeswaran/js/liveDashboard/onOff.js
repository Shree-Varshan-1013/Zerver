// Get the status indicator and status text elements
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Function to update the status
function updateStatus(isOn) {
    if (isOn) {
        statusIndicator.classList.remove('bg-red-500');
        statusIndicator.classList.add('bg-green-500');
        statusText.textContent = 'ON';
    } else {
        statusIndicator.classList.remove('bg-green-500');
        statusIndicator.classList.add('bg-red-700');
        statusText.textContent = 'OFF';
    }
}

// function change() {
//     if(updateStatus(true)) {
//         return updateStatus(false);
//     }
//     else{
//         return updateStatus(true);
//     }
// }

// Example: Update the status to On after 2 seconds (simulating a change)
setTimeout(() => {
    updateStatus(true);
    // change();
}, 2000);
