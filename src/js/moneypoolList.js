const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

function refreshPage() {
    refreshMoneypoolList();
}

function refreshMoneypoolList() {
    getMoneypools()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert(
                    'Could not find any moneypools. Please create a new one',
                    'warning'
                );
                return;
            }
        })
        .then((data) => {
            const moneypoolList = document.getElementById('moneypoolList');
            moneypoolList.innerHTML = '';
            data.moneypools.forEach((moneypool) => {
                moneypoolList.innerHTML +=
                    '<a href="/moneypools?hid=' +
                    householdId +
                    '&id=' +
                    moneypool.id +
                    '"' +
                    'class="list-group-item active text-dark">' +
                    '<div class="d-flex w-100 justify-content-between">' +
                    '<h5 class="mb-1">' +
                    moneypool.name +
                    '</h5></div></a>';
            });
        });
}

async function getMoneypools() {
    const url = '/api/moneypools?hid=' + householdId;

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
}

refreshPage();