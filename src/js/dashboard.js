var request = new XMLHttpRequest();

request.open('GET', '/api/entries', true);
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
    };

    var chart = new Chart(ctx, config);
};

request.send();
