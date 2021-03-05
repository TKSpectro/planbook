const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

function refreshPage() {
    refreshPendingInvitesTable();
    //TODO refreshMembersTable();
}

function removeMemberClicked(id) {
    document.querySelector('#chosenId').value = id;
    // Show the remove modal
    $('#removeMemberModal').modal();
}

function removeMember() {
    const url =
        '/api/householdsUsers?hid=' +
        householdId +
        '&id=' +
        document.querySelector('#chosenId').value;

    deleteMember(url).then((response) => {
        // TODO refresh page or update data by hand and maybe show feedback
    });

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
        //TODO user feedback
        refreshPendingInvitesTable();
    });

    $('#addInviteModal').modal('hide');
    return false;
}

function removeInvite(id) {
    const url = '/api/invites?hid=' + householdId + '&id=' + id;
    deleteInvite(url).then((response) => {
        //TODO user feedback
        refreshPendingInvitesTable();
    });
}

function refreshMembersTable() {
    //TODO needs fixing
    const url = '/api/householdsUsers?hid=' + householdId;
    fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            if (data.members.length === 0) {
                // TODO Alert user
                refreshTable();
                return;
            } else {
                let tableData = [];
                let i = 1;
                data.members.forEach((invite) => {
                    tableData.push([
                        i,
                        member.firstName,
                        member.lastName,
                        member.email,
                        'hidden/' + member.id,
                    ]);
                    i++;
                });
                refreshTable('pendingInvitesTable', tableData);
            }
        });
}

function refreshPendingInvitesTable() {
    const url = '/api/invites?hid=' + householdId;
    fetch(url)
        .then((response) => {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
        })
        .then((data) => {
            if (data.invites.length === 0) {
                // TODO Alert user
                refreshTable();
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
        });
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

refreshPage();
