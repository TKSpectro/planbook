function refreshPage() {
    getLastPayments()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Found no payments', 'warning');
                document.getElementById('mainChart').hidden = true;
                return;
            }
        })
        .then((data) => {
            refreshHouseholdSaldo(data);
            refreshLastPaymentsChart(data);
            refreshLastPaymentsTable(data);
        });
}

function refreshHouseholdSaldo(data) {
    let saldoValue = 0;
    data.payments.forEach((payment) => {
        saldoValue += payment.value;
    });
    document.getElementById('householdSaldo').innerHTML =
        'Saldo ' + saldoValue.toString() + '€';
}

function refreshLastPaymentsChart(data) {
    let labels = [];
    let values = [];
    let backgroundColors = [];
    if (!data) {
        return;
    }
    // go through all entries and filter out multiple categories and add up the value in one category
    data.payments.forEach((payment) => {
        let category = payment.category;
        if (labels.indexOf(category.name) == -1) {
            labels.push(category.name);
            values.push(payment.value);
        } else {
            values[labels.indexOf(category.name)] += payment.value;
        }
    });

    // build the color array by looking for positive/negative values in the value array
    values.forEach((value) => {
        // Add the value to the money as we also want to set it

        if (value >= 0) {
            backgroundColors.push('#7CFC00');
        } else {
            backgroundColors.push('#F08080');
        }
    });

    let ctx = mainChart.getContext('2d');
    let config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: backgroundColors,
                },
            ],
        },
        options: {
            title: {
                display: false,
                text: 'Outgoing',
            },
            legend: {
                position: 'bottom',
            },
        },
    };

    let chart = new Chart(ctx, config);
}

function refreshLastPaymentsTable(data) {
    let tableData = [];

    let i = 1;
    data.payments.forEach((payment) => {
        tableData.push([
            i,
            payment.purpose,
            payment.value > 0 ? '+' + payment.value + '€' : payment.value + '€',
        ]);
        i++;
    });

    refreshTable('lastPaymentsTable', tableData);
}

async function getLastPayments() {
    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');

    const url = '/api/payments?hid=' + householdId + '&limit=10';

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
}

refreshPage();
