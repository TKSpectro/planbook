'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('payment', {
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
            entryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'entry',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('payment');
    },
};
