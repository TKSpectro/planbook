'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('recurringPayment', {
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
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            value: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            purpose: {
                type: Sequelize.STRING(320),
                allowNull: false,
            },
            interval: {
                type: Sequelize.ENUM(
                    'daily',
                    'weekly',
                    'monthly',
                    'quarterly',
                    'yearly'
                ),
                allowNull: true,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'category',
                    },
                    key: 'id',
                },
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
        return queryInterface.dropTable('recurringPayment');
    },
};
