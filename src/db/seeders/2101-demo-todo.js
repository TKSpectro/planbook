'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'todo',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    task: 'Buy bananas',
                    value: 5,
                    done: true,
                    householdId: 1,
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    task: 'Buy toilet paper',
                    value: null,
                    done: false,
                    householdId: 1,
                },
                {
                    id: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    task: 'Buy water',
                    value: 3,
                    done: true,
                    householdId: 1,
                },
                {
                    id: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    task: 'Buy noodles',
                    value: null,
                    done: false,
                    householdId: 1,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('household', null, {});
    },
};
