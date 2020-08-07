'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(320),
                allowNull: false,
            },
            passwordHash: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            permission: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultVaulue: 0,
                comment: 'bit mask of permission from 2^0 to 2^30',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user');
    },
};
