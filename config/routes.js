const PagesController = require('../controllers/pagesController.js');
const ApiUsersController = require('../controllers/api/usersController.js');
const ApiInvitesController = require('../controllers/api/invitesController.js');

let routes = {
    pages: {
        controller: PagesController,
        actions: [
            { path: '/', action: 'index', method: 'get' },
            { path: '/imprint', action: 'imprint', method: 'get' },
            { path: '/privacy', action: 'privacy', method: 'get' },
            { path: '/signin', action: 'signin', method: 'get' },
        ],
    },
    'api/users': {
        controller: ApiUsersController,
        actions: [
            { path: '/api/users', action: 'getAll', method: 'GET' },
            { path: '/api/users/:id', action: 'getOne', method: 'GET' },
            { path: '/api/users', action: 'signup', method: 'POST' },
            { path: '/api/users/:id', action: 'update', method: 'PUT' },
            { path: '/api/users/:id', action: 'delete', method: 'DELETE' },
            { path: '/api/signin', action: 'signin', method: 'POST' },
            { path: '/api/signup', action: 'signup', method: 'POST' },
            { path: '/api/signout', action: 'signout', method: 'GET' },
        ],
    },
    'api/invites': {
        controller: ApiInvitesController,
        actions: [
            { path: '/api/invites', action: 'getAll', method: 'GET' },
            { path: '/api/invites/:id', action: 'getOne', method: 'GET' },
            { path: '/api/invites/:email', action: 'create', method: 'POST' },
        ],
    },
};

module.exports = routes;
