'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('entry', {
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
            income: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            timeStamp: {
                type: Sequelize.DATE,
                allowNull: false,
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
                type: Sequelize.INTEGER,
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
                allowNull: true,
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
        return queryInterface.dropTable('entry');
    },
};
