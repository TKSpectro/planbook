'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'household',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'MyHome',
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'NotMyHome',
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('household', null, {});
    },
};
