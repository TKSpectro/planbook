function refreshPage() {
    getPayments()
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
            refreshMemberAmountChart(data);
            const payments = data.payments;
            getMoneypool()
                .then((response) => {
                    if (response.status >= 200 && response.status < 400) {
                        return response.json();
                    } else {
                        showAlert('Found no moneypool', 'warning');
                        // TODO document.getElementById('mainChart').hidden = true;
                        return;
                    }
                })
                .then((data) => {
                    refreshNeededMoneyProgress(data, payments);
                });
        });
}

function refreshNeededMoneyProgress(moneypoolData, payments) {
    let labels = [];
    let values = [];
    let backgroundColors = [];
    if (!moneypoolData || !payments) {
        return;
    }

    const moneypool = moneypoolData.moneypools[0];

    let alreadyPaidMoney = 0;
    payments.forEach((payment) => {
        alreadyPaidMoney += payment.value;
    });

    const percentage = (
        (alreadyPaidMoney / moneypool.totalNeededMoney) *
        100
    ).toFixed(2);
    const progressBar = document.getElementById('neededMoneyProgressBar');

    // Show text
    progressBar.style.width = percentage + '%';
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.innerHTML = percentage + '%';

    // Build the tooltip
    progressBar.setAttribute('data-toggle', 'tooltip');
    progressBar.setAttribute('data-placement', 'bottom');
    progressBar.setAttribute(
        'title',
        percentage + '% = ' + alreadyPaidMoney + '€'
    );

    const missingMoneyProgressBar = document.getElementById(
        'missingMoneyProgressBar'
    );
    const missingPercentage = (100 - percentage).toFixed(2);
    missingMoneyProgressBar.style.width = missingPercentage + '%';
    missingMoneyProgressBar.setAttribute('aria-valuenow', missingPercentage);
    missingMoneyProgressBar.innerHTML = missingPercentage + '%';

    // Build the tooltip
    missingMoneyProgressBar.setAttribute('data-toggle', 'tooltip');
    missingMoneyProgressBar.setAttribute('data-placement', 'bottom');
    missingMoneyProgressBar.setAttribute(
        'title',
        missingPercentage +
            '% = ' +
            (moneypool.totalNeededMoney - alreadyPaidMoney) +
            '€'
    );

    // Enable all tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

function refreshMemberAmountChart(data) {
    let labels = [];
    let values = [];
    if (!data) {
        return;
    }

    data.payments.forEach((payment) => {
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

async function getPayments() {
    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');
    const moneypoolId = urlParams.get('id');

    const url =
        '/api/payments?hid=' + householdId + '&moneypoolId=' + moneypoolId;

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
}

refreshPage();
