'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'moneypool',
            [
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'vacation',
                    description: 'vacation to Japan',
                    currentNeededMoney: 4000,
                    totalNeededMoney: 4000,
                    householdId: 1,
                },
                {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: 'vacation',
                    description: 'vacation to Japan',
                    currentNeededMoney: 4000,
                    totalNeededMoney: 4000,
                    householdId: 1,
                },
            ],
            {}
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('moneypool', null, {});
    },
};
