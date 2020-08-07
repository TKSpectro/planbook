// handle task show/create and edit popover
let taskForm = new Taskform({});

// retrieve all tasks rendered by ejs (backend)
let tasks = document.querySelectorAll('.tasks .task');
for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    task.addEventListener('click', function (e) {
        taskForm.showWithTaskId(this.getAttribute('data-id'));
    });
}

//default chat is all
let textarea = document.getElementById('message');
let currentUserElm = document.getElementById('btn-chat-all');
let messagesElm = document.getElementById('messages');

//!str will return true if the string is null, undefined, or ''
//!str.trim() will return true if the string is '' after removing trailing whitespaces (which means it is an empty string)
function isNullOrEmpty(str) {
    return !str || !str.trim();
}

function loadMessages(elm, fromId) {
    let xhr = new XMLHttpRequest();

    //handle request finished
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let jsonData = JSON.parse(xhr.response);

            //map messages into socket messages format
            //and write to the button
            if (elm.lastMessages instanceof Array === false) {
                elm.lastMessages = [];
            }

            //append on top
            for (let index = 0; index < jsonData.messages.length; ++index) {
                const message = jsonData.messages[index];
                elm.lastMessages.unshift({
                    text: message.text,
                    from: {
                        id: message.from.id,
                        displayName:
                            message.from.firstName.charAt(0) +
                            message.from.lastName.charAt(0),
                    },
                    to: message.to,
                });
            }
        } else {
            console.log('request failed');
        }
    };

    let url = messagesElm.getAttribute('data-action');

    if (fromId) {
        url += '?fromId=' + fromId;
    }

    if (elm.lastMessages instanceof Array === true) {
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }

        url += 'offset=' + elm.lastMessages.length;
    }

    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function updateUserBtnName(elm) {
    //update user name if there is incoming message icon
    elm.innerText = elm.getAttribute('data-shortname');
    let img = document.createElement('img');
    img.src = '../../assets/images/team.svg';
    let src = document.getElementById('btn-chat-all');
    src.appendChild(img);

    if (elm.getAttribute('data-new') !== '0') {
        //elm.innerText += ' (' + elm.getAttribute('data-new') + ')';

        let div = document.createElement('div');

        div.innerHTML = elm.getAttribute('data-new');

        div.className = 'notification-counter';

        elm.appendChild(div);
    }
}

function userPressed(elm) {
    let oldUserElm = currentUserElm;
    currentUserElm = elm;
    document.querySelector('.chat').style.display = 'block';
    document.querySelector('.userInfo').style.display = 'none';

    let wrapper = document.querySelector('.wrapper');
    if (wrapper.className === 'wrapper') {
        wrapper.className = 'wrapper chat-open';
    } else if (oldUserElm !== currentUserElm) {
        wrapper.className = 'wrapper chat-open';
    } else {
        wrapper.className = 'wrapper';
    }

    if (elm.getAttribute('data-fullname') !== null) {
        document.getElementById('chatTitle').innerHTML = elm.getAttribute(
            'data-fullname'
        );
    } else {
        document.getElementById('chatTitle').innerHTML = 'All';
    }
    elm.setAttribute('data-new', '0');
    updateUserBtnName(elm);

    //clean current messages in pot
    let messagesElm = document.getElementById('messages');
    messagesElm.innerHTML = '';

    //retrieve messages for user if not done yet
    if (!elm.lastMessages) {
        let fromId = elm.getAttribute('data-id');
        loadMessages(elm, fromId === '0' ? null : fromId);
    }
    //otherwise the socket already append the messages so display
    else {
        for (let index = 0; index < elm.lastMessages.length; ++index) {
            const msg = elm.lastMessages[index];
            handleIncomingMessage(msg);
        }
    }
}

function chatClose() {
    document.querySelectorAll('.wrapper')[0].className = 'wrapper';
}

function sendPressed(elm) {
    let textarea = document.getElementById('message');
    let data = {
        text: textarea.value,
    };

    let button = document
        .getElementById('send-message')
        .classList.add('animate');

    textarea.value = '';

    if (!isNullOrEmpty(data.text)) {
        if (currentUserElm.getAttribute('data-id') !== '0') {
            data.toId = parseInt(currentUserElm.getAttribute('data-id'));
        }

        io.emit('message', data);
    } else {
        textarea.placeholder = 'String is empty';
        console.log('String is empty or contains only spaces');
    }
    setTimeout(
        "document.getElementById('send-message').classList.remove('animate')",
        1500
    );
}

function handleIncomingMessage(data) {
    let messageElm = document.getElementById('messages');
    let elmId = null;
    var today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hour = today.getHours();
    let minute = today.getMinutes();

    today = dd + '.' + mm + '.' + yyyy + ' - ' + hour + ':' + minute;

    //check incoming message has data.to === null or not inside, means public chat
    if (!data.to) {
        if (currentUserElm.getAttribute('data-id') !== '0') {
            elmId = 'all';
        }
    } else if (
        currentUserId !== data.from.id &&
        currentUserElm.getAttribute('data-id') != data.from.id
    ) {
        elmId = data.from.id;
    }

    if (elmId !== null) {
        let elm = document.getElementById('btn-chat-' + elmId);
        if (elm) {
            let newMessageCount = parseInt(elm.getAttribute('data-new')) + 1;
            elm.setAttribute('data-new', newMessageCount);
            if (elm.lastMessages) {
                elm.lastMessages.push(data);
            }
            updateUserBtnName(elm);
        }
    } else {
        let elm = document.createElement('DIV');
        let info = document.createElement('DIV');
        info.className = 'info';

        if (currentUserId == data.from.id) {
            elm.className = 'myMessage';
            elm.innerText = data.text;
            info.style.textAlign = 'left';
            info.style.margin = '0% 10% 0% 0%';
            info.innerText = 'Du' + ' - ' + today;
        } else {
            elm.className = 'yourMessage';
            elm.innerText = data.text;
            info.style.textAlign = 'right';
            info.style.margin = '0% 0% 0% 10%';
            info.innerText = data.from.displayName + ' - ' + today;
        }
        messageElm.appendChild(elm);
        messageElm.appendChild(info);
        messageElm.scrollTop = messageElm.scrollHeight;
    }
}

io.on('message', (data) => {
    console.log('incoming message');
    handleIncomingMessage(data);
});

messagesElm.addEventListener('scroll', function () {
    if (this.scrollTop === 0) {
        let fromId = currentUserElm.getAttribute('data-id');
        loadMessages(currentUserElm, fromId === '0' ? null : fromId);
    }
});

textarea.altActive = false;
textarea.addEventListener('keydown', function (event) {
    if (event.keyCode === 18) {
        textarea.altActive = true;
    }
});

textarea.addEventListener('keyup', function (event) {
    if (event.keyCode === 18) {
        textarea.altActive = false;
    }
    if (event.keyCode === 13 && textarea.altActive === false) {
        sendPressed();
    } else if (event.keyCode === 13 && textarea.altActive === true) {
        textarea.value += '\n';
    }
});

//initial load
loadMessages(currentUserElm);

//Drag and Drop for Kanban -> HTML5Sortable
let sortableLists = sortable('.tasks', {
    forcePlaceholderSize: true,
    placeholderClass: 'task-placeholder',
    acceptFrom: '.tasks',
    hoverClass: 'dragging',
});

for (let index = 0; index < sortableLists.length; index++) {
    const list = sortableLists[index];
    list.addEventListener('sortstart', function (e) {
        // do nothing
    });

    list.addEventListener('sortstop', function (e) {
        //do nothing
    });

    list.addEventListener('sortupdate', function (e) {
        let item = e.detail.item;
        let target = e.target;

        if (item) {
            item.style.borderColor = item.parentNode.getAttribute(
                'data-workflow-color'
            );
        }

        io.emit('task/move', {
            id: item.getAttribute('data-id'),
            workflowId: target.getAttribute('data-workflow-id'),
            workflowColor: target.getAttribute('data-workflow-color'),
            sort: Array.prototype.indexOf.call(item.parentNode.children, item),
        });
    });
}

function showWorkflowBlock() {
    let workflow = document.querySelector('.workflowAdditionWrapper');
    workflow.style.display = 'block';
}

function hideWorkflowBlock() {
    let workflow = document.querySelector('.workflowAdditionWrapper');
    workflow.style.display = 'none';
}

function addWorkflow() {
    let workflowName = document.querySelector('.workflowName');
    let workflow = document.querySelector('.workflowAdditionWrapper');
    let workflowAdd = document.querySelector('.AddWorkflow');
    let workflowSort = workflow.getAttribute('workflow-count');
    let projectID = workflow.getAttribute('project-id');

    let createWorkflow = {};
    createWorkflow.name = workflowName.value;
    createWorkflow.color = '#2A898F';
    createWorkflow.projectId = projectID;
    createWorkflow.sort = workflowSort;
    if (createWorkflow.name !== '') {
        io.emit('workflow/create', {
            workflow: createWorkflow,
        });
        hideWorkflowBlock();
    } else {
        alert('please enter Workflow Name');
    }

    io.on('workflow/wasCreated', (data) => {
        workflowAdd.innerHTML = '';
        let wrapper = document.createElement('DIV');
        wrapper.className = 'title';
        wrapper.style.backgroundColor = '#2A898F';
        workflowAdd.appendChild(wrapper);

        let workflowName = document.createElement('span');
        workflowName.className = 'workflow';
        workflowName.innerHTML = createWorkflow.name;
        wrapper.appendChild(workflowName);

        let addIcon = document.createElement('span');
        addIcon.className = 'addWorkflow';
        addIcon.innerHTML = '+';
        wrapper.appendChild(addIcon);

        // we do not reload here because we want to show that the workflow is dynamically added to the page
        //location.reload(true);
    });
}

io.on('task/move', (data) => {
    let item = document.querySelector('.task[data-id="' + data.id + '"]');
    if (item) {
        let taskList = document.querySelector(
            '.tasks[data-workflow-id="' + data.workflowId + '"]'
        );
        if (taskList) {
            let index = data.sort;
            if (taskList.children.length < index + 1) {
                taskList.appendChild(item);

                item.style.borderColor = item.parentNode.getAttribute(
                    'data-workflow-color'
                );
            } else {
                let currentIndex = Array.prototype.indexOf.call(
                    taskList.children,
                    item
                );

                if (
                    index !== 0 &&
                    currentIndex !== -1 &&
                    index >= currentIndex
                ) {
                    index = index + 1;
                }

                item.style.borderColor = data.workflowColor;

                let sibling = taskList.children[index];
                taskList.insertBefore(item, sibling);
            }
        }
    }
});

function projectSwitch(elm) {
    const url =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port;

    window.location.href = url;
}

function redirectUserManagement() {
    const url =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/' +
        'userManagement';
    window.location.href = url;
}

function redirectPolicy() {
    const url =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/' +
        'privacy';
    window.location.href = url;
}

function redirectImprint() {
    const url =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/' +
        'imprint';
    window.location.href = url;
}

function redirectDocumentation() {
    const url =
        window.location.protocol +
        '//' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/' +
        'apiDoc';
    window.location.href = url;
}

function logout() {
    document.cookie =
        '_wab_auth_jwt' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
}

function chatOpen(data) {
    var today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;
    document.getElementById('date').innerHTML = '';
    document.getElementById('date').innerHTML = today;

    let wrapper = document.querySelector('.wrapper');
    if (wrapper.className === 'wrapper') {
        wrapper.className = 'wrapper chat-open';
    } else {
        wrapper.className = 'wrapper';
    }

    document.getElementById('chatTitle').innerHTML = data.getAttribute(
        'data-name'
    );

    let personalInfo = document.querySelector('.userInfo');
    personalInfo.style.display = 'block';
    document.querySelector('.chat').style.display = 'none';
}
