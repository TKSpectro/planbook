'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'payment',
            [
                {
                    createdAt: new Date('2021.03.01'),
                    value: -10.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 1,
                },
                {
                    createdAt: new Date('2021.03.02'),
                    value: 100.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 2,
                },
                {
                    createdAt: new Date('2021.03.03'),
                    value: -20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 3,
                },
                {
                    createdAt: new Date('2021.03.04'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.05'),
                    value: -30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.06'),
                    value: 30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.07'),
                    value: 40.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.08'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.09'),
                    value: -100.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.10'),
                    value: 20.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.11'),
                    value: 30.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.12'),
                    value: 40.0,
                    purpose: 'test payment',
                    householdId: 1,
                    categoryId: 4,
                },
                {
                    createdAt: new Date('2021.03.13'),
                    value: -20.0,
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
