'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'category',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Food',
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Entertainment',
                },
                {
                    id: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Gifts',
                },
                {
                    id: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Income',
                },
                {
                    id: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'General',
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('category', null, {});
    },
};
