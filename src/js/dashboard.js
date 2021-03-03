const householdSaldoElement = document.getElementById('householdSaldo');
let saldoValue = 0;

// Get the household id from the url
const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

// Setup the request
fetch('/api/payments?hid=' + householdId)
    .then((data) => {
        if (data.status >= 200 && data.status < 400) {
            return data.json();
        } else {
            householdSaldoElement.innerHTML = 'No entries found';
            document.getElementById('mainChart').hidden = true;
            return;
        }
    })
    .then((res) => {
        var labels = [];
        var values = [];
        var backgroundColors = [];
        if (!res) {
            return;
        }
        // go through all entries and filter out multiple categories and add up the value in one category
        res.payments.forEach((payment) => {
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
            saldoValue += value;

            if (value >= 0) {
                backgroundColors.push('#7CFC00');
            } else {
                backgroundColors.push('#F08080');
            }
        });

        var ctx = mainChart.getContext('2d');
        var config = {
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

        var chart = new Chart(ctx, config);

        householdSaldoElement.innerHTML =
            'Saldo ' + saldoValue.toString() + '€';
    });
