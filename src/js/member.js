const urlParams = new URLSearchParams(window.location.search);
const householdId = urlParams.get('hid');

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

async function deleteMember(url = '') {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}
