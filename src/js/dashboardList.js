function createHousehold(event) {
    event.preventDefault();

    const householdName = document.querySelector('#householdNameInput').value;

    const data = {
        household: {
            name: householdName,
        },
    };

    let houseId;

    postHousehold(data)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert(
                    'Could not create a household. Please contact the support',
                    'warning'
                );
                return;
            }
        })
        .then((data) => {
            const huData = {
                householdUser: {
                    householdId: data.household.id,
                    userId: data.household.ownerId,
                },
            };
            postHouseholdUser(huData)
                .then((response) => {
                    if (response.status >= 200 && response.status < 400) {
                        return response.json();
                    } else {
                        showAlert(
                            'Could not create a household. Please contact the support',
                            'warning'
                        );
                        return;
                    }
                })
                .then((data) => {
                    window.location.href =
                        '/dashboard?hid=' + data.householdUser.householdId;
                    return;
                });
            return;
        });

    $('#addHouseholdModal').modal('hide');
    return false;
}

async function postHousehold(data) {
    const url = '/api/households';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

async function postHouseholdUser(data) {
    const url = '/api/householdsUsers';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}
