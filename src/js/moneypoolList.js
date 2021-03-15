const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

function refreshPage() {
    refreshMoneypoolList();
}

function refreshMoneypoolList() {
    fetch(`/api/moneypools?hid=${householdId}`)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Found no moneypools. Please create a new one.', 'warning');
                return response.json();
            }
        })
        .then((data) => {
            if (data.moneypools) {
                const moneypoolList = document.getElementById('moneypoolList');
                moneypoolList.innerHTML = '';
                data.moneypools.forEach((moneypool) => {
                    moneypoolList.innerHTML +=
                        '<a href="/moneypools?hid=' +
                        householdId +
                        '&id=' +
                        moneypool.id +
                        '"' +
                        'class="list-group-item mt-2 active text-dark text-center font-weight-bold">' +
                        moneypool.name +
                        '</a>';
                });
            }
        });
}

refreshPage();
