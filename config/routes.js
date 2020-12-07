const PagesController = require('../controllers/pagesController.js');
const ApiUsersController = require('../controllers/api/usersController.js');
const ApiInvitesController = require('../controllers/api/invitesController.js');
const ApiCategoriesController = require('../controllers/api/categoriesController.js');
const ApiHouseholdsController = require('../controllers/api/householdsController.js');
const ApiHouseholdsUsersController = require('../controllers/api/householdsUsersController.js');
const ApiEntriesController = require('../controllers/api/entriesController.js');
const ApiTodosController = require('../controllers/api/todosController.js');

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
            { path: '/dashboard/:id', action: 'dashboardOne', method: 'get' },
            { path: '/todo', action: 'todo', method: 'get' },
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
            { path: '/api/invites/:email', action: 'create', method: 'POST' },
            { path: '/api/invites/:link', action: 'update', method: 'PUT' },
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
            { path: '/api/households', action: 'update', method: 'PUT' },
            { path: '/api/households/:id', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/householdsUsers': {
        controller: ApiHouseholdsUsersController,
        actions: [
            { path: '/api/householdsUsers', action: 'getAll', method: 'GET' },
            { path: '/api/householdsUsers', action: 'create', method: 'POST' },
            {
                path: '/api/householdsUsers/:id',
                action: 'update',
                method: 'PUT',
            },
            {
                path: '/api/householdsUsers/:id',
                action: 'delete',
                method: 'DELETE',
            },
        ],
    },
    'api/entries': {
        controller: ApiEntriesController,
        actions: [
            { path: '/api/entries', action: 'getAll', method: 'GET' },
            { path: '/api/entries/:id', action: 'getOne', method: 'GET' },
            { path: '/api/entries', action: 'create', method: 'POST' },
            { path: '/api/entries/:id', action: 'update', method: 'PUT' },
            { path: '/api/entries/:id', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/todos': {
        controller: ApiTodosController,
        actions: [
            { path: '/api/todos', action: 'getAll', method: 'GET' },
            { path: '/api/todos/:id', action: 'getOne', method: 'GET' },
            { path: '/api/todos', action: 'create', method: 'POST' },
            { path: '/api/todos/:id', action: 'update', method: 'PUT' },
            { path: '/api/todos/:id', action: 'delete', method: 'DELETE' },
        ],
    },
};

module.exports = routes;
