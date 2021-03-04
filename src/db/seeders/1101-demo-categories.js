'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'category',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Food',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Entertainment',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Gifts',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Income',
                },
                {
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
