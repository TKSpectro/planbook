function clickHandler() {
    // Set the id in a hidden input field
    document.querySelector('#paymentId').value = this.children[7].innerHTML;

    // Set the purpose
    document.querySelector('#purposeInput').value = this.children[1].innerHTML;

    // Set the category -> need to remove \n and remove whitespaces
    document.querySelector(
        '#categorySelect'
    ).value = this.children[6].innerText.replace('\n', '').trim();

    // Set the value -> need to remove the '€' from the string
    document.querySelector(
        '#valueInput'
    ).value = this.children[5].innerText.replace('€', '');

    // Set the start and end dates -> use the HTMLDateToJSDate function
    document.querySelector('#startDateInput').value = convertHTMLDateToJSDate(
        this.children[2].innerText
    );
    document.querySelector('#endDateInput').value = convertHTMLDateToJSDate(
        this.children[3].innerText
    );

    // Set the interval
    document.querySelector(
        '#intervalSelect'
    ).value = this.children[4].innerText;

    // Show the edit modal
    $('#editRecurringPaymentModal').modal();
}

function saveRecurringPayment() {
    console.log('saved hit');

    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');

    const url =
        '/api/recurringPayments/?hid=' +
        householdId +
        '&id=' +
        document.querySelector('#paymentId').value;

    const sel = document.querySelector('#categorySelect');
    const categoryId = sel.options[sel.selectedIndex]
        .getAttribute('data-tokens')
        .split('/')[1];

    const data = {
        recurringPayment: {
            purpose: document.querySelector('#purposeInput').value,
            value: document.querySelector('#valueInput').value,
            categoryId: categoryId,
            startDate: document.querySelector('#startDateInput').value,
            endDate: document.querySelector('#endDateInput').value,
            interval: document.querySelector('#intervalSelect').value,
        },
    };

    putRecurringPayment(url, data).then((data) => {
        console.log(data);
    });

    $('#editRecurringPaymentModal').hide();
}

async function putRecurringPayment(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
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

document.querySelectorAll('#recurringPaymentsTable tbody tr').forEach((e) => {
    e.addEventListener('click', clickHandler);
});
