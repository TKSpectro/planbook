'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('moneypool', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(350),
                allowNull: true,
            },
            totalNeededMoney: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            householdId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'household',
                    },
                    key: 'id',
                },
                allowNull: false,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('moneypool');
    },
};
