'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('household', {
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
            ownerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'user',
                    },
                    key: 'id',
                },
                allowNull: false,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('household');
    },
};
