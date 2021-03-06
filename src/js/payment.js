function refreshPage() {
    getPayments();
}

function getPayments() {
    const householdId = new URLSearchParams(window.location.search).get('hid');
    const startDate = document.getElementById('startDateInput').value;
    const endDate = new Date(document.getElementById('endDateInput').value);
    endDate.setHours(new Date().getHours());
    endDate.setMinutes(new Date().getMinutes() + 5);

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
                showAlert('No payments found!', 'warning');
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
    let tableData = [];
    let i = 1;

    payments.forEach((payment) => {
        currentValue += payment.value;
    });

    payments.forEach((payment) => {
        // Write data for chart
        currentValue -= payment.value;
        data.labels.push(payment.createdAt);
        data.datasets[0].data.push({
            t: payment.createdAt,
            y: currentValue,
        });

        // Write data for table
        let recurringPaymentString;
        if (payment.recurringPayment) {
            recurringPaymentString = 'yes';
        } else {
            recurringPaymentString = 'no';
        }

        let paymentValueString;
        if (payment.value > 0) {
            paymentValueString = '+' + payment.value + '€';
        } else {
            paymentValueString = payment.value + '€';
        }

        tableData.push([
            i,
            payment.purpose,
            payment.category.name,
            recurringPaymentString,
            paymentValueString,
        ]);
        i++;
    });

    // TODO decide how the payment graph should look like
    //let endDate = new Date(document.getElementById('endDateInput').value);
    //endDate.setHours(24);
    //data.labels.push(endDate);

    let paymentHistoryChart = new Chart(chartElement, {
        type: 'line',
        data: data,
        options: options,
    });

    refreshTable('paymentsTable', tableData);
}

// Call the method when loading the page
getPayments();
