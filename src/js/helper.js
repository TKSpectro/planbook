function showAlert(message = '', alertType = '') {
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    alertPlaceholder.innerHTML +=
        '<div class="alert alert-' +
        alertType +
        ' alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button></div>';
}

function refreshTable(tableIdString = '', tableData = []) {
    const table = document.getElementById(tableIdString);

    // Just remove the tbody if there actually is one
    if (table.getElementsByTagName('tbody')[0]) {
        table.removeChild(table.getElementsByTagName('tbody')[0]);
    }

    // Create a new tableBody
    const tableBody = document.createElement('tbody');

    // Fill in the data from parameter
    tableData.forEach(function (rowData) {
        const row = document.createElement('tr');

        rowData.forEach(function (cellData) {
            // There is a possibility to put hidden elements
            if (cellData && cellData.toString().indexOf('hidden/') != -1) {
                const cell = document.createElement('td');
                cell.classList.add('d-none');
                cell.appendChild(
                    document.createTextNode(
                        cellData.toString().replace('hidden/', '')
                    )
                );
                row.appendChild(cell);
            } else {
                const cell = document.createElement('td');
                cell.classList.add('align-middle');
                cell.appendChild(document.createTextNode(cellData));
                row.appendChild(cell);
            }
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
}

/*
Algorithm used: https://www.w3schools.com/howto/howto_js_sort_table.asp
    Combined with the sort table numerically
*/
function sortTable(n, isNumber, tableIdString) {
    let table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
    table = document.getElementById(tableIdString);
    switching = true;
    // Set the sorting direction to ascending:
    dir = 'asc';
    // Make a loop that will continue until no switching has been done
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
            first, which contains table headers): */
        for (i = 1; i < rows.length - 1; i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
                one from current row and one from the next: */
            x = rows[i].getElementsByTagName('TD')[n];
            y = rows[i + 1].getElementsByTagName('TD')[n];
            /* Check if the two rows should switch place,
                based on the direction, asc or desc: */

            if (dir == 'asc') {
                if (isNumber) {
                    if (
                        Number(x.innerHTML.replace('€', '')) >
                        Number(y.innerHTML.replace('€', ''))
                    ) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (dir == 'desc') {
                if (isNumber) {
                    if (
                        Number(x.innerHTML.replace('€', '')) <
                        Number(y.innerHTML.replace('€', ''))
                    ) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
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
            if (switchcount == 0 && dir == 'asc') {
                dir = 'desc';
                switching = true;
            }
        }
    }
}
