'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'householdUser',
            [
                {
                    id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 1,
                    householdId: 1,
                },
                {
                    id: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 2,
                    householdId: 2,
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('householdUser', null, {});
    },
};
