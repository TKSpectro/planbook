'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'user',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Tom',
                    lastName: 'Käppler',
                    email: 'tom@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: true,
                    householdId: 1,
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstName: 'Max',
                    lastName: 'Mustermann',
                    email: 'max@mail.com',
                    passwordHash:
                        '$2b$10$nsNf6L5XPv6wOHcC.oWzCuh/dDeFPuEmSYm5IZ4iJyOLe4OAsrIA2', // bCrypt 10 12345678
                    isAdmin: false,
                    householdId: 2,
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', null, {});
    },
};
