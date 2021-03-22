const PagesController = require('../controllers/pagesController.js');
const ApiUsersController = require('../controllers/api/usersController.js');
const ApiInvitesController = require('../controllers/api/invitesController.js');
const ApiCategoriesController = require('../controllers/api/categoriesController.js');
const ApiHouseholdsController = require('../controllers/api/householdsController.js');
const ApiHouseholdsUsersController = require('../controllers/api/householdsUsersController.js');
const ApiRecurringPaymentsController = require('../controllers/api/recurringPaymentsController.js');
const ApiPaymentsController = require('../controllers/api/paymentsController.js');
const ApiCronController = require('../controllers/api/cronController.js');
const ApiMoneypoolsController = require('../controllers/api/moneypoolsController.js');

let routes = {
    pages: {
        controller: PagesController,
        actions: [
            { path: '/', action: 'index', method: 'get' },
            { path: '/imprint', action: 'imprint', method: 'get' },
            { path: '/privacy', action: 'privacy', method: 'get' },
            { path: '/login', action: 'login', method: 'get' },
            { path: '/register', action: 'register', method: 'get' },
            { path: '/dashboard', action: 'dashboard', method: 'get' },
            { path: '/payments', action: 'payments', method: 'get' },
            {
                path: '/recurringPayments',
                action: 'recurringPayments',
                method: 'get',
            },
            { path: '/members', action: 'members', method: 'get' },
            { path: '/moneypools', action: 'moneypools', method: 'get' },
        ],
    },
    'api/users': {
        controller: ApiUsersController,
        actions: [
            { path: '/api/users', action: 'getAll', method: 'GET' },
            { path: '/api/users/:id', action: 'getOne', method: 'GET' },
            { path: '/api/users', action: 'register', method: 'POST' },
            { path: '/api/users/:id', action: 'update', method: 'PUT' },
            { path: '/api/users/:id', action: 'delete', method: 'DELETE' },
            { path: '/api/login', action: 'login', method: 'POST' },
            { path: '/api/register', action: 'register', method: 'POST' },
            { path: '/api/signout', action: 'signout', method: 'GET' },
        ],
    },
    'api/invites': {
        controller: ApiInvitesController,
        actions: [
            { path: '/api/invites', action: 'getAll', method: 'GET' },
            { path: '/api/invites', action: 'create', method: 'POST' },
            { path: '/api/invites', action: 'update', method: 'PUT' },
            { path: '/api/invites', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/categories': {
        controller: ApiCategoriesController,
        actions: [
            { path: '/api/categories', action: 'getAll', method: 'GET' },
            { path: '/api/categories', action: 'create', method: 'POST' },
            { path: '/api/categories', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/households': {
        controller: ApiHouseholdsController,
        actions: [
            { path: '/api/households', action: 'create', method: 'POST' },
            { path: '/api/households', action: 'update', method: 'PUT' },
            { path: '/api/households', action: 'delete', method: 'DELETE' },
        ],
    },
    'api/householdsUsers': {
        controller: ApiHouseholdsUsersController,
        actions: [
            { path: '/api/householdsUsers', action: 'getAll', method: 'GET' },
            { path: '/api/householdsUsers', action: 'create', method: 'POST' },
            {
                path: '/api/householdsUsers',
                action: 'delete',
                method: 'DELETE',
            },
        ],
    },
    'api/recurringPayments': {
        controller: ApiRecurringPaymentsController,
        actions: [
            {
                path: '/api/recurringPayments',
                action: 'getAll',
                method: 'GET',
            },
            {
                path: '/api/recurringPayments',
                action: 'create',
                method: 'POST',
            },
            {
                path: '/api/recurringPayments',
                action: 'update',
                method: 'PUT',
            },
            {
                path: '/api/recurringPayments',
                action: 'delete',
                method: 'DELETE',
            },
        ],
    },
    'api/payments': {
        controller: ApiPaymentsController,
        actions: [
            {
                path: '/api/payments',
                action: 'getAll',
                method: 'GET',
            },
            {
                path: '/api/payments',
                action: 'create',
                method: 'POST',
            },
        ],
    },
    'api/cron': {
        controller: ApiCronController,
        actions: [
            {
                path: '/api/cron/bookRecurringPayments',
                action: 'bookRecurringPayments',
                method: 'POST',
            },
            {
                path: '/api/cron/deploy',
                action: 'deploy',
                method: 'POST',
            },
        ],
    },
    'api/moneypools': {
        controller: ApiMoneypoolsController,
        actions: [
            {
                path: '/api/moneypools',
                action: 'get',
                method: 'GET',
            },
            {
                path: '/api/moneypools',
                action: 'create',
                method: 'POST',
            },
            {
                path: '/api/moneypools',
                action: 'update',
                method: 'PUT',
            },
        ],
    },
};

module.exports = routes;
