/*var request = new XMLHttpRequest();

request.open('GET', '/api/entries?income=0', true);
request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
    } else {
        console.log('error');
    }

    var labels = data.entries.map(function (e) {
        return e.purpose;
    });
    var values = data.entries.map(function (e) {
        return e.value;
    });

    var ctx = canvas.getContext('2d');
    var config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: '#1DE9B6',
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Outgoing',
            },
        },
    };

    var chart = new Chart(ctx, config);
};

request.send();

var request2 = new XMLHttpRequest();

request2.open('GET', '/api/entries?income=1', true);
request2.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
    } else {
        console.log('error');
    }

    var labels = data.entries.map(function (e) {
        return e.purpose;
    });
    var values = data.entries.map(function (e) {
        return e.value;
    });

    var ctx = canvas2.getContext('2d');
    var config = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: '#1DE9B6',
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Incoming',
            },
        },
    };

    var chart2 = new Chart(ctx, config);
};

request2.send();

var request3 = new XMLHttpRequest();

request3.open('GET', '/api/entries', true);
request3.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
    } else {
        console.log('error');
    }

    var labels = data.entries.map(function (e) {
        return e.purpose;
    });
    var values = data.entries.map(function (e) {
        return e.value;
    });
    var backgroundColors = data.entries.map(function (e) {
        if (e.income) return '#7CFC00';
        else return '#F08080';
    });

    var ctx = canvas3.getContext('2d');
    var config = {
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
                display: true,
                text: 'All',
            },
        },
    };

    var chart3 = new Chart(ctx, config);
};

request3.send();
*/
var request4 = new XMLHttpRequest();

request4.open('GET', '/api/entries', true);
request4.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request4.status >= 200 && request4.status < 400) {
    } else {
        console.log('error');
    }

    var labels = [];
    var values = [];
    var backgroundColors = [];

    // go through all entries and filter out multiple categories and add up the value in one category
    data.entries.forEach((entry) => {
        let category = entry.category;
        if (labels.indexOf(category.name) == -1) {
            labels.push(category.name);
            values.push(entry.value);
        } else {
            values[labels.indexOf(category.name)] += entry.value;
        }
    });
    // build the color array by looking for positive/negative values in the value array
    values.forEach((value) => {
        if (value >= 0) {
            backgroundColors.push('#7CFC00');
        } else {
            backgroundColors.push('#F08080');
        }
    });

    console.log(calcEntries(data.entries));

    var ctx = canvas4.getContext('2d');
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
                display: true,
                text: 'Outgoing',
            },
        },
    };

    var chart4 = new Chart(ctx, config);
};

request4.send();
