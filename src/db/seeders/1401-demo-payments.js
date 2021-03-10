'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'payment',
            [
                {
                    createdAt: new Date('2021.03.01 12:00:00'),
                    updatedAt: new Date('2021.03.01 12:00:00'),
                    value: -10.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 1,
                },
                {
                    createdAt: new Date('2021.03.02 12:00:00'),
                    updatedAt: new Date('2021.03.02 12:00:00'),
                    value: 100.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 2,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: -20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 3,
                },
                {
                    createdAt: new Date('2021.03.04 12:00:00'),
                    updatedAt: new Date('2021.03.04 12:00:00'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.05 12:00:00'),
                    updatedAt: new Date('2021.03.05 12:00:00'),
                    value: -30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.06 12:00:00'),
                    updatedAt: new Date('2021.03.06 12:00:00'),
                    value: 30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.07 12:00:00'),
                    updatedAt: new Date('2021.03.07 12:00:00'),
                    value: 40.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.08 12:00:00'),
                    updatedAt: new Date('2021.03.08 12:00:00'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.09 12:00:00'),
                    updatedAt: new Date('2021.03.09 12:00:00'),
                    value: -100.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.10 12:00:00'),
                    updatedAt: new Date('2021.03.10 12:00:00'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.11 12:00:00'),
                    updatedAt: new Date('2021.03.11 12:00:00'),
                    value: 30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.12 12:00:00'),
                    updatedAt: new Date('2021.03.12 12:00:00'),
                    value: 40.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.13 12:00:00'),
                    updatedAt: new Date('2021.03.13 12:00:00'),
                    value: -20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 70.0,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 1,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 105.0,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 1,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 25.0,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 5,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 15.0,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 5,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 50.0,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 6,
                },
                {
                    createdAt: new Date('2021.03.03 12:00:00'),
                    updatedAt: new Date('2021.03.03 12:00:00'),
                    value: 150,
                    householdId: 1,
                    moneypoolId: 1,
                    userId: 6,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('payment', null, {});
    },
};
