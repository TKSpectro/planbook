'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'user',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Tom',
                    lastName: 'Käppler',
                    email: 'tom@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Max',
                    lastName: 'Mustermann',
                    email: 'max@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Bilal',
                    lastName: 'Alnaani',
                    email: 'bilal@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Olga',
                    lastName: 'Klassen',
                    email: 'olga@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Jens',
                    lastName: 'Käppler',
                    email: 'jens@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Bettina',
                    lastName: 'Käppler',
                    email: 'bettina@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', null, {});
    },
};
