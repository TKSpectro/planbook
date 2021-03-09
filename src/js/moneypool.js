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
            refreshNeededMoneyChart(data);
        });
    refreshNeededMoneyChart();
    //refreshMemberAmountChart();
}

function refreshNeededMoneyChart(data) {
    let labels = [];
    let values = [];
    let backgroundColors = [];
    if (!data) {
        return;
    }

    const moneypool = data.moneypools[0];

    labels.push('got');
    labels.push('need');
    values.push(moneypool.totalNeededMoney - moneypool.currentNeededMoney);
    values.push(moneypool.currentNeededMoney);

    backgroundColors.push('#7CFC00');
    backgroundColors.push('#F08080');

    let ctx = document.getElementById('neededMoneyChart');
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

    let neededMoneyChart = new Chart(ctx, config);
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

refreshPage();
