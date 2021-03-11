function refreshHouseholdList() {
    getHouseholds()
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert(
                    'Could not find any households you are part of. Please create a new one',
                    'warning'
                );
                return;
            }
        })
        .then((data) => {
            const householdList = document.getElementById('householdList');
            householdList.innerHTML = '';
            data.households.forEach((household) => {
                householdList.innerHTML +=
                    '<a href="/dashboard?hid=' +
                    household.householdId +
                    '" class="list-group-item active text-dark text-center font-weight-bold">' +
                    household.household.name +
                    '</a>';
            });
        });
}

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

function useInvite(event) {
    event.preventDefault();
    const usedInviteLink = document.getElementById('inviteLinkInput').value;

    const data = {
        invite: {
            link: usedInviteLink,
        },
    };

    putInvite(data)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            } else {
                showAlert('Invite link was not valid', 'warning');
                return;
            }
        })
        .then((data) => {
            refreshHouseholdList();
        });

    $('#useInviteModal').modal('hide');
    return false;
}

async function getHouseholds() {
    const url = '/api/householdsUsers';

    const response = await fetch(url, {
        method: 'GET',
    });

    return response;
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

async function putInvite(data) {
    const url = '/api/invites';
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

refreshHouseholdList();
