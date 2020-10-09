const PagesController = require('../controllers/pagesController.js');
const ApiUsersController = require('../controllers/api/usersController.js');
const ApiInvitesController = require('../controllers/api/invitesController.js');
const ApiCategoriesController = require('../controllers/api/categoriesController.js');
const ApiHouseholdsController = require('../controllers/api/householdsController.js');

let routes = {
    pages: {
        controller: PagesController,
        actions: [
            { path: '/', action: 'index', method: 'get' },
            { path: '/imprint', action: 'imprint', method: 'get' },
            { path: '/privacy', action: 'privacy', method: 'get' },
            { path: '/login', action: 'signin', method: 'get' },
            { path: '/register', action: 'signup', method: 'get' },
            { path: '/dashboard', action: 'dashboard', method: 'get' },
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
            { path: '/api/invites/:email', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/categories': {
        controller: ApiCategoriesController,
        actions: [
            { path: '/api/categories', action: 'getAll', method: 'GET' },
            { path: '/api/categories/:id', action: 'getOne', method: 'GET' },
            //no put because categories should not be updated
            { path: '/api/categories', action: 'create', method: 'POST' },
            { path: '/api/categories/:id', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/households': {
        controller: ApiHouseholdsController,
        actions: [
            { path: '/api/households', action: 'getAll', method: 'GET' },
            { path: '/api/households/:id', action: 'getOne', method: 'GET' },
            { path: '/api/households', action: 'create', method: 'POST' },
            { path: '/api/households/:id', action: 'delete', method: 'DELETE' },
        ],
    },
};

module.exports = routes;
