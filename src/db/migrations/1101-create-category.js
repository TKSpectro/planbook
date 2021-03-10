'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('category', {
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
                unique: 'uniqueCategory',
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('category');
    },
};
