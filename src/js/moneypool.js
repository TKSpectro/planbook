function refreshPage() {
    getMoneypool()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Found no payments', 'warning');
                // TODO document.getElementById('mainChart').hidden = true;
                return;
            }
        })
        .then((data) => {
            const moneypool = data.moneypools[0];
            refreshNameAndDescription(moneypool);
            refreshMemberAmountChart(moneypool);
            refreshNeededMoneyProgress(moneypool);
            refreshOwnNeededMoneyProgress(moneypool);
            refreshMoneypoolPaymentsTable(moneypool);

            // Enable all tooltips
            $('[data-toggle="tooltip"]').tooltip();
        });
}

function refreshNameAndDescription(moneypool) {
    document.getElementById('moneypoolName').innerHTML = moneypool.name;
    document.getElementById('moneypoolDescription').innerHTML =
        moneypool.description;
}

function refreshNeededMoneyProgress(moneypool) {
    let labels = [];
    let values = [];
    let backgroundColors = [];
    if (!moneypool) {
        return;
    }

    const payments = moneypool.payments;

    let alreadyPaidMoney = 0;
    payments.forEach((payment) => {
        alreadyPaidMoney += payment.value;
    });

    const percentage = (alreadyPaidMoney / moneypool.totalNeededMoney) * 100;
    const progressBar = document.getElementById('neededMoneyProgressBar');

    // Show text
    progressBar.style.width = percentage + '%';
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.innerHTML = percentage.toFixed(2) + '%';

    // Build the tooltip
    progressBar.setAttribute('data-toggle', 'tooltip');
    progressBar.setAttribute('data-placement', 'bottom');
    progressBar.setAttribute(
        'title',
        percentage.toFixed(2) + '% = ' + alreadyPaidMoney + '€'
    );

    const missingMoneyProgressBar = document.getElementById(
        'missingMoneyProgressBar'
    );
    const missingPercentage = 100 - percentage + 0.001;
    missingMoneyProgressBar.style.width = missingPercentage + '%';
    missingMoneyProgressBar.setAttribute('aria-valuenow', missingPercentage);
    missingMoneyProgressBar.innerHTML = missingPercentage.toFixed(2) + '%';

    // Build the tooltip
    missingMoneyProgressBar.setAttribute('data-toggle', 'tooltip');
    missingMoneyProgressBar.setAttribute('data-placement', 'bottom');
    missingMoneyProgressBar.setAttribute(
        'title',
        missingPercentage.toFixed(2) +
            '% = ' +
            (moneypool.totalNeededMoney - alreadyPaidMoney) +
            '€'
    );
}

function refreshOwnNeededMoneyProgress(moneypool) {
    ownMissingMoney =
        moneypool.totalNeededMoney / moneypool.household.members.length;

    let alreadyOwnPaidMoney = 0;
    moneypool.payments.forEach((payment) => {
        if (payment.userId == document.getElementById('currentUserId').value) {
            alreadyOwnPaidMoney += payment.value;
        }
    });

    const ownPercentage = (alreadyOwnPaidMoney / ownMissingMoney) * 100;

    const progressBar = document.getElementById('ownNeededMoneyProgressBar');

    // Show text
    progressBar.style.width = ownPercentage + '%';
    progressBar.setAttribute('aria-valuenow', ownPercentage);
    progressBar.innerHTML = ownPercentage.toFixed(2) + '%';

    // Build the tooltip
    progressBar.setAttribute('data-toggle', 'tooltip');
    progressBar.setAttribute('data-placement', 'bottom');
    progressBar.setAttribute(
        'title',
        ownPercentage.toFixed(2) + '% = ' + alreadyOwnPaidMoney + '€'
    );

    const missingMoneyProgressBar = document.getElementById(
        'ownMissingMoneyProgressBar'
    );
    const ownMissingPercentage = 100 - ownPercentage + 0.001;
    missingMoneyProgressBar.style.width = ownMissingPercentage + '%';
    missingMoneyProgressBar.setAttribute('aria-valuenow', ownMissingPercentage);
    missingMoneyProgressBar.innerHTML = ownMissingPercentage.toFixed(2) + '%';

    // Build the tooltip
    missingMoneyProgressBar.setAttribute('data-toggle', 'tooltip');
    missingMoneyProgressBar.setAttribute('data-placement', 'bottom');
    missingMoneyProgressBar.setAttribute(
        'title',
        ownMissingPercentage.toFixed(2) +
            '% = ' +
            (ownMissingMoney - alreadyOwnPaidMoney) +
            '€'
    );
}

function refreshMemberAmountChart(moneypool) {
    let labels = [];
    let values = [];
    if (!moneypool) {
        return;
    }

    moneypool.payments.forEach((payment) => {
        let name = payment.user.firstName + ' ' + payment.user.lastName;
        if (labels.indexOf(name) == -1) {
            labels.push(name);
            values.push(payment.value);
        } else {
            values[labels.indexOf(name)] += payment.value;
        }
    });

    let ctx = document.getElementById('memberAmountChart');
    let config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: function (context) {
                        switch (context.dataIndex % 4) {
                            case 1:
                                return '#1de9b6';
                            case 2:
                                return '#501de9';
                            case 3:
                                return '#e91d50';
                            default:
                                return '#b6e91d';
                        }
                    },
                    borderColor: '#202020',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            title: {
                display: false,
            },
            legend: {
                position: 'bottom',
            },
        },
    };

    let memberAmountChart = new Chart(ctx, config);
}

function refreshMoneypoolPaymentsTable(moneypool) {
    let tableData = [];
    let i = 1;
    moneypool.payments.forEach((payment) => {
        tableData.push([
            i,
            new Date(payment.createdAt).toDateString(),
            payment.value + '€',
            payment.user.firstName + ' ' + payment.user.lastName,
        ]);
        i++;
    });

    refreshTable('moneypoolPaymentsTable', tableData);
}

function savePayment(event) {
    event.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);
    const householdId = searchParams.get('hid');
    const moneypoolId = searchParams.get('id');

    const data = {
        payment: {
            value: document.querySelector('#valueInput').value,
            householdId: householdId,
            moneypoolId: moneypoolId,
        },
    };

    const url = '/api/payments/?hid=' + householdId;
    // Send the payment to the api
    postPayment(url, data).then((data) => {
        showAlert('The payment was created!', 'success');
        refreshPage();

        $('#addMoneypoolPaymentModal').modal('hide');

        return;
    });

    return false;
}

async function getMoneypool() {
    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');
    const moneypoolId = urlParams.get('id');

    const url = '/api/moneypools?hid=' + householdId + '&id=' + moneypoolId;

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
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

refreshPage();
