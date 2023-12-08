// // Function to toggle sort order and update the table
// function sortTable(column) {
//     const table = document.getElementById('logTable');
//     const rows = Array.from(table.rows).slice(1); // Exclude the header row

//     // Determine the sorting order (asc/desc)
//     const sortOrder = table.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';

//     // Update the arrow icon
//     const sortIcon = document.getElementById(`${column}SortIcon`);
//     if (sortIcon) {
//         sortIcon.style.transform = sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)';
//     }

//     // Sort the rows based on the selected column
//     rows.sort((a, b) => {
//         const aValue = column === 'timestamp' ? new Date(a.cells[column]?.textContent || 0) : a.cells[column]?.textContent || '';
//         const bValue = column === 'timestamp' ? new Date(b.cells[column]?.textContent || 0) : b.cells[column]?.textContent || '';

//         return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
//     });

//     // Remove existing rows from the table
//     rows.forEach(row => table.tBodies[0].appendChild(row));

//     // Update the sorting order attribute
//     table.setAttribute('data-sort-order', sortOrder);
// }

// // Event listener for the timestamp column
// const timestampSortIcon = document.getElementById('timestampSortIcon');
// if (timestampSortIcon) {
//     timestampSortIcon.addEventListener('click', function () {
//         sortTable('timestamp');
//     });
// }

// // Initial setup for the timestamp column (optional)
// document.addEventListener('DOMContentLoaded', function () {
//     sortTable('timestamp'); // You can choose to sort by timestamp initially
// });


// function sortTable(column) {
//     const table = document.getElementById('logTable');
//     const rows = Array.from(table.rows).slice(1); // Exclude the header row

//     // Determine the sorting order (asc/desc)
//     const sortOrder = table.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';

//     // Update the sorting icon
//     // const sortIcon = document.getElementById(`${column}SortIcon`);
//     const sortIcon = document.getElementById('logIdSortIcon');


//     // Check if the element is found
//     if (sortIcon) {
//         sortIcon.classList.toggle('rotate-90', sortOrder === 'asc');
//     } else {
//         console.error(`Element with ID ${column}SortIcon not found.`);
//     }

//     // Rest of your sorting logic...
//     // For now, let's just log the column and sortOrder
//     console.log(`Sorting ${column} in ${sortOrder} order`);

//     // You can add your sorting logic here
// }

// // Initial setup for Log ID column (optional)
// document.addEventListener('DOMContentLoaded', function () {
//     sortTable('log_id'); // You can choose to sort by log_id initially
// });




// function sortTable(n) {
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
// }



function sortTable(n, iconId) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("logTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";

    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;

        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;

            /* Get the two elements you want to compare,
            one from the current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    // Rotate the sorting icon
    const sortIcon = document.getElementById(iconId);
    if (sortIcon) {
        sortIcon.classList.toggle('rotate-90', dir === 'asc');
    }
}