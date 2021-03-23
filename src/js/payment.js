function refreshPage() {
    getPayments();
}

function getPayments() {
    // Get all the parameters for the api request
    const householdId = new URLSearchParams(window.location.search).get('hid');
    const startDate = document.getElementById('startDateInput').value;
    const endDate = new Date(document.getElementById('endDateInput').value);
    endDate.setHours(new Date().getHours());
    endDate.setMinutes(new Date().getMinutes() + 5);

    // Fetch the api and give the returned data to our refresh function
    fetch(
        `/api/payments?hid=${householdId}&start=${startDate}&end=${endDate.toISOString()}&moneypoolId=null`
    )
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            if (data.payments.length === 0) {
                showAlert('Found no payments', 'warning');
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

    let config = {
        type: 'line',

        options: {
            scales: {
                xAxes: [
                    {
                        type: 'time',
                        distribution: 'linear',
                        time: { minUnit: 'day' },
                    },
                ],
            },
        },

        data: {
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
        },
    };
    let currentValue = 0;
    let tableData = [];

    payments.forEach((payment) => {
        currentValue += payment.value;
    });
    // Go through all payments and add them to the chart and the tableData
    payments.forEach((payment) => {
        // Write data for chart
        config.data.labels.push(payment.createdAt);
        config.data.datasets[0].data.push({
            t: payment.createdAt,
            y: currentValue,
        });
        currentValue -= payment.value;

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
            payment.purpose,
            payment.category.name,
            paymentValueString,
            recurringPaymentString,
            new Date(payment.createdAt).toDateString(),
        ]);
    });

    // Create or update the chart if it already exists
    if (!window.paymentHistoryChart.config) {
        window.paymentHistoryChart = new Chart(chartElement, config);
    } else {
        window.paymentHistoryChart.config = config;
        window.paymentHistoryChart.update();
    }

    refreshTable('paymentsTable', tableData);
}

// Call the method when loading the page
getPayments();
