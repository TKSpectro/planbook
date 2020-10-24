function signupPressed(elm) {
    var form = document.getElementById('signup-form');

    var xhr = new XMLHttpRequest();
    var start = new Date();

    // handle request finished
    xhr.onload = function () {
        var end = new Date();
        var duration = 820 - (end.getTime() - start.getTime());
        duration = duration < 0 ? 0 : duration;

        setTimeout(function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                setTimeout(function () {
                    window.location = '/dashboard';
                }, 300);
            } else {
                console.log('request failed');
                elm.className = 'error';
            }
        }, duration);
    };

    xhr.open(
        form.getAttribute('method') || 'POST',
        form.getAttribute('action')
    );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(
        JSON.stringify({
            user: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                link: document.getElementById('link').value,
            },
        })
    );
}
