function refreshPage() {
    getPayments()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Found no payments.', 'warning');
                document.getElementById('thisMonthChart').hidden = true;
                return;
            }
        })
        .then((data) => {
            if (data.payments.length === 0) {
                showAlert('Found no payments.', 'warning');
                document.getElementById('thisMonthChart').hidden = true;
            } else {
                refreshHouseholdFixValues(data.payments);
                refreshLastPayments(data.payments);
                refreshThisMonthsPaymentsChart(data.payments);
            }
        });
    getRecurringPayments()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Found no recurring payments.', 'warning');
                return;
            }
        })
        .then((data) => {
            if (data.recurringPayments.length > 0) {
                refreshPreviewRecurringPayments(data.recurringPayments);
            }
        });
}

function refreshHouseholdFixValues(data) {
    let householdSaldo = 0;
    let householdIncome = 0;
    let householdExpenses = 0;

    data.forEach((payment) => {
        householdSaldo += payment.value;

        // If payment was in current month
        if (new Date().getMonth() === new Date(payment.createdAt).getMonth()) {
            if (payment.value >= 0) {
                householdIncome += payment.value;
            } else {
                householdExpenses += payment.value;
            }
        }
    });

    if (householdSaldo < 0) {
        document.getElementById('householdSaldo').classList.add('text-complementary');
    }

    document.getElementById('householdSaldo').innerHTML = householdSaldo.toFixed(2) + '€';
    document.getElementById('householdIncome').innerHTML = householdIncome.toFixed(2) + '€';
    document.getElementById('householdExpenses').innerHTML = householdExpenses.toFixed(2) + '€';
}

function refreshLastPayments(data) {
    for (let i = 0; i < 5; i++) {
        if (data[i]) {
            const createdAt = new Date(data[i].createdAt);
            const date =
                createdAt.getDate() +
                '.' +
                (createdAt.getMonth() + 1) +
                '.' +
                createdAt.getFullYear();
            document
                .getElementById('lastPaymentsList')
                .appendChild(
                    createPaymentListElement(
                        data[i].purpose,
                        Number(data[i].value).toFixed(2) + '€',
                        date
                    )
                );
        }
    }
}

function nextWeekdayDate(date, day_in_week) {
    let result = new Date(date || new Date());
    result.setDate(result.getDate() + ((day_in_week - 1 - result.getDay() + 7) % 7) + 1);
    return result;
}

function nextDayInMonthDate(date, day_in_month) {
    let result = new Date(date || new Date());
    result.setDate(result.getDate() + ((day_in_month - result.getDate() + 31) % 31));
    return result;
}

function getDayOfYear(date) {
    var now = new Date(date || new Date());
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}

function nextDayInYearDate(date, startDate) {
    let result = new Date(date || new Date());

    if (getDayOfYear(date) <= getDayOfYear(startDate)) {
        result.setFullYear(result.getFullYear());
    } else {
        result.setFullYear(result.getFullYear() + 1);
    }

    result.setMonth(startDate.getMonth());
    result.setDate(startDate.getDate());

    return result;
}

function refreshPreviewRecurringPayments(data) {
    data.forEach((recurringPayment) => {
        const startDate = new Date(recurringPayment.startDate);
        const today = new Date();
        let calculatedDate = today;

        switch (recurringPayment.interval) {
            case 'daily':
                // Gets booked today so do nothing
                break;
            case 'weekly':
                calculatedDate = nextWeekdayDate(today, startDate.getDay() - 1);
                break;
            case 'monthly':
                calculatedDate = nextDayInMonthDate(today, startDate.getDate());
                break;
            case 'yearly':
                calculatedDate = nextDayInYearDate(today, startDate);
                break;
            default:
                break;
        }
        let date =
            calculatedDate.getDate() +
            '.' +
            (calculatedDate.getMonth() + 1) +
            '.' +
            calculatedDate.getFullYear();
        document
            .getElementById('previewRecurringPaymentsList')
            .appendChild(
                createPaymentListElement(
                    recurringPayment.purpose,
                    Number(recurringPayment.value).toFixed(2) + '€',
                    date,
                    recurringPayment.interval
                )
            );
    });
}

function createPaymentListElement(name = '', value = '', date = '', interval = '') {
    // This functions creates a element looking like this:
    // <li class="list-group-item bg-light px-0">
    //     <div class="row font-weight-bold">
    //         <div class="col">name</div>
    //         <div class="col text-right">value</div>
    //     </div>
    //     <div class="row">
    //         <div class="col">date</div>
    //     </div>
    // </li>

    const element = document.createElement('li');
    element.classList.add('list-group-item', 'bg-light', 'px-0');

    const row1 = document.createElement('div');
    row1.classList.add('row', 'font-weight-bold');

    const row1div1 = document.createElement('div');
    row1div1.classList.add('col-7');
    row1div1.append(name);

    const row1div2 = document.createElement('div');
    row1div2.classList.add('col-5', 'text-right');
    row1div2.append(value);

    row1.append(row1div1);
    row1.append(row1div2);

    element.append(row1);

    const row2 = document.createElement('div');
    row2.classList.add('row');

    const row2div1 = document.createElement('div');
    row2div1.classList.add('col');
    row2div1.append(date);

    row2.append(row2div1);
    if (interval) {
        const row2div2 = document.createElement('div');
        row2div2.classList.add('col', 'text-right');
        row2div2.append(interval);

        row2.append(row2div2);
    }

    element.append(row2);

    return element;
}

function refreshThisMonthsPaymentsChart(data) {
    let labels = [];
    let values = [];
    let backgroundColors = [];
    if (!data) {
        return;
    }
    // go through all entries and filter out multiple categories and add up the value in one category
    data.forEach((payment) => {
        let category = payment.category;

        if (new Date().getMonth() === new Date(payment.createdAt).getMonth()) {
            if (labels.indexOf(category.name) == -1) {
                labels.push(category.name);
                values.push(payment.value);
            } else {
                values[labels.indexOf(category.name)] += payment.value;
            }
        }
    });

    // build the color array by looking for positive/negative values in the value array
    values.forEach((value) => {
        // Add the value to the money as we also want to set it

        if (value >= 0) {
            backgroundColors.push('#1DE9B6');
        } else {
            backgroundColors.push('#e91d50');
        }
    });

    let ctx = document.getElementById('thisMonthChart');
    let config = {
        type: 'pie',
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
                display: false,
                position: 'bottom',
            },
        },
    };

    if (!window.thisMonthChart.config) {
        window.thisMonthChart = new Chart(ctx, config);
    } else {
        window.thisMonthChart.config = config;
        window.thisMonthChart.update();
    }
}

async function getPayments() {
    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');

    const url = '/api/payments?hid=' + householdId + '&moneypoolId=null';

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
}

async function getRecurringPayments() {
    const urlParams = new URLSearchParams(window.location.search);
    const householdId = urlParams.get('hid');

    const url =
        '/api/recurringPayments?hid=' + householdId + '&start=' + new Date().toJSON() + '&limit=4';

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
}

refreshPage();
