
// function sortTable(n, iconId) {
//     var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
//     table = document.getElementById("logTable");
//     switching = true;
//     // Set the sorting direction to ascending:
//     dir = "asc";

//     /* Make a loop that will continue until
//     no switching has been done: */
//     while (switching) {
//         // Start by saying: no switching is done:
//         switching = false;
//         rows = table.rows;

//         /* Loop through all table rows (except the
//         first, which contains table headers): */
//         for (i = 1; i < (rows.length - 1); i++) {
//             // Start by saying there should be no switching:
//             shouldSwitch = false;

//             /* Get the two elements you want to compare,
//             one from the current row and one from the next: */
//             x = rows[i].getElementsByTagName("TD")[n];
//             y = rows[i + 1].getElementsByTagName("TD")[n];

//             /* Check if the two rows should switch place,
//             based on the direction, asc or desc: */
//             if (dir == "asc") {
//                 if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//                     // If so, mark as a switch and break the loop:
//                     shouldSwitch = true;
//                     break;
//                 }
//             } else if (dir == "desc") {
//                 if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
//                     // If so, mark as a switch and break the loop:
//                     shouldSwitch = true;
//                     break;
//                 }
//             }
//         }

//         if (shouldSwitch) {
//             /* If a switch has been marked, make the switch
//             and mark that a switch has been done: */
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//             // Each time a switch is done, increase this count by 1:
//             switchcount++;
//         } else {
//             /* If no switching has been done AND the direction is "asc",
//             set the direction to "desc" and run the while loop again. */
//             if (switchcount == 0 && dir == "asc") {
//                 dir = "desc";
//                 switching = true;
//             }
//         }
//     }

//     // Rotate the sorting icon
//     const sortIcon = document.getElementById(iconId);
//     if (sortIcon) {
//         sortIcon.classList.toggle('rotate-90', dir === 'asc');
//     }
// }


document.addEventListener("DOMContentLoaded", function () {
    // Get references to the start and end date input elements
    var startDateInput = document.querySelector('input[name="start"]');
    var endDateInput = document.querySelector('input[name="end"]');

    // Function to check if the start date and time are selected
    function isStartDateSelected() {
        return startDateInput.value !== '';
    }

    // Attach event listener to the start date input
    startDateInput.addEventListener('change', function () {
        // Enable or disable the end date input based on whether the start date is selected
        endDateInput.disabled = !isStartDateSelected();
    });

    // Attach event listener to the end date input
    endDateInput.addEventListener('change', function () {
        // Parse the selected start and end dates
        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);

        // Compare the dates
        if (isStartDateSelected() && endDate < startDate) {
            // If end date is before start date, clear the invalid value
            endDateInput.value = '';
            alert('End date and time should not be before the start date and time.');
        }
    });
});