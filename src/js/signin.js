function loginPressed(event) {
    event.preventDefault();

    const data = {
        user: {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        },
    };

    postSignIn(data).then((response) => {
        if (response.token) {
            window.location.href = '/dashboard';
            return;
        } else {
            showAlert(
                'Login was not possible. Check your email and password',
                'warning'
            );
            return;
        }
    });
    return false;
}

async function postSignIn(data = {}) {
    const url = '/api/signin';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
