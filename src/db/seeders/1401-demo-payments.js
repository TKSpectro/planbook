'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'payment',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: -10.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 1,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: 10.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 2,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: -20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 3,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('payment', null, {});
    },
};
