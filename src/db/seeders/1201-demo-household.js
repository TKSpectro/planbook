'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'household',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Käppis',
                    ownerId: 1,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Haushaltsbuch - Bilal',
                    ownerId: 3,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Haushaltsbuch - Olga',
                    ownerId: 4,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Haushaltsbuch - Max',
                    ownerId: 2,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('household', null, {});
    },
};
