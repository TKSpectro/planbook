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
                    name: 'Käppis',
                    ownerId: 1,
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Haushaltsbuch - Bilal',
                    ownerId: 3,
                },
                {
                    id: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'Haushaltsbuch - Olga',
                    ownerId: 4,
                },
                {
                    id: 4,
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
