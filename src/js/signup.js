function registerPressed(event) {
    event.preventDefault();

    let data = {
        user: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        },
    };

    if (document.getElementById('link').value) {
        data.user['link'] = document.getElementById('link').value;
    }

    postRegister(data).then((response) => {
        if (response.user) {
            window.location.href = '/dashboard';
            return;
        } else {
            showAlert(
                'Register was not possible. Please contact our support',
                'warning'
            );
            return;
        }
    });
    return false;
}

async function postRegister(data = {}) {
    const url = '/api/signup';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
