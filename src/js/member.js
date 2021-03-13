const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

function refreshPage() {
    const urlHouseholdsUsers = '/api/householdsUsers?hid=' + householdId;
    getHouseholdsUsers(urlHouseholdsUsers)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            refreshMembersTable(data);
        });

    const urlInvites = '/api/invites?hid=' + householdId;
    getInvites(urlInvites)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            refreshPendingInvitesTable(data);
        });
}

function removeMemberClicked(id) {
    document.querySelector('#chosenId').value = id;
    // Show the remove modal
    $('#removeMemberModal').modal();
}

function leaveOwnedHouseholdClicked() {
    $('#leaveOwnedHouseholdModal').modal();
}

function leaveOwnedHousehold(event) {
    event.preventDefault();

    // Set new owner of household
    const householdUrl = '/api/households?hid=' + householdId;

    const sel = document.getElementById('chooseNewOwnerSelect');
    const newOwnerId = sel.options[sel.selectedIndex].getAttribute('data-tokens').split('/')[1];

    const householdUserUrl =
        '/api/householdsUsers?hid=' + householdId + '&id=' + document.getElementById('userId').value;

    deleteMember(householdUserUrl)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return;
            } else {
                alertShow('Could not update householdUser', 'danger');
            }
        })
        .then(() => {
            const requestData = {
                household: {
                    id: householdId,
                    ownerId: newOwnerId,
                },
            };

            putHousehold(householdUrl, requestData)
                .then((response) => {
                    if (response.status >= 200 && response.status < 400) {
                        return;
                    } else {
                        alertShow('Could not update household', 'danger');
                    }
                })
                .then(() => {
                    window.location.href = '/dashboard';
                });
        });

    return false;
}

function removeMember() {
    const url = '/api/householdsUsers?hid=' + householdId + '&id=' + document.querySelector('#chosenMemberId').value;

    if (document.getElementById('chosenMemberId').value === document.getElementById('userId').value) {
        showAlert('You cant remove yourself', 'warning');
    } else {
        deleteMember(url).then((response) => {
            showAlert('The member was deleted!', 'success');
            refreshMembersTable();
        });
    }

    $('#removeMemberModal').hide();
}

function saveInvite(event) {
    event.preventDefault();
    const invitedEmail = document.querySelector('#emailInput').value;

    const url = '/api/invites?hid=' + householdId;

    const data = {
        invite: {
            invitedEmail: invitedEmail,
        },
    };

    postInvite(url, data).then((response) => {
        showAlert('The invite was created!', 'success');
        refreshPage();
    });

    $('#addInviteModal').modal('hide');
    return false;
}

function removeInvite() {
    const id = document.getElementById('chosenInviteId').value;
    const url = '/api/invites?hid=' + householdId + '&id=' + id;
    deleteInvite(url).then((response) => {
        showAlert('The invite was removed!', 'success');
        refreshPage();
    });
}

function refreshMembersTable(data) {
    if (data.households.length === 0) {
        showAlert('Found no households!', 'warning');
        refreshTable('membersTable');
        return;
    } else {
        let tableData = [];
        let i = 1;
        selectElement = document.getElementById('chooseNewOwnerSelect');
        data.households.forEach((household) => {
            if (household.userId !== household.household.ownerId) {
                selectElement.innerHTML +=
                    '<option value="' +
                    household.userId +
                    '"' +
                    'data-tokens="' +
                    household.user.firstName +
                    ' ' +
                    household.user.lastName +
                    '/' +
                    household.userId +
                    '">' +
                    household.user.firstName +
                    ' ' +
                    household.user.lastName;
            }

            tableData.push([
                i,
                household.user.firstName,
                household.user.lastName,
                household.user.email,
                'hidden/' + household.user.id,
            ]);
            i++;
        });
        refreshTable('membersTable', tableData);
    }

    // Setup clickListener for removing
    document.querySelectorAll('#membersTable tbody tr').forEach((e) => {
        if (e.children[4].innerHTML == data.households[0].household.ownerId) {
            e.addEventListener('click', leaveOwnedHouseholdClicked);
        } else {
            e.addEventListener('click', clickRemoveMemberHandler);
        }
    });
}

function refreshPendingInvitesTable(data) {
    if (data.invites.length === 0) {
        showAlert('Found no invites!', 'warning');
        refreshTable('pendingInvitesTable');
        return;
    } else {
        let tableData = [];
        let i = 1;
        data.invites.forEach((invite) => {
            tableData.push([
                i,
                invite.invitedEmail,
                new Date(invite.validUntil).toDateString(),
                new Date(invite.createdAt).toDateString(),
                'hidden/' + invite.id,
            ]);
            i++;
        });
        refreshTable('pendingInvitesTable', tableData);
    }

    // Setup clickListener for removing
    document.querySelectorAll('#pendingInvitesTable tbody tr').forEach((e) => {
        e.addEventListener('click', clickRemoveInviteHandler);
    });
}

async function getHouseholdsUsers(url = '', data) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

async function getInvites(url = '', data) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

async function postInvite(url = '', data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

async function putHousehold(url = '', data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return response;
}

async function deleteInvite(url = '') {
    const response = await fetch(url, {
        method: 'DELETE',
    });

    return response;
}

async function deleteMember(url = '') {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}

function clickRemoveInviteHandler() {
    // Set the id in a hidden input field
    document.querySelector('#chosenInviteId').value = this.children[4].innerHTML;

    // Show the edit modal
    $('#removeInviteModal').modal();
}

function clickRemoveMemberHandler() {
    // Set the id in a hidden input field
    document.querySelector('#chosenMemberId').value = this.children[4].innerHTML;

    // Show the edit modal
    $('#removeMemberModal').modal();
}

refreshPage();
