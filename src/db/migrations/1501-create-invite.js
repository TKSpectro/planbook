'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('invite', {
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
            validUntil: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            wasUsed: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            invitedEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            link: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            senderId: {
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
        return queryInterface.dropTable('invite');
    },
};
