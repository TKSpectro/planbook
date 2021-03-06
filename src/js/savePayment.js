function savePayment() {
    const sel = document.querySelector('#categorySelect');
    const categoryId = sel.options[sel.selectedIndex]
        .getAttribute('data-tokens')
        .split('/')[1];

    const data = {
        payment: {
            purpose: document.querySelector('#purposeInput').value,
            value: document.querySelector('#valueInput').value,
            categoryId: categoryId,
        },
    };

    const householdId = new URLSearchParams(window.location.search).get('hid');
    const url = '/api/payments/?hid=' + householdId;
    // Send the payment to the api
    postPayment(url, data).then((data) => {
        showAlert('The payment was created!', 'success');
        refreshPage();
    });
}

async function postPayment(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
