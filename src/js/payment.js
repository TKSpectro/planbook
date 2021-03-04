function getPayments() {
    const householdId = new URLSearchParams(window.location.search).get('hid');
    const startDate = document.getElementById('startDateInput').value;
    const endDate = document.getElementById('endDateInput').value;
    let url =
        '/api/payments?hid=' +
        householdId +
        '&start=' +
        startDate +
        '&end=' +
        endDate;

    fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            if (data.payments.length === 0) {
                // TODO Alert user
                refreshChart();
                return;
            } else {
                refreshChart(data.payments);
            }
        });
}
function refreshChart(payments) {
    const chartElement = document.getElementById('paymentHistoryChart');

    // If no data was given hide the chart
    if (!payments) {
        chartElement.parentElement.classList.add('d-none');
        return;
    } else {
        chartElement.parentElement.classList.remove('d-none');
    }

    const options = {
        scales: {
            xAxes: [
                {
                    type: 'time',
                    distribution: 'linear',
                    time: { minUnit: 'day' },
                },
            ],
        },
    };

    let data = {
        labels: [],
        datasets: [
            {
                label: 'Value',
                data: [],
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: '#1DE9B6',
                borderWidth: 1,
            },
        ],
    };
    let currentValue = 0;
    payments.forEach((payment) => {
        currentValue += payment.value;
        data.labels.push(payment.createdAt);
        data.datasets[0].data.push({
            t: payment.createdAt,
            y: currentValue,
        });
    });

    let paymentHistoryChart = new Chart(chartElement, {
        type: 'line',
        data: data,
        options: options,
    });
}
// Call the method when loading the page
getPayments();
