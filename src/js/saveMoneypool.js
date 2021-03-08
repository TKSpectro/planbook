function saveMoneypool(event) {
    event.preventDefault();

    const householdId = new URLSearchParams(window.location.search).get('hid');
    const url = '/api/moneypools/?hid=' + householdId;

    const data = {
        moneypool: {
            name: document.getElementById('nameInput').value,
            description: document.getElementById('descriptionInput').value,
            currentNeededMoney: document.getElementById('neededMoneyInput')
                .value,
            totalNeededMoney: document.getElementById('neededMoneyInput').value,
            householdId: householdId,
        },
    };

    // Send the moneypool to the api
    postMoneypool(url, data).then((data) => {
        showAlert('The moneypool was created!', 'success');
        refreshPage();
        return;
    });

    $('#addMoneypoolModal').modal('hide');

    return false;
}

async function postMoneypool(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
