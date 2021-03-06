const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

function refreshPage() {
    const householdId = new URLSearchParams(window.location.search).get('hid');

    const url = '/api/recurringPayments?hid=' + householdId;

    fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            refreshCalculations(data);
            refreshRecurringPaymentsTable(data);
        });
}

function refreshCalculations(data) {
    if (data.recurringPayments.length === 0) {
        refreshTable('calculatedTable');
        return;
    } else {
        let tableData = [];
        let daily = 0,
            weekly = 0,
            monthly = 0,
            quarterly = 0,
            yearly = 0;
        data.recurringPayments.forEach((recurringPayment) => {
            if (recurringPayment.interval === 'daily') {
                daily += recurringPayment.value;
            }
            if (recurringPayment.interval === 'weekly') {
                weekly += recurringPayment.value;
            }
            if (recurringPayment.interval === 'monthly') {
                monthly += recurringPayment.value;
            }
            if (recurringPayment.interval === 'quarterly') {
                quarterly += recurringPayment.value;
            }
            if (recurringPayment.interval === 'yearly') {
                yearly += recurringPayment.value;
            }
        });
        weekly += daily * 7;
        monthly += weekly * 30;
        quarterly += monthly * 3;
        yearly += quarterly * 4;
        tableData.push([daily, weekly, monthly, quarterly, yearly]);

        refreshTable('calculatedTable', tableData);
    }
}

function refreshRecurringPaymentsTable(data) {
    if (data.recurringPayments.length === 0) {
        showAlert('Found no recurring Payments!', 'danger');
        refreshTable('recurringPaymentsTable');
        return;
    } else {
        let tableData = [];
        let i = 1;
        data.recurringPayments.forEach((recurringPayment) => {
            tableData.push([
                i,
                recurringPayment.purpose,
                new Date(recurringPayment.startDate).toDateString(),
                recurringPayment.endDate
                    ? new Date(recurringPayment.endDate).toDateString()
                    : '',
                recurringPayment.interval,
                recurringPayment.value > 0
                    ? '+' + recurringPayment.value + '€'
                    : recurringPayment.value + '€',
                'hidden/' + recurringPayment.category.name,
                'hidden/' + recurringPayment.id,
            ]);
            i++;
        });
        refreshTable('recurringPaymentsTable', tableData);
    }

    // Setup clickListener for removing
    document
        .querySelectorAll('#recurringPaymentsTable tbody tr')
        .forEach((e) => {
            e.addEventListener('click', clickHandler);
        });
}

function clickHandler() {
    // Set the id in a hidden input field
    document.querySelector('#editPaymentId').value = this.children[7].innerHTML;

    // Set the purpose
    document.querySelector(
        '#editPurposeInput'
    ).value = this.children[1].innerHTML;

    // Set the category -> need to remove \n and remove whitespaces
    document.querySelector(
        '#editCategorySelect'
    ).value = this.children[6].innerText.replace('\n', '').trim();

    // Set the value -> need to remove the '€' from the string
    document.querySelector(
        '#editValueInput'
    ).value = this.children[5].innerText.replace('€', '').replace('+', '');

    // Set the start and end dates -> use the HTMLDateToJSDate function
    document.querySelector(
        '#editStartDateInput'
    ).value = convertHTMLDateToJSDate(this.children[2].innerText);
    document.querySelector('#editEndDateInput').value = convertHTMLDateToJSDate(
        this.children[3].innerText
    );

    // Set the interval
    document.querySelector(
        '#editIntervalSelect'
    ).value = this.children[4].innerText;

    // Show the edit modal
    $('#editRecurringPaymentModal').modal();
}

function saveRecurringPayment(event, form = '') {
    event.preventDefault();

    let url;
    let method;
    if (form === 'edit') {
        url =
            '/api/recurringPayments/?hid=' +
            householdId +
            '&id=' +
            document.querySelector('#' + form + 'PaymentId').value;
        method = 'PUT';
    } else {
        url = '/api/recurringPayments/?hid=' + householdId;
        method = 'POST';
    }

    const sel = document.querySelector('#' + form + 'CategorySelect');
    const categoryId = sel.options[sel.selectedIndex]
        .getAttribute('data-tokens')
        .split('/')[1];

    const data = {
        recurringPayment: {
            purpose: document.querySelector('#' + form + 'PurposeInput').value,
            value: document.querySelector('#' + form + 'ValueInput').value,
            categoryId: categoryId,
            startDate: document.querySelector('#' + form + 'StartDateInput')
                .value,
            endDate: document.querySelector('#' + form + 'EndDateInput').value,
            interval: document.querySelector('#' + form + 'IntervalSelect')
                .value,
        },
    };

    putRecurringPayment(url, data, method).then((data) => {
        showAlert('The recurring payment was saved!', 'success');
        $('#addRecurringPaymentModal').modal('hide');
        $('#editRecurringPaymentModal').modal('hide');
        refreshPage();
    });
}

function removeRecurringPayment() {
    const url =
        '/api/recurringPayments/?hid=' +
        householdId +
        '&id=' +
        document.querySelector('#editPaymentId').value;

    deleteRecurringPayment(url).then((res) => {
        showAlert('The recurring payment was deleted!', 'success');
        refreshPage();
    });
}

async function putRecurringPayment(url = '', data = {}, method = '') {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

async function deleteRecurringPayment(url = '') {
    const response = await fetch(url, {
        method: 'DELETE',
    });
    return response;
}

// Helper function for converting HTML written strings (format Year-month-day)
// to JS usable Date Format
function convertHTMLDateToJSDate(htmlDate) {
    const date = new Date(htmlDate);

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);

    return (
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        day
    );
}

refreshPage();
