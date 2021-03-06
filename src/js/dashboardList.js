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
                //TODO alert user
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
                        //TODO alert user
                        return;
                    }
                })
                .then((data) => {
                    return;
                    //TODO redirect to the new household
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
