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
                    name: 'Refund',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Rent',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Others',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Cost of living',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Clothing',
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Free time',
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('category', null, {});
    },
};
