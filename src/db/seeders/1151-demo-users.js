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
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Max',
                    lastName: 'Mustermann',
                    email: 'max@mail.com',
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Paul',
                    lastName: 'Low',
                    email: 'paul@mail.com',
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Merton',
                    lastName: 'Aaron',
                    email: 'merton@mail.com',
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Fiona',
                    lastName: 'Bass',
                    email: 'fiona@mail.com',
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Leroy',
                    lastName: 'Gary',
                    email: 'leroy@mail.com',
                    passwordHash: '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
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
