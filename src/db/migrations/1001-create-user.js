'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user', {
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
                isEmail: true,
                unique: 'uniqueEmail',
            },
            passwordHash: {
                type: Sequelize.STRING(256),
                allowNull: true,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user');
    },
};
