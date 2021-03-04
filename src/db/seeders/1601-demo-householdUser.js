'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'householdUser',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 1,
                    householdId: 1,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 2,
                    householdId: 4,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 3,
                    householdId: 2,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 4,
                    householdId: 3,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 5,
                    householdId: 1,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    timeJoined: new Date(),
                    userId: 6,
                    householdId: 1,
                },
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('householdUser', null, {});
    },
};
