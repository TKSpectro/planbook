'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'entry',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeStamp: new Date(),
                    income: false,
                    value: 10.0,
                    purpose: 'bought some donuts',
                    categoryId: 1,
                    householdId: 1,
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeStamp: new Date(),
                    income: false,
                    value: 10.0,
                    interval: 60 * 24 * 30,
                    purpose: 'rental',
                    householdId: 1,
                },
                {
                    id: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeStamp: new Date(),
                    income: true,
                    value: 10.0,
                    purpose: 'gift from grandma',
                    householdId: 1,
                },
                {
                    id: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeStamp: new Date(),
                    income: true,
                    value: 10.0,
                    interval: 60 * 24 * 30,
                    purpose: 'job',
                    householdId: 1,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('entry', null, {});
    },
};
